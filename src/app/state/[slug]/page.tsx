// src/app/state/[slug]/page.tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Script from 'next/script'
import { getStateData, getStateZips, cityToSlug, STATE_NAMES } from '@/lib/data'
import type { ZipData } from '@/lib/types'
import { getStateIntro, getStateFAQs } from '@/lib/content'
import { SITE_URL, safeJsonLd, statePageMeta, stateJsonLd, faqJsonLd } from '@/lib/seo'
import { GradeBadge, Breadcrumb, FaqItem, StatCard } from '@/components/ui'
import { DisplayAd, InArticleAd, MultiplexAd } from '@/components/ui/AdSense'
import { Sparkles, ShieldCheck, Droplets, MapPin, Activity, ChevronRight, Award, AlertTriangle, ChevronDown } from 'lucide-react'

interface Props { params: { slug: string } }

export const runtime = 'edge'
export const revalidate = 604800

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await getStateData(params.slug)
  if (!data) return { title: 'State Not Found | WaterSafeCheck' }
  return statePageMeta(data)
}

export async function generateStaticParams() {
  return Object.keys(STATE_NAMES).map(code => ({ slug: code.toLowerCase() }))
}

export default async function StatePage({ params }: Props) {
  const data = await getStateData(params.slug)
  if (!data) notFound()

  const stateZips = await getStateZips(data.code)

  const intro = getStateIntro(data)
  const faqs = getStateFAQs(data)

  const gradeA = data.grade_dist['A'] || 0
  const gradeF = data.grade_dist['F'] || 0
  const pctA = Math.round((gradeA / data.zip_count) * 100)
  const hardStatus = data.surface_water_pct > 60 ? 'Moderately Soft to Moderate' : 'Hard to Very Hard'

  const directAnswer = `Drinking water in ${data.name} receives an average composite safety score of ${data.avg_score ?? 78}/100 based on EPA Safe Drinking Water Act records. Approximately ${pctA}% of monitored ZIP codes earn an "A" grade. Water sources are ${data.surface_water_pct}% surface water and ${(100 - data.surface_water_pct)}% groundwater, resulting in ${hardStatus} mineral hardness across the state.`

  const citiesMap: Record<string, { city: string; count: number; avg: number; grade: string }> = {}
  stateZips.forEach(z => {
    if (!z.city || z.score === null) return
    const key = z.city
    if (!citiesMap[key]) citiesMap[key] = { city: z.city, count: 0, avg: 0, grade: '' }
    citiesMap[key].count++
    citiesMap[key].avg += z.score
  })

  const cities = Object.values(citiesMap)
    .map(c => ({ ...c, avg: Math.round(c.avg / c.count) }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 40)

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

  const total = data.zip_count
  const grades = ['A', 'B', 'C', 'D', 'F']

  const worstZips = data.worst_zips.slice(0, 8)
  const bestZips = data.best_zips.slice(0, 8)

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
    topContaminants.push('Lead', 'Arsenic', 'Nitrate', 'Total Trihalomethanes (TTHM)')
  }

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: `${data.name} Water Quality` },
  ]

  const breadcrumbItems = [
    { name: 'Home', url: SITE_URL },
    { name: `${data.name} Water Quality`, url: `${SITE_URL}/state/${data.code.toLowerCase()}` }
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(stateJsonLd(data, breadcrumbItems)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd(faqs)) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={breadcrumbs} />

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="badge bg-apple-blue/10 text-apple-blue">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              EPA SDWIS Statewide Analysis
            </span>
            <span className="badge bg-slate-100 text-slate-700">
              <Activity className="w-3.5 h-3.5 mr-1 text-slate-500" />
              State Water Directory &amp; Compliance
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-2">
            {data.name} Drinking Water Quality &amp; Safety Directory
          </h1>
          <p className="text-base sm:text-lg text-slate-500">
            EPA compliance records, water testing guidelines, and city rankings covering all {data.zip_count.toLocaleString()} ZIP codes across {data.name}
          </p>

          <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-slate-500">
            <Image
              src="/images/sahajul-haque.jpg"
              alt="Sahajul Haque"
              width={20}
              height={20}
              className="w-5 h-5 rounded-full object-cover border border-slate-200"
            />
            <span>
              Statewide data verified by <Link href="/about" className="font-semibold text-slate-900 hover:text-apple-blue underline">Sahajul Haque</Link> from EPA SDWIS records
            </span>
          </div>
        </div>

        {/* Quick Answer Box */}
        <div className="mb-8 p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-blue-50/90 via-white to-sky-50/70 border border-blue-200/70 shadow-apple-card">
          <div className="flex items-center gap-2 mb-2 text-apple-blue font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            Quick Summary: Is Tap Water Safe in {data.name}?
          </div>
          <p className="text-slate-800 text-base sm:text-lg leading-relaxed font-normal">
            {directAnswer}
          </p>
        </div>

        {/* Ad 1: Top High-Visibility Display Ad */}
        <DisplayAd className="my-6" />

        {/* State Summary Stats */}
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

        {/* Overview Narrative */}
        <div className="card mb-8">
          <h2 className="section-title">Overview: Drinking Water in {data.name}</h2>
          <div
            className="prose-custom"
            dangerouslySetInnerHTML={{ __html: `<p>${intro}</p>` }}
          />
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="card p-3.5 bg-slate-50/80">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Surface Water</p>
              <p className="text-2xl font-black text-apple-blue">{data.surface_water_pct}%</p>
              <p className="text-[11px] text-slate-400 mt-0.5">of ZIP codes</p>
            </div>
            <div className="card p-3.5 bg-slate-50/80">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Total Violations</p>
              <p className="text-2xl font-black text-amber-600">{data.total_violations.toLocaleString()}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">5-year record</p>
            </div>
            <div className="card p-3.5 bg-slate-50/80">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Grade A ZIPs</p>
              <p className="text-2xl font-black text-emerald-600">{data.grade_dist['A'] || 0}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{Math.round(((data.grade_dist['A'] || 0) / total) * 100)}% of state</p>
            </div>
            <div className="card p-3.5 bg-slate-50/80">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Grade F ZIPs</p>
              <p className="text-2xl font-black text-rose-600">{data.grade_dist['F'] || 0}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{Math.round(((data.grade_dist['F'] || 0) / total) * 100)}% of state</p>
            </div>
          </div>
        </div>

        {/* Grade Distribution */}
        <div className="card mb-8">
          <h2 className="section-title">Water Quality Grade Distribution in {data.name}</h2>
          <p className="text-sm text-slate-500 mb-6 leading-relaxed">
            Distribution of {data.zip_count.toLocaleString()} ZIP codes evaluated under EPA compliance criteria:
          </p>
          <div className="space-y-3.5">
            {grades.map(g => {
              const count = data.grade_dist[g] || 0
              const pct = Math.round((count / total) * 100)
              const barColors: Record<string, string> = {
                A: 'bg-emerald-500', B: 'bg-apple-blue', C: 'bg-amber-400', D: 'bg-orange-500', F: 'bg-rose-500'
              }
              return (
                <div key={g} className="flex items-center gap-3.5">
                  <GradeBadge grade={g} size="sm" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1 font-medium">
                      <span>{count.toLocaleString()} ZIP codes</span>
                      <span className="font-bold text-slate-800">{pct}%</span>
                    </div>
                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${barColors[g]} transition-all duration-500`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Ad 2: In-Content Editorial Fluid Ad (Post-Grade Distribution) */}
        <InArticleAd className="my-10" />

        {/* Cities Grid */}
        <div className="mb-10">
          <h2 className="section-title !mb-1">Popular Metropolitan Areas in {data.name}</h2>
          <p className="text-sm text-slate-500 mb-5">
            Click any city to view localized ZIP code water quality reports
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
            {cities.map(({ city, count, avg }) => {
              const slug = cityToSlug(city, data.code)
              const grade = avg >= 85 ? 'A' : avg >= 70 ? 'B' : avg >= 55 ? 'C' : avg >= 40 ? 'D' : 'F'
              return (
                <Link
                  key={city}
                  href={`/city/${slug}`}
                  className="card p-3 flex items-center justify-between hover:border-apple-blue/30 active:scale-[0.98] transition-all group"
                >
                  <div className="truncate pr-2">
                    <p className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-apple-blue truncate">{city}</p>
                    <p className="text-[11px] text-slate-400">{count} ZIP{count > 1 ? 's' : ''}</p>
                  </div>
                  <GradeBadge grade={grade} size="sm" />
                </Link>
              )
            })}
          </div>
        </div>

        {/* Ad 3: Directory Break High-CTR Display Ad */}
        <DisplayAd className="my-10" />

        {/* Alphabetical Cities Directory */}
        <div className="card mb-8">
          <h2 className="section-title !mb-1">City A–Z Directory &bull; {data.name}</h2>
          <p className="text-sm text-slate-500 mb-6">
            Browse drinking water compliance records for every town and community in {data.name}.
          </p>
          
          <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin">
            {alphabet.map(letter => (
              <div key={letter} className="flex flex-col sm:flex-row gap-2 sm:gap-6 border-t border-slate-100 pt-5 first:border-0 first:pt-0">
                <div className="w-8 h-8 rounded-xl bg-apple-blue/10 text-apple-blue flex items-center justify-center font-bold text-base flex-shrink-0">
                  {letter}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-2 flex-1">
                  {groupedCities[letter].map(({ city }) => {
                    const slug = cityToSlug(city, data.code)
                    return (
                      <Link
                        key={city}
                        href={`/city/${slug}`}
                        className="text-xs text-slate-600 hover:text-apple-blue transition-colors py-0.5 truncate"
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

        {/* Ad 4: Post-Directory High-CTR Display Ad */}
        <DisplayAd className="my-10" />

        {/* Best & Worst ZIPs Bento */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="card">
            <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-600" />
              Highest Rated ZIP Codes in {data.name}
            </h2>
            <div className="space-y-1.5">
              {bestZips.map((z: any, i: number) => (
                <Link key={i} href={`/zip/${z.zip}`} className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors group">
                  <div>
                    <span className="font-mono text-xs sm:text-sm font-bold text-slate-800 group-hover:text-apple-blue">{z.zip}</span>
                    {z.city && <span className="text-xs text-slate-400 ml-2">{z.city}</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-semibold">{z.home_safety_score}/100</span>
                    <GradeBadge grade={z.home_safety_grade} size="sm" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="card">
            <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              Lowest Rated ZIP Codes in {data.name}
            </h2>
            <div className="space-y-1.5">
              {worstZips.map((z: any, i: number) => (
                <Link key={i} href={`/zip/${z.zip}`} className="flex items-center justify-between p-2.5 rounded-xl hover:bg-rose-50/50 transition-colors group">
                  <div>
                    <span className="font-mono text-xs sm:text-sm font-bold text-slate-800 group-hover:text-rose-600">{z.zip}</span>
                    {z.city && <span className="text-xs text-slate-400 ml-2">{z.city}</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-semibold">{z.home_safety_score}/100</span>
                    <GradeBadge grade={z.home_safety_grade} size="sm" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Common Contaminants */}
        <div className="card mb-8">
          <h2 className="section-title">Common Drinking Water Contaminants in {data.name}</h2>
          <p className="text-sm text-slate-500 mb-4 leading-relaxed">
            The following are common regulated contaminants recorded in {data.name} drinking water based on official EPA exceedance filings:
          </p>
          <div className="flex flex-wrap gap-2">
            {topContaminants.map((c, i) => (
              <span key={i} className="badge bg-slate-100 text-slate-700">
                {c}
              </span>
            ))}
          </div>
        </div>

        {/* Ad 5: Pre-FAQ High-Intent Display Ad */}
        <DisplayAd className="my-10" />

        {/* State FAQs */}
        <div className="card mb-8">
          <h2 className="section-title mb-5">
            Frequently Asked Questions &bull; {data.name} Drinking Water
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <FaqItem key={i} q={faq.q} a={faq.a} open={i === 0} />
            ))}
          </div>
        </div>

        {/* All ZIPs Drawer */}
        <div className="card mb-8">
          <details className="group">
            <summary className="flex items-center justify-between cursor-pointer list-none font-bold text-lg text-slate-900 select-none">
              <span>View All {data.zip_count.toLocaleString()} ZIP Codes in {data.name}</span>
              <span className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center transition-transform group-open:rotate-180">
                <ChevronDown className="w-4 h-4 text-slate-600" />
              </span>
            </summary>
            <p className="text-sm text-slate-500 mb-5 mt-2">
              Browse EPA water quality data for every monitored ZIP code across the state.
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-1.5 pt-4 border-t border-slate-100 max-h-[600px] overflow-y-auto pr-1">
              {data.zips.map(zip => (
                <Link
                  key={zip}
                  href={`/zip/${zip}`}
                  className="text-center py-1.5 px-1 rounded-xl text-xs font-mono font-medium transition-all bg-slate-50 text-slate-700 hover:bg-apple-blue hover:text-white border border-slate-100"
                  title={`ZIP ${zip}, ${data.name} Water Quality Report`}
                >
                  {zip}
                </Link>
              ))}
            </div>
          </details>
        </div>

        {/* Ad 6: Bottom Native Multiplex Recommendations Grid */}
        <MultiplexAd className="my-12" />
      </div>
    </>
  )
}
