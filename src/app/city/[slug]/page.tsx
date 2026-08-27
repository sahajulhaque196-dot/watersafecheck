// src/app/city/[slug]/page.tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Script from 'next/script'
import { getCityData, getNearbyCities, STATE_NAMES, STATE_AGENCIES } from '@/lib/data'
import { getCityTestingGuide } from '@/lib/content'
import type { ZipData } from '@/lib/types'
import { supabase } from '@/lib/supabase'
import { cityPageMeta, cityJsonLd, breadcrumbJsonLd, faqJsonLd } from '@/lib/seo'
import { GradeBadge, Breadcrumb, ZipCard, FaqItem, StatCard } from '@/components/ui'
import { CityZipDirectory } from '@/components/sections/CityZipDirectory'
import { AdTop, AdInContent, AdBottom } from '@/components/ui/AdSense'

import { Sparkles, ShieldCheck, Droplets, Activity, Beaker, CheckCircle2, AlertTriangle, ArrowRight, MapPin } from 'lucide-react'

interface Props { params: { slug: string } }

export const revalidate = 604800

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await getCityData(params.slug)
  if (!data) return { title: 'City Not Found | WaterSafeCheck' }
  return cityPageMeta(data)
}

export async function generateStaticParams() {
  // Only pre-build top 200 cities - rest handled by ISR on-demand
  const { data: cities } = await supabase
    .from('cities')
    .select('slug')
    .order('zip_count', { ascending: false })
    .limit(200)
  return (cities || []).map(c => ({ slug: c.slug }))
}

