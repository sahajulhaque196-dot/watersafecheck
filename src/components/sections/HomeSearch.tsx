'use client'
// src/components/sections/HomeSearch.tsx
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

export function HomeSearch() {
  const [zip, setZip] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const clean = zip.replace(/\D/g, '').slice(0, 5)
    if (clean.length !== 5) {
      setError('Please enter a valid 5-digit U.S. ZIP code')
      inputRef.current?.focus()
      return
    }
    setError('')
    setLoading(true)
    router.push(`/zip/${clean}`)
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      <form onSubmit={handleSubmit} className="flex gap-2" role="search">
        <div className="relative flex-1">
          <label htmlFor="zip-search" className="sr-only">Enter your ZIP code</label>
          <input
            id="zip-search"
            ref={inputRef}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={zip}
            onChange={e => {
              setZip(e.target.value.replace(/\D/g, '').slice(0, 5))
              setError('')
            }}
            placeholder="Enter ZIP code (e.g. 90210)"
            className="w-full px-5 py-4 text-gray-900 text-lg rounded-xl border-0 focus:outline-none focus:ring-4 focus:ring-white/30 shadow-lg placeholder-gray-400"
            maxLength={5}
            autoComplete="postal-code"
            aria-label="ZIP code"
            aria-describedby={error ? 'zip-error' : undefined}
          />
          {/* Live char counter */}
          {zip.length > 0 && zip.length < 5 && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400">
              {5 - zip.length} more
            </span>
          )}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-4 bg-gradient-to-r from-brand-500 to-water-500 hover:from-brand-400 hover:to-water-400 disabled:from-brand-800 disabled:to-brand-800 text-white font-bold text-lg rounded-xl shadow-[0_4px_14px_rgba(45,212,191,0.4)] hover:shadow-[0_6px_20px_rgba(45,212,191,0.6)] transition-all duration-200 whitespace-nowrap flex items-center gap-2 border border-white/20"
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

      {error && (
        <p id="zip-error" className="mt-2 text-sm text-red-300 text-center" role="alert">
          {error}
        </p>
      )}

      {/* Quick links */}
      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        <span className="text-sm text-blue-200">Try:</span>
        {[
          { label: 'New York 10001', zip: '10001' },
          { label: 'Los Angeles 90001', zip: '90001' },
          { label: 'Chicago 60601', zip: '60601' },
          { label: 'Houston 77001', zip: '77001' },
        ].map(({ label, zip: z }) => (
          <button
            key={z}
            type="button"
            onClick={() => router.push(`/zip/${z}`)}
            className="text-sm text-blue-200 hover:text-white underline underline-offset-2 transition-colors"
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
