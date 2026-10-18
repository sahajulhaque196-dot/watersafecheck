'use client'
// src/components/layout/Header.tsx
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

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
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  return (
    <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-3">
          <Link href="/" className="flex-shrink-0" aria-label="WaterSafeCheck Home">
            <Logo />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors ${
                pathname === '/' ? 'text-brand-700 font-semibold' : 'text-gray-600 hover:text-brand-700'
              }`}
            >
              Home
            </Link>
            <Link
              href="/blog"
              className={`text-sm font-medium transition-colors ${
                pathname.startsWith('/blog') ? 'text-brand-700 font-semibold' : 'text-gray-600 hover:text-brand-700'
              }`}
            >
              Blog
            </Link>
            <Link
              href="/water-quality-guide"
              className={`text-sm font-medium transition-colors ${
                pathname === '/water-quality-guide' ? 'text-brand-700 font-semibold' : 'text-gray-600 hover:text-brand-700'
              }`}
            >
              Safety Guide
            </Link>
            <Link
              href="/about"
              className={`text-sm font-medium transition-colors ${
                pathname === '/about' ? 'text-brand-700 font-semibold' : 'text-gray-600 hover:text-brand-700'
              }`}
            >
              About
            </Link>
            <Link
              href="/contact"
              className={`text-sm font-medium transition-colors ${
                pathname === '/contact' ? 'text-brand-700 font-semibold' : 'text-gray-600 hover:text-brand-700'
              }`}
            >
              Contact
            </Link>
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
          <div id="mobile-menu" className="md:hidden border-t border-gray-100 py-3 space-y-2">
            <nav className="flex flex-col divide-y divide-gray-50" aria-label="Mobile navigation">
              {[
                ['/', '🏠 Home'],
                ['/blog', '📝 Blog'],
                ['/water-quality-guide', '📖 Water Safety Guide'],
                ['/about', '👤 About & Founder'],
                ['/contact', '✉ Contact Us'],
                ['/terms', '⚖ Terms of Service'],
                ['/disclaimer', '📋 Disclaimer'],
                ['/privacy', '🔒 Privacy Policy'],
              ].map(([href, label]) => (
                <Link
                  key={href}
                  href={href}
                  className={`py-2.5 px-2 text-sm font-medium rounded-lg transition-colors ${
                    pathname === href ? 'text-brand-700 font-semibold bg-brand-50/50' : 'text-gray-700 hover:text-brand-700'
                  }`}
                >
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
