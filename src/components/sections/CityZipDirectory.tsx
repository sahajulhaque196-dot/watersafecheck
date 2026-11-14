'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { GradeBadge } from '@/components/ui'
import { Search, LayoutGrid, List, ChevronDown, Check, ArrowRight } from 'lucide-react'

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
      const q = search.trim().toLowerCase()
      const matchesSearch = !q || z.zip.includes(q) || (z.system_name && z.system_name.toLowerCase().includes(q))
      if (!matchesSearch) return false

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
    <div className="mb-12">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="section-title !mb-1">
            Water Quality by ZIP Code &bull; {cityName}, {stateCode}
          </h2>
          <p className="text-sm text-slate-500">
            Monitoring {zips.length} ZIP code{zips.length > 1 ? 's' : ''} across municipal water systems
          </p>
        </div>

        {/* View Toggle (Grid / Table) — Apple Segmented Control */}
        <div className="segmented-control self-start md:self-auto">
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            data-active={viewMode === 'grid'}
            className="segmented-control-item flex items-center gap-1.5"
            aria-label="Grid View"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Cards</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('table')}
            data-active={viewMode === 'table'}
            className="segmented-control-item flex items-center gap-1.5"
            aria-label="Table View"
          >
            <List className="w-3.5 h-3.5" />
            <span>Table</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Instant Search Bar */}
      <div className="card mb-6 p-3 sm:p-4 bg-white/90 shadow-apple-sm">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Quick Filter Tabs — Apple Pill Switcher */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              type="button"
              onClick={() => { setFilterGrade('ALL'); setIsExpanded(true) }}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all active:scale-95 ${
                filterGrade === 'ALL'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All ({zips.length})
            </button>
            {countA > 0 && (
              <button
                type="button"
                onClick={() => { setFilterGrade('A'); setIsExpanded(true) }}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all active:scale-95 ${
                  filterGrade === 'A'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/60'
                }`}
              >
                Grade A ({countA})
              </button>
            )}
            {countB > 0 && (
              <button
                type="button"
                onClick={() => { setFilterGrade('B'); setIsExpanded(true) }}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all active:scale-95 ${
                  filterGrade === 'B'
                    ? 'bg-apple-blue text-white shadow-xs'
                    : 'bg-blue-50 text-apple-blue hover:bg-blue-100 border border-blue-200/60'
                }`}
              >
                Grade B ({countB})
              </button>
            )}
            {countCF > 0 && (
              <button
                type="button"
                onClick={() => { setFilterGrade('CF'); setIsExpanded(true) }}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all active:scale-95 ${
                  filterGrade === 'CF'
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200/60'
                }`}
              >
                Grades C–F ({countCF})
              </button>
            )}
            {countSafe > 0 && (
              <button
                type="button"
                onClick={() => { setFilterGrade('SAFE'); setIsExpanded(true) }}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all active:scale-95 ${
                  filterGrade === 'SAFE'
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                0 Violations ({countSafe})
              </button>
            )}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[200px] sm:w-64">
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setIsExpanded(true) }}
              placeholder="Search ZIP code..."
              className="w-full pl-8 pr-7 py-1.5 text-xs sm:text-sm rounded-full bg-slate-100/90 border border-slate-200/70 focus:outline-none focus:ring-2 focus:ring-apple-blue/20 focus:bg-white font-medium transition-all"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── View 1: Card Grid View (Apple Cards) ── */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {displayedZips.map(z => (
            <Link
              key={z.zip}
              href={`/zip/${z.zip}`}
              className="card p-4 hover:border-apple-blue/30 transition-all shadow-xs hover:shadow-apple-card active:scale-[0.98] block group"
            >
              <div className="flex items-center justify-between mb-2.5">
                <GradeBadge grade={z.grade} size="sm" />
                <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                  {z.zip}
                </span>
              </div>
              <p className="font-bold text-slate-900 text-sm group-hover:text-apple-blue transition-colors truncate">
                {z.city}, {z.state}
              </p>
              <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100 text-xs">
                <span className="text-slate-500 font-medium">
                  Score: <strong className="text-slate-900">{z.score ?? '—'}</strong>/100
                </span>
                <span className={`font-semibold ${z.health_violations > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {z.health_violations > 0 ? `${z.health_violations} viol.` : '✓ Safe'}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* ── View 2: Compact Table View (Apple Settings Rows) ── */}
      {viewMode === 'table' && (
        <div className="card p-0 overflow-hidden border border-slate-200/80 shadow-apple-sm">
          <div className="table-scroll">
            <table className="w-full text-xs sm:text-sm text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="bg-slate-50/80 text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200/70">
                  <th className="py-3 px-4">ZIP Code</th>
                  <th className="py-3 px-4">Grade</th>
                  <th className="py-3 px-4">Safety Score</th>
                  <th className="py-3 px-4">Violations (5-Yr)</th>
                  <th className="py-3 px-4 text-right">Report</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayedZips.map(z => (
                  <tr key={z.zip} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      <Link href={`/zip/${z.zip}`} className="hover:text-apple-blue hover:underline">
                        {z.zip}
                      </Link>
                    </td>
                    <td className="py-3 px-4">
                      <GradeBadge grade={z.grade} size="sm" />
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      {z.score !== null ? `${z.score}/100` : '—'}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        z.health_violations > 0
                          ? 'bg-rose-50 text-rose-700 border border-rose-200/60'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                      }`}>
                        {z.health_violations > 0 ? `${z.health_violations} violations` : '0 violations'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/zip/${z.zip}`}
                        className="inline-flex items-center text-xs font-semibold text-apple-blue hover:underline"
                      >
                        View Report &rarr;
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Show All / Load More Button for Big Cities */}
      {shouldShowExpand && (
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => setIsExpanded(true)}
            className="btn-secondary py-3 px-8 text-sm font-semibold shadow-xs hover:shadow-apple-card inline-flex items-center gap-2"
          >
            <span>Show all {zips.length} ZIP codes in {cityName}</span>
            <ChevronDown className="w-4 h-4 text-slate-500" />
          </button>
        </div>
      )}

      {/* If search has no results */}
      {filteredZips.length === 0 && (
        <div className="text-center py-12 card bg-slate-50/50 border border-dashed border-slate-200">
          <p className="text-slate-800 font-semibold mb-1">No ZIP codes found matching &ldquo;{search}&rdquo;</p>
          <p className="text-xs text-slate-400 mb-4">Try searching with another 5-digit number or reset filter</p>
          <button
            type="button"
            onClick={() => { setSearch(''); setFilterGrade('ALL') }}
            className="text-xs text-apple-blue font-bold hover:underline"
          >
            Reset all filters
          </button>
        </div>
      )}

      {/* SSR Crawl Directory */}
      <div className="mt-8 pt-6 border-t border-slate-100">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
          All {cityName}, {stateCode} ZIP Code Reports ({zips.length} Total)
        </h3>
        <div className="flex flex-wrap gap-1.5 text-xs">
          {zips.map(z => (
            <Link
              key={`dir-${z.zip}`}
              href={`/zip/${z.zip}`}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-white text-slate-700 hover:text-apple-blue font-mono text-xs border border-slate-200/60 hover:border-apple-blue/30 transition-colors"
            >
              {z.zip}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
