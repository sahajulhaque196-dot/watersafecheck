'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { GradeBadge } from '@/components/ui'

interface ZipItem {
  zip: string
  city: string
  state: string
  score: number | null
  grade: string
  health_violations: number
  lead_risk?: string
  system_name?: string
}

interface CityZipDirectoryProps {
  zips: ZipItem[]
  cityName: string
  stateCode: string
}

export function CityZipDirectory({ zips, cityName, stateCode }: CityZipDirectoryProps) {
  const [search, setSearch] = useState('')
  const [filterGrade, setFilterGrade] = useState<'ALL' | 'A' | 'B' | 'CF' | 'SAFE'>('ALL')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [isExpanded, setIsExpanded] = useState(false)

  // Pre-calculate counts for filter tabs
  const countA = useMemo(() => zips.filter(z => z.grade === 'A').length, [zips])
  const countB = useMemo(() => zips.filter(z => z.grade === 'B').length, [zips])
  const countCF = useMemo(() => zips.filter(z => ['C', 'D', 'F'].includes(z.grade)).length, [zips])
  const countSafe = useMemo(() => zips.filter(z => z.health_violations === 0).length, [zips])

  // Filtered list based on search and tab
  const filteredZips = useMemo(() => {
    return zips.filter(z => {
      // Search matching (ZIP digits or system name)
      const q = search.trim().toLowerCase()
      const matchesSearch = !q || z.zip.includes(q) || (z.system_name && z.system_name.toLowerCase().includes(q))
      if (!matchesSearch) return false

      // Tab filter
      if (filterGrade === 'A') return z.grade === 'A'
      if (filterGrade === 'B') return z.grade === 'B'
      if (filterGrade === 'CF') return ['C', 'D', 'F'].includes(z.grade)
      if (filterGrade === 'SAFE') return z.health_violations === 0
      return true
    })
  }, [zips, search, filterGrade])

  const initialLimit = 24
  const shouldShowExpand = !search && filterGrade === 'ALL' && zips.length > initialLimit && !isExpanded
  const displayedZips = shouldShowExpand ? filteredZips.slice(0, initialLimit) : filteredZips

  return (
    <div className="mb-10">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            Water Quality by ZIP Code — {cityName}, {stateCode}
          </h2>
          <p className="text-sm text-gray-500">
            Showing {filteredZips.length} of {zips.length} monitored ZIP code{zips.length > 1 ? 's' : ''} in {cityName}
          </p>
        </div>

        {/* View Toggle (Grid / Table) */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="bg-gray-100 p-1 rounded-xl flex items-center gap-1 border border-gray-200">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'grid'
                  ? 'bg-white text-brand-800 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              aria-label="Grid View"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Cards
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'table'
                  ? 'bg-white text-brand-800 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              aria-label="Table View"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              Compact Table
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Instant Search Bar */}
      <div className="card mb-6 p-4 sm:p-5 bg-white shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Quick Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              type="button"
              onClick={() => { setFilterGrade('ALL'); setIsExpanded(true) }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                filterGrade === 'ALL'
                  ? 'bg-brand-700 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All ({zips.length})
            </button>
            {countA > 0 && (
              <button
                type="button"
                onClick={() => { setFilterGrade('A'); setIsExpanded(true) }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  filterGrade === 'A'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/50'
                }`}
              >
                Grade A ({countA})
              </button>
            )}
            {countB > 0 && (
              <button
                type="button"
                onClick={() => { setFilterGrade('B'); setIsExpanded(true) }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  filterGrade === 'B'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200/50'
                }`}
              >
                Grade B ({countB})
              </button>
            )}
            {countCF > 0 && (
              <button
                type="button"
                onClick={() => { setFilterGrade('CF'); setIsExpanded(true) }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  filterGrade === 'CF'
                    ? 'bg-orange-600 text-white shadow-sm'
                    : 'bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200/50'
                }`}
              >
                Grades C–F ({countCF})
              </button>
            )}
            {countSafe > 0 && (
              <button
                type="button"
                onClick={() => { setFilterGrade('SAFE'); setIsExpanded(true) }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  filterGrade === 'SAFE'
                    ? 'bg-brand-900 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                ✓ 0 Violations ({countSafe})
              </button>
            )}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[200px] sm:w-64">
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setIsExpanded(true) }}
              placeholder="Search ZIP (e.g. 77002)..."
              className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm rounded-lg border border-gray-200 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 font-medium"
            />
            <svg className="w-4 h-4 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── View 1: Card Grid View ── */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {displayedZips.map(z => (
            <Link
              key={z.zip}
              href={`/zip/${z.zip}`}
              className="card-hover block group p-4 bg-white rounded-xl border border-gray-100 hover:border-brand-300 transition-all shadow-sm hover:shadow-md"
            >
              <div className="flex items-center justify-between mb-2">
                <GradeBadge grade={z.grade} size="sm" />
                <span className="text-xs font-mono font-bold text-gray-700 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                  {z.zip}
                </span>
              </div>
              <p className="font-bold text-gray-900 text-sm group-hover:text-brand-700 transition-colors truncate">
                {z.city}, {z.state}
              </p>
              <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-gray-50 text-xs">
                <span className="text-gray-500 font-medium">
                  Score: <strong className="text-gray-900">{z.score ?? 'N/A'}</strong>/100
                </span>
                <span className={`font-semibold ${z.health_violations > 0 ? 'text-orange-600' : 'text-emerald-600'}`}>
                  {z.health_violations > 0 ? `${z.health_violations} violation${z.health_violations > 1 ? 's' : ''}` : '✓ Clean Record'}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* ── View 2: Compact Table View ── */}
      {viewMode === 'table' && (
        <div className="w-full overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full text-xs sm:text-sm text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider border-b border-gray-200">
                <th className="py-3 px-4 font-bold">ZIP Code</th>
                <th className="py-3 px-4 font-bold">Grade</th>
                <th className="py-3 px-4 font-bold">Safety Score</th>
                <th className="py-3 px-4 font-bold">Violations (5-Yr)</th>
                <th className="py-3 px-4 font-bold text-right">Report</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {displayedZips.map(z => (
                <tr key={z.zip} className="hover:bg-brand-50/40 transition-colors">
                  <td className="py-2.5 px-4 font-mono font-bold text-brand-700">
                    <Link href={`/zip/${z.zip}`} className="hover:underline">
                      {z.zip}
                    </Link>
                  </td>
                  <td className="py-2.5 px-4">
                    <GradeBadge grade={z.grade} size="sm" />
                  </td>
                  <td className="py-2.5 px-4 font-semibold text-gray-800">
                    {z.score !== null ? `${z.score}/100` : '—'}
                  </td>
                  <td className="py-2.5 px-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                      z.health_violations > 0
                        ? 'bg-orange-50 text-orange-700 border border-orange-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                      {z.health_violations > 0 ? `${z.health_violations} violations` : '0 violations'}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-right">
                    <Link
                      href={`/zip/${z.zip}`}
                      className="inline-flex items-center text-xs font-bold text-brand-600 hover:text-brand-800"
                    >
                      View Report →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Show All / Load More Button for Big Cities */}
      {shouldShowExpand && (
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            className="btn-primary py-3 px-8 text-sm font-bold shadow-md hover:shadow-lg inline-flex items-center gap-2"
          >
            <span>Show all {zips.length} ZIP codes in {cityName}</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      )}

      {/* If search has no results */}
      {filteredZips.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <p className="text-gray-600 font-semibold mb-1">No ZIP codes found matching "{search}"</p>
          <p className="text-xs text-gray-400 mb-4">Try searching with a 5-digit number or reset filter</p>
          <button
            type="button"
            onClick={() => { setSearch(''); setFilterGrade('ALL') }}
            className="text-xs text-brand-700 font-bold underline"
          >
            Reset all filters
          </button>
        </div>
      )}

      {/* ── Complete SSR Crawl Directory (Ensures 100% Googlebot Crawl Coverage) ── */}
      <div className="mt-8 pt-6 border-t border-gray-100">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
          All {cityName}, {stateCode} ZIP Code Reports ({zips.length} Total)
        </h3>
        <div className="flex flex-wrap gap-1.5 text-xs">
          {zips.map(z => (
            <Link
              key={`dir-${z.zip}`}
              href={`/zip/${z.zip}`}
              className="px-2.5 py-1 rounded bg-gray-50 hover:bg-brand-50 text-gray-700 hover:text-brand-700 font-mono text-xs border border-gray-200 hover:border-brand-200 transition-colors"
            >
              {z.zip}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
