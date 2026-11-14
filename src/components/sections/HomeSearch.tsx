'use client'
// src/components/sections/HomeSearch.tsx
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, Loader2, ArrowRight, MapPin, Sparkles } from 'lucide-react'
import { GradeBadge } from '@/components/ui'

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
  const [selectedIndex, setSelectedIndex] = useState<number>(-1)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Live autocomplete search
  useEffect(() => {
    const trimmed = query.trim()
    if (trimmed.length < 2) {
      setResults([])
      setIsDropdownOpen(false)
      setSelectedIndex(-1)
      return
    }

    const controller = new AbortController()
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`, {
          signal: controller.signal,
        })
        if (res.ok) {
          const data = await res.json()
          const list = data.results || []
          setResults(list)
          setIsDropdownOpen(list.length > 0)
          setSelectedIndex(-1)
        }
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== 'AbortError') {
          console.error('Search fetch error:', err)
        }
      }
    }, 180)

    return () => {
      clearTimeout(timer)
      controller.abort()
    }
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

    // 0. If user selected an item via arrow keys
    if (selectedIndex >= 0 && selectedIndex < results.length) {
      handleSelectResult(results[selectedIndex])
      return
    }

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
      setError('Please enter a 5-digit ZIP code or city name.')
      inputRef.current?.focus()
      return
    }

    setError('No matching ZIP code or city found. Please check your spelling.')
  }

  function handleSelectResult(r: SearchResult) {
    setIsDropdownOpen(false)
    setLoading(true)
    router.push(`/zip/${r.zip}`)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!isDropdownOpen || results.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : results.length - 1))
    } else if (e.key === 'Escape') {
      setIsDropdownOpen(false)
    }
  }

  return (
    <div ref={containerRef} className="w-full max-w-2xl mx-auto relative select-none">
      <form
        onSubmit={handleSubmit}
        className="relative flex items-center p-1.5 sm:p-2 rounded-full bg-white/95 backdrop-blur-2xl shadow-[0_12px_40px_-4px_rgba(0,0,0,0.35),0_0_0_1px_rgba(255,255,255,0.4)] border border-white/60 focus-within:ring-4 focus-within:ring-apple-blue/30 focus-within:border-apple-blue transition-all duration-300"
        role="search"
      >
        <div className="pl-4 sm:pl-5 text-slate-400 flex items-center pointer-events-none">
          <Search className="w-5 h-5 sm:w-5 sm:h-5 text-apple-blue" />
        </div>

        <input
          id="zip-search"
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => {
            setQuery(e.target.value)
            setError('')
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (results.length > 0) setIsDropdownOpen(true)
          }}
          placeholder="Enter 5-digit ZIP code or City (e.g. 90210, Austin, Chicago)"
          className="w-full px-3 sm:px-4 py-3 text-slate-900 text-base sm:text-lg bg-transparent border-0 focus:outline-none placeholder-slate-400 font-medium tracking-tight"
          autoComplete="off"
          aria-label="ZIP code or City"
          aria-describedby={error ? 'zip-error' : undefined}
        />

        {query.length > 0 && (
          <button
            type="button"
            onClick={() => {
              setQuery('')
              setResults([])
              setIsDropdownOpen(false)
              inputRef.current?.focus()
            }}
            className="p-1.5 mr-1 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full transition-all active:scale-90"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex-shrink-0 inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3 sm:py-3.5 bg-apple-blue hover:bg-apple-blue-hover active:scale-[0.96] disabled:opacity-70 text-white font-semibold text-sm sm:text-base rounded-full shadow-[0_4px_14px_rgba(0,113,227,0.35)] transition-all duration-200 cursor-pointer"
          aria-label="Check water quality"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
          ) : (
            <>
              <span>Check</span>
              <ArrowRight className="w-4 h-4 hidden sm:inline" />
            </>
          )}
        </button>
      </form>

      {/* Apple Spotlight Results Modal */}
      {isDropdownOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2.5 bg-white/95 backdrop-blur-3xl rounded-3xl shadow-[0_24px_60px_-12px_rgba(0,0,0,0.25)] border border-slate-200/90 p-2 z-50 max-h-96 overflow-y-auto space-y-1 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
            <span>Instant Results</span>
            <span className="text-[10px] font-medium text-slate-400">Use &uarr;&darr; to navigate</span>
          </div>
          {results.map((r, idx) => {
            const isSelected = idx === selectedIndex
            return (
              <button
                key={r.zip}
                type="button"
                onClick={() => handleSelectResult(r)}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={`w-full px-4 py-3 text-left rounded-2xl flex items-center justify-between transition-all duration-150 ${
                  isSelected ? 'bg-apple-blue text-white shadow-md' : 'hover:bg-slate-100 text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-mono font-bold text-base tracking-tight">{r.zip}</span>
                    <span className={`ml-2 text-sm font-medium ${isSelected ? 'text-white/90' : 'text-slate-500'}`}>
                      {r.city}, {r.state}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    isSelected ? 'bg-white/25 text-white' :
                    r.grade === 'A' ? 'bg-emerald-100 text-emerald-800' :
                    r.grade === 'B' ? 'bg-sky-100 text-sky-800' :
                    r.grade === 'C' ? 'bg-amber-100 text-amber-800' :
                    'bg-rose-100 text-rose-800'
                  }`}>
                    Grade {r.grade}
                  </span>
                  <span className={`text-xs font-semibold ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>
                    {r.score ?? '—'}/100
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      )}

      {error && (
        <div id="zip-error" className="mt-3 px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs sm:text-sm text-rose-200 text-center font-medium backdrop-blur-md" role="alert">
          {error}
        </div>
      )}

      {/* Suggested Fast ZIP Chips */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
        <span className="text-xs font-semibold text-slate-400 tracking-wide">Popular:</span>
        {[
          { label: 'New York (10001)', zip: '10001' },
          { label: 'Los Angeles (90001)', zip: '90001' },
          { label: 'Chicago (60601)', zip: '60601' },
          { label: 'Austin (78701)', zip: '78701' },
        ].map(({ label, zip: z }) => (
          <button
            key={z}
            type="button"
            onClick={() => router.push(`/zip/${z}`)}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-slate-200 hover:text-white text-xs font-medium backdrop-blur-md border border-white/15 transition-all"
          >
            <Sparkles className="w-3 h-3 text-sky-300" />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
