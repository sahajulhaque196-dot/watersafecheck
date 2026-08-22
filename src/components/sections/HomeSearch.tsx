'use client'
// src/components/sections/HomeSearch.tsx
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { cityToSlug } from '@/lib/data'

interface SearchResult {
  zip: string
  city: string
  state: string
  grade: string
  score: number | null
}

export function HomeSearch() {
  const [query, setQuery] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Live autocomplete search
  useEffect(() => {
    const trimmed = query.trim()
    if (trimmed.length < 2) {
      setResults([])
      setIsDropdownOpen(false)
      return
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`)
        if (res.ok) {
          const data = await res.json()
          setResults(data.results || [])
          setIsDropdownOpen((data.results || []).length > 0)
        }
      } catch (err) {
        console.error('Search fetch error:', err)
      }
    }, 200)

    return () => clearTimeout(timer)
  }, [query])

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = query.trim()

    // 1. If 5-digit ZIP entered
    const numericZip = trimmed.replace(/\D/g, '')
    if (numericZip.length === 5) {
      setError('')
      setLoading(true)
      setIsDropdownOpen(false)
      router.push(`/zip/${numericZip}`)
      return
    }

    // 2. If results exist, pick first result
    if (results.length > 0) {
      const top = results[0]
      setError('')
      setLoading(true)
      setIsDropdownOpen(false)
      router.push(`/zip/${top.zip}`)
      return
    }

    if (trimmed.length < 2) {
      setError('Please enter a 5-digit ZIP code or City name')
      inputRef.current?.focus()
      return
    }

    setError('No matching ZIP code or city found. Please check spelling.')
  }

  function handleSelectResult(r: SearchResult) {
    setIsDropdownOpen(false)
    setLoading(true)
    router.push(`/zip/${r.zip}`)
  }

  return (
    <div ref={containerRef} className="w-full max-w-xl mx-auto relative">
      <form onSubmit={handleSubmit} className="flex gap-2" role="search">
        <div className="relative flex-1">
          <label htmlFor="zip-search" className="sr-only">Enter ZIP code or City name</label>
          <input
            id="zip-search"
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value)
              setError('')
            }}
            onFocus={() => {
              if (results.length > 0) setIsDropdownOpen(true)
            }}
            placeholder="Enter ZIP code or City (e.g. 90210, Dallas, Miami)"
            className="w-full px-4 sm:px-5 py-3 sm:py-4 text-gray-900 text-base sm:text-lg rounded-xl border-0 focus:outline-none focus:ring-4 focus:ring-white/30 shadow-lg placeholder-gray-400 font-medium"
            autoComplete="off"
            aria-label="ZIP code or City"
            aria-describedby={error ? 'zip-error' : undefined}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-brand-500 to-water-500 hover:from-brand-400 hover:to-water-400 disabled:from-brand-800 disabled:to-brand-800 text-white font-bold text-base sm:text-lg rounded-xl shadow-[0_4px_14px_rgba(45,212,191,0.4)] hover:shadow-[0_6px_20px_rgba(45,212,191,0.6)] transition-all duration-200 whitespace-nowrap flex items-center gap-1.5 sm:gap-2 border border-white/20 flex-shrink-0"
          aria-label="Check water quality"
        >
          {loading ? (
            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
          Check
        </button>
      </form>

      {/* Autocomplete Dropdown Results */}
      {isDropdownOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 divide-y divide-gray-100 max-h-80 overflow-y-auto">
          {results.map(r => (
            <button
              key={r.zip}
              type="button"
              onClick={() => handleSelectResult(r)}
              className="w-full px-4 py-3 text-left hover:bg-brand-50 flex items-center justify-between transition-colors group"
            >
              <div>
                <span className="font-bold text-gray-900 group-hover:text-brand-700">{r.zip}</span>
                <span className="text-gray-500 ml-2 text-sm">{r.city}, {r.state}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  r.grade === 'A' ? 'bg-emerald-100 text-emerald-800' :
                  r.grade === 'B' ? 'bg-blue-100 text-blue-800' :
                  r.grade === 'C' ? 'bg-amber-100 text-amber-800' :
                  'bg-rose-100 text-rose-800'
                }`}>
                  Grade {r.grade}
                </span>
                <span className="text-xs text-gray-400 font-medium">{r.score ?? '—'}/100</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {error && (
        <p id="zip-error" className="mt-2 text-sm text-red-300 text-center" role="alert">
          {error}
        </p>
      )}

      {/* Quick links */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5 py-1.5 px-4 rounded-full bg-black/60 backdrop-blur-md border border-white/20 shadow-xl max-w-fit mx-auto">
        <span className="text-xs sm:text-sm font-bold text-cyan-300 uppercase tracking-wider">Try:</span>
        {[
          { label: 'New York 10001', zip: '10001' },
          { label: 'Los Angeles 90001', zip: '90001' },
          { label: 'Chicago 60601', zip: '60601' },
        ].map(({ label, zip: z }) => (
          <button
            key={z}
            type="button"
            onClick={() => router.push(`/zip/${z}`)}
            className="text-xs sm:text-sm font-semibold text-white hover:text-cyan-300 underline underline-offset-4 decoration-white/40 hover:decoration-cyan-300 transition-all whitespace-nowrap"
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}


