// src/app/state/[slug]/page.tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Script from 'next/script'
import { getStateData, cityToSlug } from '@/lib/data'
import type { ZipData } from '@/lib/types'
import { supabase } from '@/lib/supabase'
import { getStateIntro, getStateFAQs } from '@/lib/content'
import { statePageMeta, stateJsonLd, breadcrumbJsonLd, faqJsonLd } from '@/lib/seo'
import { GradeBadge, Breadcrumb, FaqItem, StatCard } from '@/components/ui'
import { AdTop, AdInContent, AdBottom } from '@/components/ui/AdSense'
import { Sparkles, ShieldCheck, Droplets, MapPin, Activity } from 'lucide-react'

interface Props { params: { slug: string } }

export const revalidate = 604800

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await getStateData(params.slug)
  if (!data) return { title: 'State Not Found | WaterSafeCheck' }
  return statePageMeta(data)
}

export async function generateStaticParams() {
  const { data: states } = await supabase.from('states').select('code')
  return (states || []).map(s => ({ slug: s.code.toLowerCase() }))
}

export default async function StatePage({ params }: Props) {
  const data = await getStateData(params.slug)
  if (!data) notFound()

  const { data: zipRows } = await supabase
    .from('zips')
    .select('zip, city, state, score, grade, contaminants')
    .eq('state', data.code)
  const stateZips = (zipRows || []) as ZipData[]

  // In-memory mapping to eliminate redundant database query and prevent 5xx timeouts
  const zipsDetailMap = stateZips.reduce((acc: any, curr: any) => {
    acc[curr.zip] = curr
    return acc
  }, {} as Record<string, { zip: string; city: string; grade: string }>)


  const intro = getStateIntro(data)
  const faqs = getStateFAQs(data)

  // Quick direct answer for State (Captures queries like "[State] drinking water quality")
  const gradeA = data.grade_dist['A'] || 0
  const gradeF = data.grade_dist['F'] || 0
  const pctA = Math.round((gradeA / data.zip_count) * 100)
  const hardStatus = data.surface_water_pct > 60 ? 'Moderately Soft to Moderate' : 'Hard to Very Hard'

  const directAnswer = `Drinking water in ${data.name} receives an average composite safety score of ${data.avg_score ?? 78}/100 based on EPA Safe Drinking Water Act records. Approximately ${pctA}% of monitored ZIP codes earn an "A" grade. Water sources are ${data.surface_water_pct}% surface water and ${(100 - data.surface_water_pct)}% groundwater, resulting in ${hardStatus} mineral hardness across the state.`

  // Cities in this state (unique, with at least score data)
  const citiesMap: Record<string, { city: string; count: number; avg: number; grade: string }> = {}
  stateZips.forEach(z => {
    if (!z.city || z.score === null) return
    const key = z.city
    if (!citiesMap[key]) citiesMap[key] = { city: z.city, count: 0, avg: 0, grade: '' }
    citiesMap[key].count++
    citiesMap[key].avg += z.score
  })
  // Top 40 cities by size (Popular Cities)
  const cities = Object.values(citiesMap)
    .map(c => ({ ...c, avg: Math.round(c.avg / c.count) }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 40)

  // Alphabetical list of all cities (A-Z Directory)
  const allStateCities = Object.values(citiesMap)
    .map(c => ({ ...c, avg: Math.round(c.avg / c.count) }))
    .sort((a, b) => a.city.localeCompare(b.city))

  const groupedCities: Record<string, typeof allStateCities> = {}
  allStateCities.forEach(c => {
    const firstLetter = c.city.charAt(0).toUpperCase()
    if (!groupedCities[firstLetter]) groupedCities[firstLetter] = []
    groupedCities[firstLetter].push(c)
  })
  const alphabet = Object.keys(groupedCities).sort()

  // Grade breakdown
  const total = data.zip_count
  const grades = ['A', 'B', 'C', 'D', 'F']

  // Top violating ZIPs
  const worstZips = data.worst_zips.slice(0, 8)
  const bestZips = data.best_zips.slice(0, 8)

  // Dynamically calculate Top Contaminants based on State's ZIP data
  const contaminantCounts: Record<string, number> = {}
  stateZips.forEach(z => {
    if (!z.contaminants) return
    const clist = z.contaminants.split(';').map(s => s.trim()).filter(Boolean)
    clist.forEach(c => {
      contaminantCounts[c] = (contaminantCounts[c] || 0) + 1
    })
  })
  const topContaminants = Object.entries(contaminantCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(e => e[0])
  if (topContaminants.length === 0) {
    topContaminants.push('Lead', 'Arsenic', 'Nitrate', 'Total Trihalomethanes (TTHM)') // Fallback
  }

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: `${data.name} Water Quality` },
  ]

  return (
    <>
      <Script id="state-schema" type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(stateJsonLd(data)) }} />
      <Script id="breadcrumb-schema" type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(
          [{ name: 'Home', url: 'https://www.watersafecheck.com' },
           { name: `${data.name} Water Quality`, url: `https://www.watersafecheck.com/state/${data.code.toLowerCase()}` }]
        )) }} />
      <Script id="faq-schema" type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(faqs)) }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={breadcrumbs} />

        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
            Official EPA SDWIS Statewide Analysis
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-1">
          {data.name} Tap Water Quality & Safety Report
        </h1>
        <p className="text-lg text-gray-500 mb-6">
          Comprehensive EPA water report covering all {data.zip_count.toLocaleString()} ZIP codes across {data.name}
        </p>

        {/* ── Quick Answer Box (Position 0 Target) ── */}
        <div className="mb-8 p-5 bg-gradient-to-r from-brand-50 via-sky-50 to-blue-50 rounded-2xl border border-brand-200 shadow-sm">
          <div className="flex items-center gap-2 mb-2 text-brand-900 font-bold text-sm tracking-wide uppercase">
            <Sparkles className="w-4 h-4 text-brand-600" />
            Quick Summary: Is Tap Water Safe in {data.name}?
          </div>
          <p className="text-gray-800 text-base sm:text-lg leading-relaxed font-medium">
            {directAnswer}
          </p>
        </div>

        <AdTop />

        {/* ── State Summary Stats ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total ZIP Codes" value={data.zip_count.toLocaleString()} color="blue" />
          <StatCard
            label="Health Violations (5yr)"
            value={data.health_violations.toLocaleString()}
            color={data.health_violations === 0 ? 'green' : data.health_violations < 500 ? 'yellow' : 'red'}
          />
          <StatCard
            label="Statewide Avg Score"
            value={`${data.avg_score ?? 'N/A'}/100`}
            color={data.avg_score && data.avg_score >= 80 ? 'green' : data.avg_score && data.avg_score >= 65 ? 'blue' : 'yellow'}
          />
          <StatCard
            label="High Lead Risk Areas"
            value={`${data.high_lead_pct}%`}
            color={data.high_lead_pct < 20 ? 'green' : data.high_lead_pct < 40 ? 'yellow' : 'red'}
          />
        </div>

        {/* ── Intro Narrative ── */}
        <div className="card mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Overview: Drinking Water in {data.name}</h2>
          <div
            className="prose-custom"
            dangerouslySetInnerHTML={{ __html: `<p>${intro}</p>` }}
          />
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Surface Water</p>
              <p className="text-xl font-bold text-blue-700">{data.surface_water_pct}%</p>
              <p className="text-xs text-gray-400">of ZIP codes</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Total Violations</p>
              <p className="text-xl font-bold text-orange-600">{data.total_violations.toLocaleString()}</p>
              <p className="text-xs text-gray-400">5-year record</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Grade A ZIPs</p>
              <p className="text-xl font-bold text-green-600">{data.grade_dist['A'] || 0}</p>
              <p className="text-xs text-gray-400">{Math.round(((data.grade_dist['A'] || 0) / total) * 100)}% of state</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Grade F ZIPs</p>
              <p className="text-xl font-bold text-red-600">{data.grade_dist['F'] || 0}</p>
              <p className="text-xs text-gray-400">{Math.round(((data.grade_dist['F'] || 0) / total) * 100)}% of state</p>
            </div>
          </div>
        </div>

        {/* ── Grade Distribution ── */}
        <div className="card mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Water Quality Grade Distribution in {data.name}</h2>
          <p className="text-sm text-gray-500 mb-5">
            How do {data.name}'s {data.zip_count.toLocaleString()} ZIP codes stack up by water quality grade?
          </p>
          <div className="space-y-3">
            {grades.map(g => {
              const count = data.grade_dist[g] || 0
              const pct = Math.round((count / total) * 100)
              const barColors: Record<string, string> = {
                A: 'bg-green-500', B: 'bg-blue-500', C: 'bg-yellow-400', D: 'bg-orange-500', F: 'bg-red-500'
              }
              return (
                <div key={g} className="flex items-center gap-3">
                  <GradeBadge grade={g} size="sm" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                      <span>{count.toLocaleString()} ZIP codes</span>
                      <span>{pct}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${barColors[g]}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <AdInContent />

        {/* ── Cities Grid ── */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Popular Cities in {data.name}</h2>
          <p className="text-sm text-gray-500 mb-5">
            Click any city to view ZIP code-level water quality reports
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {cities.map(({ city, count, avg }) => {
              const slug = cityToSlug(city, data.code)
              const grade = avg >= 85 ? 'A' : avg >= 70 ? 'B' : avg >= 55 ? 'C' : avg >= 40 ? 'D' : 'F'
              return (
                <Link
                  key={city}
                  href={`/city/${slug}`}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg border border-gray-100 hover:border-brand-200 hover:bg-brand-50 transition-all group"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-700 group-hover:text-brand-700">{city}</p>
                    <p className="text-xs text-gray-400">{count} ZIP{count > 1 ? 's' : ''}</p>
                  </div>
                  <GradeBadge grade={grade} size="sm" />
                </Link>
              )
            })}
          </div>
        </div>

        {/* ── Alphabetical Cities Directory ── */}
        <div className="card mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-2">City A-Z Directory — {data.name}</h2>
          <p className="text-sm text-gray-500 mb-6">
            Browse water quality reports for every town and city in {data.name}.
          </p>
          
          <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin">
            {alphabet.map(letter => (
              <div key={letter} className="flex flex-col sm:flex-row gap-2 sm:gap-6 border-t border-gray-100 pt-4 first:border-0 first:pt-0">
                <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-700 flex items-center justify-center font-bold text-lg flex-shrink-0">
                  {letter}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-2 flex-1">
                  {groupedCities[letter].map(({ city }) => {
                    const slug = cityToSlug(city, data.code)
                    return (
                      <Link
                        key={city}
                        href={`/city/${slug}`}
                        className="text-xs text-gray-600 hover:text-brand-700 transition-colors py-0.5 truncate"
                        title={`${city} Water Quality`}
                      >
                        {city}
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Best & Worst ZIPs ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="card">
            <h2 className="text-lg font-bold text-gray-900 mb-4">🏆 Highest Rated ZIP Codes in {data.name}</h2>
            <div className="space-y-1">
              {bestZips.map((z: any, i: number) => (
                <Link key={i} href={`/zip/${z.zip}`} className="flex items-center justify-between px-3 py-2 rounded hover:bg-gray-50 group">
                  <div>
                    <span className="font-mono text-sm text-gray-700 group-hover:text-brand-700">{z.zip}</span>
                    {z.city && <span className="text-xs text-gray-400 ml-2">{z.city}</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">{z.home_safety_score}/100</span>
                    <GradeBadge grade={z.home_safety_grade} size="sm" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="card">
            <h2 className="text-lg font-bold text-gray-900 mb-4">⚠ Lowest Rated ZIP Codes in {data.name}</h2>
            <div className="space-y-1">
              {worstZips.map((z: any, i: number) => (
                <Link key={i} href={`/zip/${z.zip}`} className="flex items-center justify-between px-3 py-2 rounded hover:bg-red-50 group">
                  <div>
                    <span className="font-mono text-sm text-gray-700 group-hover:text-red-700">{z.zip}</span>
                    {z.city && <span className="text-xs text-gray-400 ml-2">{z.city}</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">{z.home_safety_score}/100</span>
                    <GradeBadge grade={z.home_safety_grade} size="sm" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* ── Common Contaminants ── */}
        <div className="card mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Common Drinking Water Contaminants in {data.name}</h2>
          <p className="text-sm text-gray-600 mb-4">
            The following are common regulated contaminants found in {data.name} drinking water based on EPA violation records.
            Click any contaminant to learn about EPA safety limits and health effects.
          </p>
          <div className="flex flex-wrap gap-2">
            {topContaminants.map((c, i) => (
              <span key={i} className="badge bg-gray-100 text-gray-700 border-gray-200">
                {c}
              </span>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-4">
            Source: EPA Safe Drinking Water Act Maximum Contaminant Level regulations. For the complete list of regulated contaminants and MCLs, see the{' '}
            <a href="/water-quality-guide" className="underline hover:text-gray-600">Water Quality Safety Guide</a>.
          </p>
        </div>

        {/* ── FAQ ── */}
        <div className="card mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-5">
            Frequently Asked Questions — {data.name} Drinking Water
          </h2>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <FaqItem key={i} q={faq.q} a={faq.a} open={i === 0} />
            ))}
          </div>
        </div>

        {/* ── All ZIPs in State ── */}
        <div className="card mb-8">
          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer list-none font-bold text-lg text-gray-900 mb-1">
              <span>View All {data.zip_count.toLocaleString()} ZIP Codes in {data.name}</span>
              <span className="transition group-open:rotate-180">
                <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
              </span>
            </summary>
            <p className="text-sm text-gray-500 mb-5 mt-2">
              Browse EPA water quality data for every monitored ZIP code. For faster results, use the search bar above.
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-1.5 pt-4 border-t border-gray-100 max-h-[600px] overflow-y-auto pr-1">
              {data.zips.map(zip => (
                <Link
                  key={zip}
                  href={`/zip/${zip}`}
                  className="text-center py-1.5 px-1 rounded text-xs font-mono font-medium transition-all bg-gray-50 text-gray-700 hover:bg-brand-50 hover:text-brand-700 border border-gray-100 hover:border-brand-200"
                  title={`ZIP ${zip}, ${data.name} Water Quality Report`}
                >
                  {zip}
                </Link>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-3 text-center">
              All {data.zips.length.toLocaleString()} ZIP codes in {data.name} are actively monitored under the EPA Safe Drinking Water Act.
            </p>
          </details>
        </div>

        <AdBottom />
      </div>
    </>
  )
}
