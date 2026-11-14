'use client'
// src/app/error.tsx
import { useEffect } from 'react'
import Link from 'next/link'
import { AlertCircle, RotateCcw, Home } from 'lucide-react'
import { HomeSearch } from '@/components/sections/HomeSearch'

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log non-fatal error gracefully
    console.error('App-level error caught:', error)
  }, [error])

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16 bg-[#F5F5F7]">
      <div className="max-w-xl w-full text-center">
        <div className="apple-card p-8 sm:p-12 bg-white/90 backdrop-blur-2xl border border-slate-200/80 rounded-3xl shadow-apple-card">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-300/40 text-amber-600 flex items-center justify-center text-3xl mx-auto mb-6 shadow-sm">
            <AlertCircle className="w-8 h-8" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 text-xs font-semibold tracking-wide mb-3">
            Temporary Notice
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
            Water Data Stream Interrupted
          </h1>

          <p className="text-sm sm:text-base text-slate-600 mb-8 leading-relaxed max-w-md mx-auto">
            We encountered a temporary hiccup parsing compliance metrics for this record. Try refreshing or search another location below.
          </p>

          <div className="mb-8 p-5 bg-slate-50/80 rounded-2xl border border-slate-200/60 text-left">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 text-center">
              Search Drinking Water by ZIP Code
            </p>
            <HomeSearch />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => reset()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-apple-blue hover:bg-blue-600 text-white font-bold text-sm shadow-md shadow-apple-blue/20 transition-all active:scale-[0.98]"
            >
              <RotateCcw className="w-4 h-4" />
              Reload Report
            </button>
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-all active:scale-[0.98]"
            >
              <Home className="w-4 h-4" />
              Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
