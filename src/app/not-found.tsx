'use client'
// src/app/not-found.tsx
import Link from 'next/link'
import { Droplets, Compass, ArrowLeft, BookOpen } from 'lucide-react'
import { HomeSearch } from '@/components/sections/HomeSearch'

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16 bg-[#F5F5F7]">
      <div className="max-w-2xl w-full text-center">
        {/* Apple 404 Glass Card */}
        <div className="apple-card p-8 sm:p-12 bg-white/90 backdrop-blur-2xl border border-slate-200/80 rounded-3xl shadow-apple-card">
          {/* Glyph Badge */}
          <div className="w-16 h-16 rounded-2xl bg-apple-blue/10 border border-apple-blue/20 text-apple-blue flex items-center justify-center text-3xl mx-auto mb-6 shadow-sm">
            <Droplets className="w-8 h-8" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold tracking-wide mb-3">
            Error 404
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-3">
            Water Report Not Found
          </h1>

          <p className="text-sm sm:text-base text-slate-600 mb-8 max-w-lg mx-auto leading-relaxed">
            The ZIP code, municipality, or editorial guide you requested isn’t registered in our current EPA records, or the address may have moved.
          </p>

          {/* Search Capsule */}
          <div className="mb-8 p-5 sm:p-6 bg-slate-50/80 rounded-2xl border border-slate-200/60 text-left">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 text-center">
              Search by ZIP Code or City Name
            </p>
            <HomeSearch />
          </div>

          {/* Quick Jump Directory */}
          <div className="text-left mb-8 pt-6 border-t border-slate-100">
            <div className="flex items-center gap-2 mb-3">
              <Compass className="w-4 h-4 text-apple-blue" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Popular Drinking Water Reports
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-medium">
              {[
                { label: 'California', href: '/state/ca' },
                { label: 'Texas', href: '/state/tx' },
                { label: 'Florida', href: '/state/fl' },
                { label: 'New York', href: '/state/ny' },
                { label: 'New York, NY', href: '/city/new-york-ny' },
                { label: 'Los Angeles, CA', href: '/city/los-angeles-ca' },
                { label: 'Chicago, IL', href: '/city/chicago-il' },
                { label: 'Houston, TX', href: '/city/houston-tx' },
              ].map((loc, idx) => (
                <Link
                  key={idx}
                  href={loc.href}
                  className="px-3 py-2 rounded-xl bg-slate-100/80 hover:bg-white hover:text-apple-blue hover:shadow-sm border border-transparent hover:border-slate-200/60 transition-all text-slate-700 text-center truncate"
                >
                  {loc.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-apple-blue hover:bg-blue-600 text-white font-bold text-sm shadow-md shadow-apple-blue/20 transition-all active:scale-[0.98]"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Homepage
            </Link>
            <Link
              href="/water-quality-guide"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition-all active:scale-[0.98]"
            >
              <BookOpen className="w-4 h-4" />
              Water Quality Guide
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
