'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export function CookieConsent() {
  const [show, setShow] = useState(true)

  useEffect(() => {
    try {
      const consent = localStorage.getItem('watersafe_cookie_consent')
      if (consent) {
        setShow(false)
      }
    } catch {
      // localStorage may fail in private mode
    }
  }, [])

  function handleAccept() {
    try {
      localStorage.setItem('watersafe_cookie_consent', 'accepted')
    } catch {}
    setShow(false)
  }

  function handleDecline() {
    try {
      localStorage.setItem('watersafe_cookie_consent', 'declined')
    } catch {}
    setShow(false)
  }

  if (!show) return null

  return (
    <div
      role="region"
      aria-label="Cookie and Privacy Consent"
      className="fixed bottom-0 inset-x-0 z-50 p-4 sm:p-6 bg-slate-900/95 backdrop-blur-md border-t border-slate-700 text-white shadow-2xl transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-4xl text-center sm:text-left">
          <p>
            We use cookies to personalize content, support site features, analyze traffic, and display relevant advertising via Google AdSense. By continuing to use our website or clicking &quot;Accept All&quot;, you consent to our use of cookies in accordance with our{' '}
            <Link href="/privacy" className="text-cyan-400 underline underline-offset-2 hover:text-cyan-300 font-medium">
              Privacy &amp; Cookie Policy
            </Link>.
          </p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={handleDecline}
            type="button"
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl transition-colors cursor-pointer"
          >
            Essential Only
          </button>
          <button
            onClick={handleAccept}
            type="button"
            className="px-5 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300 rounded-xl shadow-md transition-all cursor-pointer"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  )
}
