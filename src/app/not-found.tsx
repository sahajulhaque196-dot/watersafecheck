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

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/" className="btn-primary">← Back to Homepage</Link>
        <Link href="/water-quality-guide" className="btn-secondary">Water Safety Guide</Link>
      </div>
    </div>
  )
}
