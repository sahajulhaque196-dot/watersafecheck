'use client'
// src/app/not-found.tsx
import Link from 'next/link'
import { HomeSearch } from '@/components/sections/HomeSearch'

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <div className="text-6xl mb-4">🚰</div>
      <h1 className="text-4xl font-black text-gray-900 mb-3">Page Not Found</h1>
      <p className="text-lg text-gray-500 mb-8">
        The ZIP code or page you're looking for doesn't exist in our database,
        or the URL may be incorrect.
      </p>

      <div className="card mb-8">
        <p className="font-semibold text-gray-800 mb-4">Search for your ZIP code:</p>
        <HomeSearch />
      </div>

      {/* Quick browse popular locations for crawl recovery */}
      <div className="card text-left mb-8">
        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Popular States & Cities</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <Link href="/state/ca" className="p-2 rounded bg-gray-50 hover:bg-brand-50 hover:text-brand-700 transition">California</Link>
          <Link href="/state/tx" className="p-2 rounded bg-gray-50 hover:bg-brand-50 hover:text-brand-700 transition">Texas</Link>
          <Link href="/state/fl" className="p-2 rounded bg-gray-50 hover:bg-brand-50 hover:text-brand-700 transition">Florida</Link>
          <Link href="/state/ny" className="p-2 rounded bg-gray-50 hover:bg-brand-50 hover:text-brand-700 transition">New York</Link>
          <Link href="/city/new-york-ny" className="p-2 rounded bg-gray-50 hover:bg-brand-50 hover:text-brand-700 transition">New York, NY</Link>
          <Link href="/city/los-angeles-ca" className="p-2 rounded bg-gray-50 hover:bg-brand-50 hover:text-brand-700 transition">Los Angeles, CA</Link>
          <Link href="/city/chicago-il" className="p-2 rounded bg-gray-50 hover:bg-brand-50 hover:text-brand-700 transition">Chicago, IL</Link>
          <Link href="/city/houston-tx" className="p-2 rounded bg-gray-50 hover:bg-brand-50 hover:text-brand-700 transition">Houston, TX</Link>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/" className="btn-primary">← Back to Homepage</Link>
        <Link href="/water-quality-guide" className="btn-secondary">Water Safety Guide</Link>
      </div>
    </div>
  )
}
