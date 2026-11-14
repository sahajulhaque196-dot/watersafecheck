'use client'
// src/components/layout/Header.tsx
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Search, Menu, X, Shield, ArrowRight } from 'lucide-react'

const AppleLogo = () => (
  <div className="flex items-center gap-2.5 group">
    <div className="relative w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 via-sky-500 to-indigo-600 p-[1.5px] shadow-[0_2px_10px_rgba(0,113,227,0.25)] group-hover:shadow-[0_4px_16px_rgba(0,113,227,0.35)] transition-all duration-300">
      <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center overflow-hidden">
        <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 text-apple-blue" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" fill="url(#blueGrad)" stroke="none" />
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
          <path d="m9 12 2 2 4-4" stroke="white" strokeWidth="2" />
          <defs>
            <linearGradient id="blueGrad" x1="12" y1="2.69" x2="12" y2="22" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0071e3" />
              <stop offset="1" stopColor="#0a84ff" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
    <div className="leading-tight flex flex-col">
      <div className="flex items-center tracking-[-0.03em] font-bold text-base sm:text-[17px] text-[#1d1d1f]">
        <span>Water</span>
        <span className="text-apple-blue mx-[1px]">Safe</span>
        <span>Check</span>
      </div>
      <span className="text-[10px] font-medium text-slate-400 tracking-[0.06em] uppercase hidden sm:block">
        EPA Drinking Water Intelligence
      </span>
    </div>
  </div>
)

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/water-quality-guide', label: 'Safety Guide' },
    { href: '/blog', label: 'Research & News' },
    { href: '/about', label: 'Methodology' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <header className="sticky top-0 z-50 transition-all duration-300">
      <div className="apple-glass border-b border-black/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <Link 
              href="/" 
              className="flex-shrink-0 active:scale-[0.98] transition-transform select-none" 
              aria-label="WaterSafeCheck Home"
            >
              <AppleLogo />
            </Link>

            {/* Desktop Navigation — Apple-style subtle pill nav */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-1.5" aria-label="Main navigation">
              {navLinks.map((link) => {
                const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href)
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-all duration-200 active:scale-[0.97] ${
                      isActive
                        ? 'bg-slate-900/[0.06] text-slate-900 font-semibold shadow-[inset_0_1px_1px_rgba(0,0,0,0.04)]'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-black/[0.03]'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </nav>

            {/* Right Action: Quick Search Pill & Mobile Hamburger */}
            <div className="flex items-center gap-2">
              <Link
                href="/#search"
                className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200/80 active:scale-[0.97] rounded-full transition-all border border-slate-200/60"
              >
                <Search className="w-3.5 h-3.5 text-slate-500" />
                <span>Search ZIP</span>
                <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[9px] font-semibold text-slate-400 bg-white rounded border border-slate-200 shadow-xs">
                  /
                </kbd>
              </Link>

              <Link
                href="/#search"
                className="hidden min-[420px]:inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 text-xs font-semibold text-white bg-apple-blue hover:bg-apple-blue-hover active:scale-[0.96] rounded-full transition-all shadow-[0_2px_8px_rgba(0,113,227,0.3)]"
              >
                <span>Free Check</span>
                <ArrowRight className="w-3 h-3" />
              </Link>

              {/* Mobile hamburger button (44px touch target) */}
              <button
                className="md:hidden w-10 h-10 rounded-full flex items-center justify-center text-slate-700 hover:bg-black/[0.05] active:scale-[0.95] transition-all"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={menuOpen}
              >
                {menuOpen ? <X className="w-5 h-5 text-slate-900" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Backdrop & Drawer */}
      {menuOpen && (
        <>
          {/* Backdrop overlay */}
          <div
            className="md:hidden fixed inset-0 top-14 sm:top-16 bg-black/40 backdrop-blur-xs z-30 transition-opacity"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Sheet */}
          <div className="md:hidden fixed inset-x-0 top-14 sm:top-16 bg-white/95 backdrop-blur-3xl border-b border-black/[0.08] shadow-2xl z-40 max-h-[calc(100vh-4rem)] overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="max-w-md mx-auto px-5 py-6 space-y-2">
              {navLinks.map((link) => {
                const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href)
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center justify-between px-4 py-3 rounded-2xl text-[15px] font-medium transition-colors min-h-[44px] ${
                      isActive
                        ? 'bg-apple-blue/10 text-apple-blue font-semibold'
                        : 'text-slate-800 hover:bg-slate-50 active:bg-slate-100'
                    }`}
                  >
                    <span>{link.label}</span>
                    <ArrowRight className={`w-4 h-4 ${isActive ? 'text-apple-blue' : 'text-slate-400'}`} />
                  </Link>
                )
              })}
              <div className="pt-4 border-t border-slate-100">
                <Link
                  href="/#search"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3.5 bg-apple-blue text-white rounded-full font-semibold text-sm shadow-md active:scale-[0.98] transition-all min-h-[44px]"
                >
                  <Search className="w-4 h-4" />
                  <span>Search 41,000+ U.S. ZIP Codes</span>
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  )
}
