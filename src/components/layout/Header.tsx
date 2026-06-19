'use client'
// src/components/layout/Header.tsx
import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

const Logo = () => (
  <div className="flex items-center gap-2">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 70 90" width="30" height="38" aria-hidden="true">
      <defs>
        <linearGradient id="hShield" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1e6fd9" />
          <stop offset="100%" stopColor="#0d4a94" />
        </linearGradient>
        <linearGradient id="hDrop" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4fc3f7" />
          <stop offset="100%" stopColor="#1e88e5" />
        </linearGradient>
      </defs>
      <path d="M5 12 L35 2 L65 12 L65 48 Q65 70 35 85 Q5 70 5 48 Z" fill="url(#hShield)" stroke="#0d4a94" strokeWidth="1.5"/>
      <path d="M35 20 Q35 20 46 40 Q52 52 44 58 Q40 62 35 62 Q30 62 26 58 Q18 52 24 40 Q35 20 35 20 Z" fill="url(#hDrop)" opacity="0.9"/>
      <polyline points="28,46 34,53 46,38" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
    <div className="leading-none">
      <div className="flex items-baseline">
        <span className="font-black text-lg text-brand-800 tracking-tight">Water</span>
        <span className="font-black text-lg text-blue-500 tracking-tight">Safe</span>
        <span className="font-black text-lg text-brand-800 tracking-tight">Check</span>
      </div>
      <div className="hidden sm:block text-[8.5px] font-semibold text-gray-400 tracking-[0.18em] uppercase mt-0.5">
        Is Your Tap Water Safe?
      </div>
    </div>
  </div>
)

export function Header() {
  const [zip, setZip] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const pathname = usePathname()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setMenuOpen(false)
    setError('')
  }, [pathname])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const clean = zip.replace(/\D/g, '').slice(0, 5)
    if (clean.length !== 5) {
      setError('Enter a valid 5-digit ZIP')
      return
    }
    setError('')
    setZip('')
    router.push(`/zip/${clean}`)
  }

  return (
    <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-3">
          <Link href="/" className="flex-shrink-0" aria-label="WaterSafeCheck Home">
            <Logo />
          </Link>

          {/* Desktop Search */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center gap-2 flex-1 max-w-xs mx-4" role="search">
            <div className="relative flex-1">
              <label htmlFor="header-zip" className="sr-only">Search by ZIP code</label>
              <input
                id="header-zip"
                ref={inputRef}
                type="text"
                inputMode="numeric"
                value={zip}
                onChange={e => { setZip(e.target.value.replace(/\D/g, '').slice(0, 5)); setError('') }}
                placeholder="ZIP code..."
                className="w-full px-4 py-2 text-sm border-2 border-gray-200 rounded-lg focus:outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100 transition-all"
                maxLength={5}
                autoComplete="postal-code"
              />
              {error && <p role="alert" className="absolute top-full left-0 mt-1 text-xs text-red-500 whitespace-nowrap">{error}</p>}
            </div>
            <button type="submit" className="btn-primary py-2 px-3 text-sm whitespace-nowrap" aria-label="Check water quality">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Check
            </button>
          </form>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-5" aria-label="Main navigation">
            <Link href="/blog" className="text-sm text-gray-600 hover:text-brand-700 font-medium transition-colors">Blog</Link>
            <Link href="/water-quality-guide" className="text-sm text-gray-600 hover:text-brand-700 font-medium transition-colors">Safety Guide</Link>
            <Link href="/about" className="text-sm text-gray-600 hover:text-brand-700 font-medium transition-colors">About</Link>
            <Link href="/contact" className="text-sm text-gray-600 hover:text-brand-700 font-medium transition-colors">Contact</Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div id="mobile-menu" className="md:hidden border-t border-gray-100 py-3 space-y-3">
            <form onSubmit={handleSearch} className="flex gap-2" role="search">
              <label htmlFor="mobile-zip" className="sr-only">Search by ZIP code</label>
              <input
                id="mobile-zip"
                type="text"
                inputMode="numeric"
                value={zip}
                onChange={e => { setZip(e.target.value.replace(/\D/g, '').slice(0, 5)); setError('') }}
                placeholder="Enter ZIP code..."
                className="flex-1 px-4 py-2.5 text-sm border-2 border-gray-200 rounded-lg focus:outline-none focus:border-brand-600"
                maxLength={5}
                autoComplete="postal-code"
              />
              <button type="submit" className="btn-primary py-2 px-4 text-sm">Check</button>
            </form>
            {error && <p role="alert" className="text-xs text-red-500 px-1">{error}</p>}
            <nav className="flex flex-col divide-y divide-gray-50" aria-label="Mobile navigation">
              {[
                ['/', '🏠 Home'],
                ['/blog', '📝 Blog'],
                ['/water-quality-guide', '📖 Water Safety Guide'],
                ['/about', '👤 About & Our Team'],
                ['/contact', '✉ Contact Us'],
                ['/disclaimer', '📋 Disclaimer'],
                ['/privacy', '🔒 Privacy Policy'],
              ].map(([href, label]) => (
                <Link key={href} href={href} className="py-2.5 px-1 text-sm font-medium text-gray-700 hover:text-brand-700">
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