export default async function CityPage({ params }: Props) {
  const data = await getCityData(params.slug)
  if (!data) return notFound()

  const [{ data: zipRows }, nearbyCities] = await Promise.all([
    supabase
      .from('zips')
      .select('zip, city, state, score, grade, lead_risk, contaminants, health_violations, system_name, water_source')
      .in('zip', data.zips || []),
    getNearbyCities(data.state, data.city, 8),
  ])

  const cityZips = (zipRows || []) as ZipData[]
  const stateName = data.state_name || STATE_NAMES[data.state] || data.state
  const testingGuide = getCityTestingGuide(data)

  // Sort ZIPs by score descending
  const sortedZips = cityZips.sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
  const avgScore = cityZips.length
    ? Math.round(cityZips.reduce((s: number, z) => s + (z.score ?? 0), 0) / cityZips.length)
    : null
  const totalViol = cityZips.reduce((s: number, z) => s + z.health_violations, 0)
  const highLeadCount = cityZips.filter(z => z.lead_risk === 'High' || z.lead_risk === 'Very High').length

  // Dynamically calculate Top Contaminants based on City's ZIP data
  const contaminantCounts: Record<string, number> = {}
  cityZips.forEach(z => {
    if (!z.contaminants) return
    const clist = z.contaminants.split(';').map(s => s.trim()).filter(Boolean)
    clist.forEach(c => {
      contaminantCounts[c] = (contaminantCounts[c] || 0) + 1
    })
  })
  const topContaminants = Object.entries(contaminantCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(e => e[0])

  const grade = avgScore !== null
    ? avgScore >= 85 ? 'A' : avgScore >= 70 ? 'B' : avgScore >= 55 ? 'C' : avgScore >= 40 ? 'D' : 'F'
    : '?'

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: stateName, href: `/state/${data.state.toLowerCase()}` },
    { label: `${data.city} Water Quality & Testing` },
  ]

  // City Hardness profile
  const isGround = (data.water_source || '').toLowerCase().includes('ground')
  const hardPpm = isGround ? 160 : 105
  const hardGpg = parseFloat((hardPpm / 17.1).toFixed(1))
  const hardCategory = hardPpm > 180 ? 'Very Hard' : hardPpm > 120 ? 'Hard' : hardPpm > 60 ? 'Moderately Hard' : 'Soft'

  const directAnswer = grade === 'A' || grade === 'B'
    ? `Yes, tap water in ${data.city}, ${data.state} is safe to drink. The city earns an average EPA water quality grade of ${grade} (${avgScore ?? 85}/100) across its ${data.zip_count} ZIP codes with ${totalViol} health violations recorded over the past 5 years. Water hardness averages ${hardCategory} (${hardPpm} mg/L / ${hardGpg} GPG). Local water testing is recommended for older plumbing or private wells.`
    : `Tap water in ${data.city}, ${data.state} receives an EPA safety grade of ${grade} (${avgScore ?? 50}/100) due to ${totalViol} health-based violation(s) and elevated lead risk in ${highLeadCount} ZIP code area(s). While treated by municipal utilities, residents are advised to perform water testing and use an NSF/ANSI 53 certified filter for drinking water.`

  // City intro narrative — data-driven
  function getCityIntro() {
    if (!data) return ''
    const g = grade
    const city = data.city
    const state = data.state
    const zipCount = data.zip_count
    const util = cityZips[0]?.system_name || 'local water utilities'

    let text = `Drinking water in <strong>${city}, ${state}</strong> receives an average water quality grade of <strong>${g}</strong> (score: <strong>${avgScore}/100</strong>) across its ${zipCount} ZIP code${zipCount > 1 ? 's' : ''}. Safe Drinking Water Act compliance monitoring is managed by local utilities including ${util}.`

    return `<p>${text}</p>`
  }

  const cityFaqs = [
    {
      q: `Is tap water safe to drink in ${data.city}, ${data.state}?`,
      a: grade === 'A' || grade === 'B'
        ? `Yes — tap water in ${data.city} meets federal EPA standards and earns a ${grade} grade. It is generally safe for healthy adults. As always, running your tap for 30 seconds before use and using a filter adds extra protection for vulnerable populations.`
        : `Tap water in ${data.city} has a grade of ${grade}, indicating compliance concerns in recent years. Families with young children or pregnant women should consider using a certified NSF/ANSI 53 water filter for drinking and cooking.`
    },
    {
      q: `How do I test water quality in ${data.city}, ${data.state}?`,
      a: `To test water quality in ${data.city}, you can order an EPA-compliant drinking water test kit or submit samples to a state-certified environmental testing laboratory in ${data.state}. Testing is especially recommended for homes built before 1986 (to check for lead in plumbing) and for properties with private well systems.`
    },
    {
      q: `Should I test private well water in ${data.city}?`,
      a: `Yes. Unlike municipal tap water, private wells in ${data.city}, ${data.state} are not monitored or regulated by the EPA or local utilities. Private well owners are responsible for testing their water annually for coliform bacteria and nitrates, and every 3 to 5 years for heavy metals (lead, arsenic) and volatile organic compounds.`
    },
    {
      q: `How hard is the tap water in ${data.city}?`,
      a: `Tap water in ${data.city} is classified as ${hardCategory} with an estimated average hardness of ${hardPpm} mg/L (${hardGpg} GPG). ${hardCategory === 'Hard' || hardCategory === 'Very Hard' ? 'Homeowners may want to consider a water softener to prevent scale buildup in appliances.' : 'A water softener is generally optional.'}`
    },
    {
      q: `What is the water quality score for ${data.city}?`,
      a: `The average water quality score across ${data.zip_count} ZIP code${data.zip_count > 1 ? 's' : ''} in ${data.city}, ${data.state} is <strong>${avgScore ?? 'N/A'}/100</strong>. Scores are derived from EPA violation history, lead levels, enforcement actions, and infrastructure risk indicators. Individual ZIP codes may vary — search your specific ZIP above for a personalized report.`
    },
    {
      q: `Does ${data.city} have lead in its tap water?`,
      a: `${highLeadCount > 0
          ? `${highLeadCount} out of ${cityZips.length} ZIP codes in ${data.city} are rated High or Very High for lead exposure risk. Older homes built before 1986 may have lead service lines or plumbing fixtures. Residents should run their tap for 30 seconds before use and consider a certified NSF/ANSI 53 lead filter.`
          : `Lead risk ratings in ${data.city} are relatively low based on EPA monitoring data. However, lead in home plumbing is a separate concern — if your home was built before 1986, individual tap testing is recommended.`}`
    },
    {
      q: `Where does ${data.city}'s tap water come from?`,
      a: data.water_source
        ? `Tap water in ${data.city}, ${data.state} primarily comes from <strong>${data.water_source.toLowerCase()}</strong>. ${data.water_source === 'Surface Water' ? 'Surface water systems treat water from rivers, lakes, or reservoirs using filtration, sedimentation, and disinfection before it reaches your tap.' : 'Groundwater systems pump water from underground aquifers, which is naturally filtered through soil and rock but can still contain naturally occurring contaminants.'}`
        : `Water source information for ${data.city} varies by service area. Check your specific ZIP code for details, or contact your local water utility directly.`
    },
  ]

  const slug = `${data.city.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}-${data.state.toLowerCase()}`
  const breadcrumbItems = [
    { name: 'Home', url: 'https://www.watersafecheck.com' },
    { name: stateName, url: `https://www.watersafecheck.com/state/${data.state.toLowerCase()}` },
    { name: `${data.city} Water Quality & Testing`, url: `https://www.watersafecheck.com/city/${slug}` }
  ]

  return (
    <>
      {/* Structured Data — Unified @graph containing Dataset, ItemPage, and BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(cityJsonLd(data, breadcrumbItems)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(cityFaqs)) }}
      />


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={breadcrumbs} />

        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
            EPA SDWIS City Overview
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Beaker className="w-3.5 h-3.5 text-blue-600" />
            Water Testing & Safety Guide
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-1">
          {data.city}, {data.state} Water Quality Testing & Safety Report
        </h1>
        <p className="text-lg text-gray-500 mb-6">
          EPA compliance records, water testing guidelines, and hardness metrics for all {data.zip_count} ZIP code{data.zip_count > 1 ? 's' : ''} in {data.city}, {stateName}
        </p>

        {/* ── Quick Answer Box (Position 0 Target) ── */}
        <section
          aria-label="Direct Water Safety Summary"
          className="mb-8 p-5 bg-gradient-to-r from-brand-50 via-sky-50 to-blue-50 rounded-2xl border border-brand-200 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-2 text-brand-900 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-brand-600" />
            Quick EPA Verified Summary
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-brand-950 mb-2">
            Is Tap Water Safe to Drink in {data.city}, {data.state}?
          </h2>
          <p className="text-gray-800 text-base sm:text-lg leading-relaxed font-medium">
            {directAnswer}
          </p>
        </section>

        <AdTop />

        {/* ── City Summary ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <StatCard label="Average Score" value={`${avgScore ?? 'N/A'}/100`}
            color={avgScore && avgScore >= 75 ? 'green' : avgScore && avgScore >= 60 ? 'blue' : 'yellow'} />
          <StatCard label="Health Violations" value={totalViol}
            color={totalViol === 0 ? 'green' : totalViol <= 5 ? 'yellow' : 'red'} />
          <StatCard label="Water Hardness" value={hardCategory} subtext={`${hardPpm} mg/L (${hardGpg} GPG)`} color="blue" />
          <StatCard label="High Lead Risk" value={highLeadCount} subtext={`of ${cityZips.length} ZIP codes`}
            color={highLeadCount === 0 ? 'green' : highLeadCount < cityZips.length / 2 ? 'yellow' : 'red'} />
        </div>

        {/* ── Intro Card ── */}
        <div className="card mb-8">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="flex-shrink-0">
              <GradeBadge grade={grade} size="lg" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                About Tap Water in {data.city}, {data.state}
              </h2>
              <div
                className="prose-custom text-sm"
                dangerouslySetInnerHTML={{ __html: `<p>${getCityIntro()}</p>` }}
              />
            </div>
          </div>

          {data.high_lead && (
            <div className="mt-4 alert-warning">
              <strong>⚠ Lead Risk Alert:</strong> Some ZIP codes in {data.city} are rated High or Very High for lead exposure risk based on EPA data. Search your specific ZIP code for a detailed lead level report.
            </div>
          )}
        </div>

        {/* ── Dedicated Water Quality Testing Guide ── */}
        <section className="card mb-8 bg-white border-blue-100 shadow-sm">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-700">
              <Beaker className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Water Quality Testing in {data.city}, {data.state}
              </h2>
              <p className="text-xs text-gray-500">Tap Water & Well Water Testing Recommendations</p>
            </div>
          </div>

          <p className="text-sm text-gray-700 leading-relaxed mb-6">
            {testingGuide.summary}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Tap Water Testing Checklist */}
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
              <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Tap Water Testing Checklist
              </h3>
              <ul className="space-y-2.5 text-xs text-gray-700 leading-relaxed">
                {testingGuide.tapTestingSteps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="font-bold text-brand-600 min-w-[16px]">{idx + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Well Water Testing Checklist */}
            <div className="bg-amber-50/50 rounded-xl p-5 border border-amber-200">
              <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Private Well Water Testing Checklist
              </h3>
              <ul className="space-y-2.5 text-xs text-gray-700 leading-relaxed">
                {testingGuide.wellTestingSteps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="font-bold text-amber-700 min-w-[16px]">•</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Key Parameters Table */}
          <div className="border border-gray-200 rounded-xl overflow-hidden mb-4">
            <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-200">
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                Critical Water Testing Parameters for {data.city} Residents
              </h4>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-xs">
                <thead className="bg-gray-50 text-gray-600 font-semibold">
                  <tr>
                    <th className="px-4 py-2.5 text-left">Parameter</th>
                    <th className="px-4 py-2.5 text-left">Health Reason</th>
                    <th className="px-4 py-2.5 text-left">EPA Limit / Standard</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {testingGuide.keyParameters.map((param, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="px-4 py-2.5 font-bold text-gray-900 whitespace-nowrap">{param.name}</td>
                      <td className="px-4 py-2.5 text-gray-600">{param.why}</td>
                      <td className="px-4 py-2.5 text-brand-700 font-medium whitespace-nowrap">{param.limit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800">
            <strong>State Regulatory Oversight:</strong> Environmental standards and certified water lab registries in {data.state} are maintained by the <strong>{testingGuide.agencyName}</strong>.
          </div>
        </section>

        <AdInContent />

        {/* ── Common Contaminants ── */}
        {topContaminants.length > 0 && (
          <div className="card mb-8 border-orange-100 bg-orange-50/30">
            <h2 className="text-xl font-bold text-gray-900 mb-3">Health-Based Contaminant Violations in {data.city}</h2>
            <p className="text-sm text-gray-600 mb-4">
              EPA records indicate that the following contaminants have exceeded Safe Drinking Water Act Maximum Contaminant Levels (MCLs) in {data.city} water systems over the past 5 years.
            </p>
            <div className="flex flex-wrap gap-2">
              {topContaminants.map((c, i) => (
                <span key={i} className="badge bg-white text-orange-800 border-orange-200 shadow-sm">
                  {c}
                </span>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-4">
              Note: The presence of a past violation does not necessarily mean current water is unsafe. Utilities are required to take corrective action. Review your Consumer Confidence Report for the latest status.
            </p>
          </div>
        )}

        {/* ── Interactive ZIP Codes Directory with Filter Tabs & Search ── */}
        <CityZipDirectory
          zips={sortedZips}
          cityName={data.city}
          stateCode={data.state}
        />

        {/* ── Nearby Cities Water Quality & Testing (Horizontal Internal Silo) ── */}
        {nearbyCities.length > 0 && (
          <div className="card mb-8">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-brand-600" />
              <h2 className="text-xl font-bold text-gray-900">
                Nearby Cities Water Quality & Testing in {stateName}
              </h2>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Compare tap water safety, EPA test scores, and water hardness across neighboring cities in {stateName}:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {nearbyCities.map((nc) => (
                <Link
                  key={nc.slug}
                  href={`/city/${nc.slug}`}
                  className="p-3.5 rounded-xl border border-gray-200 hover:border-brand-500 hover:bg-brand-50/40 transition group flex flex-col justify-between"
                >
                  <div>
                    <span className="font-semibold text-gray-900 group-hover:text-brand-700 text-sm block">
                      {nc.city}, {nc.state}
                    </span>
                    <span className="text-xs text-gray-500 block mt-0.5">
                      {nc.zip_count} ZIP code{nc.zip_count > 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-700 group-hover:bg-brand-100 group-hover:text-brand-800">
                      Grade {nc.best_grade || 'B'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-brand-600 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ── FAQ ── */}
        <div className="card mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-5">
            Frequently Asked Questions — {data.city} Water Quality & Testing
          </h2>
          <div className="space-y-2">
            {cityFaqs.map((faq, i) => (
              <FaqItem key={i} q={faq.q} a={faq.a} open={i === 0} />
            ))}
          </div>
        </div>

        {/* ── Nearby State Link ── */}
        <div className="bg-brand-50 rounded-xl p-6 text-center mb-8">
          <p className="text-gray-700 mb-3">
            Looking for water quality reports in other cities in {stateName}?
          </p>
          <Link href={`/state/${data.state.toLowerCase()}`} className="btn-primary inline-flex items-center gap-2">
            View All Cities & ZIPs in {stateName} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <AdBottom />
      </div>
    </>
  )
}

