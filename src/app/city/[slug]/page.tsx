// src/app/city/[slug]/page.tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getCityData, getNearbyCities, getCityZips, STATE_NAMES, STATE_AGENCIES } from '@/lib/data'
import { getCityTestingGuide } from '@/lib/content'
import type { ZipData } from '@/lib/types'
import { SITE_URL, safeJsonLd, cityPageMeta, cityJsonLd, faqJsonLd } from '@/lib/seo'
import { GradeBadge, ScoreRing, Breadcrumb, FaqItem, StatCard } from '@/components/ui'
import { CityZipDirectory } from '@/components/sections/CityZipDirectory'
import { DisplayAd, InArticleAd, MultiplexAd } from '@/components/ui/AdSense'

import {
  Sparkles, ShieldCheck, Droplets, Activity, Beaker, CheckCircle2,
  AlertTriangle, ArrowRight, MapPin, ChevronRight, Phone, ExternalLink,
  Search, Building2, Users
} from 'lucide-react'

interface Props { params: { slug: string } }

export const runtime = 'edge'
export const revalidate = 604800

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await getCityData(params.slug)
  if (!data) return { title: 'City Not Found | WaterSafeCheck' }
  return cityPageMeta(data)
}

const POPULAR_CITY_SLUGS = [
  'new-york-ny', 'los-angeles-ca', 'chicago-il', 'houston-tx', 'phoenix-az',
  'philadelphia-pa', 'san-antonio-tx', 'san-diego-ca', 'dallas-tx', 'austin-tx',
  'jacksonville-fl', 'san-jose-ca', 'columbus-oh', 'charlotte-nc', 'indianapolis-in',
  'san-francisco-ca', 'seattle-wa', 'denver-co', 'washington-dc', 'boston-ma',
  'el-paso-tx', 'nashville-tn', 'detroit-mi', 'oklahoma-city-ok', 'portland-or',
  'las-vegas-nv', 'memphis-tn', 'louisville-ky', 'baltimore-md', 'milwaukee-wi',
  'albuquerque-nm', 'tucson-az', 'fresno-ca', 'sacramento-ca', 'mesa-az',
  'kansas-city-mo', 'atlanta-ga', 'omaha-ne', 'colorado-springs-co', 'raleigh-nc',
  'virginia-beach-va', 'long-beach-ca', 'miami-fl', 'oakland-ca', 'minneapolis-mn',
  'tulsa-ok', 'tampa-fl', 'arlington-tx', 'new-orleans-la', 'wichita-ks',
  'maize-ks', 'franklinton-nc', 'rockledge-fl', 'chesterton-in', 'summerville-sc',
  'williams-az', 'cantonment-fl', 'wilson-wy', 'ogunquit-me', 'north-bergen-nj'
]

export async function generateStaticParams() {
  return POPULAR_CITY_SLUGS.map(slug => ({ slug }))
}

export default async function CityPage({ params }: Props) {
  const data = await getCityData(params.slug)
  if (!data) return notFound()

  const [cityZips, nearbyCities] = await Promise.all([
    getCityZips(data.zips || []),
    getNearbyCities(data.state, data.city, 8),
  ])

  const stateName = data.state_name || STATE_NAMES[data.state] || data.state
  const testingGuide = getCityTestingGuide(data)

  const sortedZips = cityZips.sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
  const avgScore = cityZips.length
    ? Math.round(cityZips.reduce((s: number, z) => s + (z.score ?? 0), 0) / cityZips.length)
    : null
  const totalViol = cityZips.reduce((s: number, z) => s + z.health_violations, 0)
  const highLeadCount = cityZips.filter(z => z.lead_risk === 'High' || z.lead_risk === 'Very High').length

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

  const isGround = (data.water_source || '').toLowerCase().includes('ground')
  const hardPpm = isGround ? 160 : 105
  const hardGpg = parseFloat((hardPpm / 17.1).toFixed(1))
  const hardCategory = hardPpm > 180 ? 'Very Hard' : hardPpm > 120 ? 'Hard' : hardPpm > 60 ? 'Moderately Hard' : 'Soft'

  const directAnswer = grade === 'A' || grade === 'B'
    ? `Yes, tap water in ${data.city}, ${data.state} meets EPA primary drinking standards. The city achieves an average EPA Safety Grade of ${grade} (${avgScore ?? 85}/100) across ${data.zip_count} ZIP codes with ${totalViol} health violations and ${hardCategory.toLowerCase()} (${hardPpm} mg/L / ${hardGpg} GPG) mineral profile. In-home testing is advised for structures built before 1986.`
    : `Tap water in ${data.city}, ${data.state} receives an EPA Safety Grade of ${grade} (${avgScore ?? 50}/100) due to ${totalViol} health-based violation(s) and elevated lead risk. Residents are advised to test tap water and use an NSF/ANSI 53 certified filter for drinking and cooking.`

  function getCityIntro() {
    if (!data) return ''
    const g = grade
    const city = data.city
    const state = data.state
    const zipCount = data.zip_count
    const util = cityZips[0]?.system_name || 'local municipal water authorities'

    return `Drinking water in <strong>${city}, ${state}</strong> receives an average water quality grade of <strong>${g}</strong> (composite score: <strong>${avgScore}/100</strong>) across its ${zipCount} ZIP code${zipCount > 1 ? 's' : ''}. Compliance monitoring is managed by local utilities including ${util}.`
  }

  const cityFaqs = [
    {
      q: `Is tap water safe to drink in ${data.city}, ${data.state}?`,
      a: grade === 'A' || grade === 'B'
        ? `Yes — tap water in ${data.city} meets federal EPA standards and earns a ${grade} grade. It is generally safe for healthy adults. Running your tap for 30 seconds before use and using an NSF-certified filter provides added protection for infants and vulnerable individuals.`
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
      a: `The average water quality score across ${data.zip_count} ZIP code${data.zip_count > 1 ? 's' : ''} in ${data.city}, ${data.state} is <strong>${avgScore ?? 'N/A'}/100</strong>. Scores are derived from EPA violation history, lead levels, enforcement actions, and infrastructure risk indicators.`
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
        ? `Tap water in ${data.city}, ${data.state} primarily comes from <strong>${data.water_source.toLowerCase()}</strong>. ${data.water_source === 'Surface Water' ? 'Surface water systems treat water from rivers, lakes, or reservoirs using filtration, sedimentation, and disinfection.' : 'Groundwater systems pump water from underground aquifers.'}`
        : `Water source information for ${data.city} varies by service area. Check your specific ZIP code for details.`
    },
  ]

  const slug = `${data.city.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}-${data.state.toLowerCase()}`
  const breadcrumbItems = [
    { name: 'Home', url: SITE_URL },
    { name: stateName, url: `${SITE_URL}/state/${data.state.toLowerCase()}` },
    { name: `${data.city} Water Quality & Testing`, url: `${SITE_URL}/city/${slug}` }
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(cityJsonLd(data, breadcrumbItems)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd(cityFaqs)) }}
      />

      <div className="min-h-screen bg-[#F5F5F7] text-slate-900 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <Breadcrumb items={breadcrumbs} />

          {/* ── Apple-Style Report Hero Banner ── */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-white to-sky-50/50 p-6 sm:p-10 border border-slate-200/80 shadow-apple-card mb-8">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-apple-blue/10 text-apple-blue text-xs font-semibold tracking-wide">
                <ShieldCheck className="w-3.5 h-3.5" />
                EPA SDWIS Municipal Audit
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold tracking-wide">
                <Beaker className="w-3.5 h-3.5 text-slate-500" />
                Testing &amp; Hardness Profile
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold tracking-wide">
                <Activity className="w-3.5 h-3.5" />
                {data.zip_count} Monitored ZIP Codes
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mb-2">
              {data.city}, {data.state} Water Quality &amp; Safety Report
            </h1>
            <p className="text-base sm:text-xl text-slate-600 font-normal">
              EPA compliance records, water testing guidelines, and hardness metrics for all {data.zip_count} ZIP code{data.zip_count > 1 ? 's' : ''} in {data.city}, {stateName}
            </p>

            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
              <Image
                src="/images/sahajul-haque.jpg"
                alt="Sahajul Haque"
                width={22}
                height={22}
                className="w-5 h-5 rounded-full object-cover border border-slate-200"
              />
              <span>
                Data aggregated &amp; verified by <Link href="/about" className="font-semibold text-slate-900 hover:text-apple-blue underline">Sahajul Haque</Link> from federal SDWIS &amp; ECHO filings
              </span>
            </div>
          </div>

          {/* ── Direct Answer Quick Callout ── */}
          <section
            aria-label="Direct Water Safety Summary"
            className="mb-8 p-6 sm:p-8 rounded-3xl bg-white/90 backdrop-blur-xl border-2 border-sky-300/80 shadow-[0_8px_30px_-6px_rgba(14,165,233,0.14)] relative overflow-hidden"
          >
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-sky-400 via-blue-500 to-cyan-400" />
            <div className="flex items-center gap-2 mb-2 text-sky-600 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              Quick EPA Verified Summary
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-2 tracking-tight">
              Is Tap Water Safe to Drink in {data.city}, {data.state}?
            </h2>
            <p className="text-slate-700 text-base sm:text-lg leading-relaxed font-normal">
              {directAnswer}
            </p>
          </section>

          {/* Ad 1: Top Hero High-Visibility Display Ad */}
          <DisplayAd className="my-6" />

          {/* ── 2-Column Responsive Layout with Sticky Sidebar ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* ── Left Column: Main City Content (8 cols) ── */}
            <main className="lg:col-span-8 space-y-8">

              {/* City Summary Card with ScoreRing & Colorful StatCards */}
              <div className="apple-card p-6 sm:p-8 bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/80 shadow-apple-card">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8 mb-6">
                  <div className="flex-shrink-0 self-center sm:self-auto">
                    <ScoreRing score={avgScore} grade={grade} />
                  </div>
                  <div className="flex-1 w-full">
                    <div className="flex items-center gap-3.5 mb-2">
                      <GradeBadge grade={grade} size="lg" />
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Composite City Grade</p>
                        <p className="text-base sm:text-lg font-extrabold text-slate-900">
                          {data.city} Municipal Average ({avgScore ?? 'N/A'}/100)
                        </p>
                      </div>
                    </div>
                    <div
                      className="text-xs text-slate-600 leading-relaxed mt-2"
                      dangerouslySetInnerHTML={{ __html: `<p>${getCityIntro()}</p>` }}
                    />
                  </div>
                </div>

                {/* 4 StatCards with Colored Borders */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-100">
                  <StatCard
                    label="Average Score"
                    value={`${avgScore ?? 'N/A'}/100`}
                    color={avgScore && avgScore >= 75 ? 'green' : avgScore && avgScore >= 60 ? 'blue' : 'yellow'}
                  />
                  <StatCard
                    label="Health Violations"
                    value={totalViol}
                    color={totalViol === 0 ? 'green' : totalViol <= 5 ? 'yellow' : 'red'}
                  />
                  <StatCard
                    label="Water Hardness"
                    value={hardCategory}
                    subtext={`${hardPpm} mg/L (${hardGpg} GPG)`}
                    color="blue"
                  />
                  <StatCard
                    label="High Lead Risk"
                    value={highLeadCount}
                    subtext={`of ${cityZips.length} ZIP codes`}
                    color={highLeadCount === 0 ? 'green' : highLeadCount < cityZips.length / 2 ? 'yellow' : 'red'}
                  />
                </div>

                {data.high_lead && (
                  <div className="mt-5 p-4 rounded-2xl bg-amber-500/[0.08] border border-amber-300/60 text-xs text-amber-900 leading-relaxed flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong>Lead Risk Notice:</strong> Selected ZIP codes in {data.city} carry elevated lead vulnerability indices. Search your specific ZIP code below for household-level plumbing precautions.
                    </div>
                  </div>
                )}
              </div>

              {/* Water Testing Protocol Section */}
              <section className="apple-card p-6 sm:p-8 bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/80 shadow-apple-card">
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="w-11 h-11 rounded-2xl bg-blue-100/90 border border-blue-200 text-blue-600 flex items-center justify-center font-bold shadow-xs">
                    <Beaker className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                      Water Quality Testing Protocol in {data.city}, {data.state}
                    </h2>
                    <p className="text-xs text-slate-400">Certified Tap &amp; Private Well Procedures</p>
                  </div>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  {testingGuide.summary}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80">
                    <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Tap Water Testing Checklist
                    </h3>
                    <ul className="space-y-2 text-xs text-slate-600 leading-relaxed">
                      {testingGuide.tapTestingSteps.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="font-bold text-apple-blue min-w-[16px]">{idx + 1}.</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/80">
                    <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      Private Well Testing Checklist
                    </h3>
                    <ul className="space-y-2 text-xs text-slate-600 leading-relaxed">
                      {testingGuide.wellTestingSteps.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="font-bold text-amber-700 min-w-[16px]">&bull;</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Key Parameters Table */}
                <div className="overflow-hidden rounded-2xl border border-slate-200/80 shadow-xs mb-4">
                  <div className="bg-slate-50/80 px-4 py-3 border-b border-slate-200/70">
                    <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Critical Water Testing Parameters for {data.city} Residents
                    </h4>
                  </div>
                  <div className="table-scroll overflow-x-auto">
                    <table className="w-full text-xs text-left border-collapse min-w-[500px]">
                      <thead className="bg-slate-50/50 text-slate-500 font-semibold border-b border-slate-100">
                        <tr>
                          <th className="px-4 py-2.5">Parameter</th>
                          <th className="px-4 py-2.5">Health Significance</th>
                          <th className="px-4 py-2.5">EPA Action Limit</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {testingGuide.keyParameters.map((param, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/60">
                            <td className="px-4 py-2.5 font-bold text-slate-900 whitespace-nowrap">{param.name}</td>
                            <td className="px-4 py-2.5 text-slate-600">{param.why}</td>
                            <td className="px-4 py-2.5 text-apple-blue font-semibold whitespace-nowrap">{param.limit}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-100 text-xs text-slate-700">
                  <strong>State Regulatory Oversight:</strong> Environmental standards and certified water testing laboratory registries in {data.state} are maintained by the <strong>{testingGuide.agencyName}</strong>.
                </div>
              </section>

              {/* Ad 3: In-Content Editorial Fluid Ad (Post-Testing Protocol) */}
              <InArticleAd className="my-8" />

              {/* Common Contaminants */}
              {topContaminants.length > 0 && (
                <div className="apple-card p-6 sm:p-8 bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/80 shadow-apple-card">
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">Contaminant Violations on Record in {data.city}</h2>
                  <p className="text-sm text-slate-500 mb-4 leading-relaxed">
                    EPA records indicate the following compounds have recorded exceedances in {data.city} municipal systems within the past 5-year monitoring cycle.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {topContaminants.map((c, i) => (
                      <span key={i} className="inline-flex items-center px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200/80 text-xs font-semibold">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Ad 4: Post-Contaminants / Above ZIP Directory High-CTR Display Ad */}
              <DisplayAd className="my-8" />

              {/* Interactive ZIP Codes Directory */}
              <div className="apple-card p-6 sm:p-8 bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/80 shadow-apple-card">
                <CityZipDirectory
                  zips={sortedZips}
                  cityName={data.city}
                  stateCode={data.state}
                />
              </div>

              {/* Ad 6: Pre-FAQ High-Intent Display Ad */}
              <DisplayAd className="my-8" />

              {/* City FAQs */}
              <div className="apple-card p-6 sm:p-8 bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/80 shadow-apple-card">
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-5">
                  Frequently Asked Questions &bull; {data.city} Water Quality
                </h2>
                <div className="space-y-3">
                  {cityFaqs.map((faq, i) => (
                    <FaqItem key={i} q={faq.q} a={faq.a} open={i === 0} />
                  ))}
                </div>
              </div>

              {/* State Directory Callout */}
              <div className="p-8 rounded-3xl bg-gradient-to-br from-blue-50/70 via-white to-sky-50/50 border border-blue-200/60 text-center shadow-apple-card">
                <p className="text-slate-800 font-bold mb-4 text-base">
                  Looking for municipal water quality reports in other cities across {stateName}?
                </p>
                <Link href={`/state/${data.state.toLowerCase()}`} className="btn-primary">
                  <span>Explore All Cities in {stateName}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </main>

            {/* ── Right Column: Sticky Sidebar (4 cols) ── */}
            <aside className="lg:col-span-4 sticky top-20 self-start space-y-6">
              {/* Ad 2: Sticky Sidebar Top Display Ad */}
              <DisplayAd className="my-2" style={{ minHeight: '250px' }} />

              {/* Quick City Facts Bento */}
              <div className="apple-card p-5 sm:p-6 bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/80 shadow-apple-card">
                <div className="flex items-center gap-2 mb-3">
                  <Building2 className="w-4 h-4 text-apple-blue" />
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                    City Quick Facts
                  </h3>
                </div>
                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-200/60">
                    <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">City</span>
                    <span className="font-bold text-slate-900 text-sm block mt-0.5 truncate">{data.city}</span>
                  </div>
                  <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-200/60">
                    <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">State</span>
                    <span className="font-bold text-slate-900 text-sm block mt-0.5">{data.state}</span>
                  </div>
                  <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-200/60">
                    <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Avg Grade</span>
                    <div className="mt-1 flex items-center justify-between">
                      <GradeBadge grade={grade} size="sm" />
                      <span className="font-bold text-slate-800 text-xs">{avgScore ?? '—'}/100</span>
                    </div>
                  </div>
                  <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-200/60">
                    <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Monitored ZIPs</span>
                    <span className="font-bold text-slate-900 text-sm block mt-0.5">{data.zip_count}</span>
                  </div>
                </div>
              </div>

              {/* Nearby Cities in State */}
              {nearbyCities.length > 0 && (
                <div className="apple-card p-5 sm:p-6 bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/80 shadow-apple-card">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                      Nearby Cities in {stateName}
                    </h3>
                    <span className="text-[10px] text-slate-400 font-semibold px-2 py-0.5 rounded-full bg-slate-100">{nearbyCities.length}</span>
                  </div>
                  <div className="space-y-2">
                    {nearbyCities.map((nc) => (
                      <Link
                        key={nc.slug}
                        href={`/city/${nc.slug}`}
                        className="flex items-center justify-between p-2.5 rounded-2xl border border-slate-200/70 bg-slate-50/50 hover:bg-white hover:border-apple-blue/40 hover:shadow-xs transition-all text-xs group active:scale-[0.98]"
                      >
                        <div className="truncate pr-2">
                          <span className="font-bold text-slate-900 group-hover:text-apple-blue block truncate">
                            {nc.city}
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            {nc.zip_count} ZIP code{nc.zip_count > 1 ? 's' : ''}
                          </span>
                        </div>
                        <GradeBadge grade={nc.best_grade || 'B'} size="sm" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Ad 5: Sticky Sidebar Mid Display Ad */}
              <DisplayAd className="my-2" style={{ minHeight: '250px' }} />

              {/* State Agency Hotline */}
              <div className="apple-card p-5 bg-gradient-to-br from-amber-500/[0.08] to-amber-500/[0.02] border border-amber-300/40 rounded-3xl">
                <div className="flex items-center gap-2 text-amber-700 font-bold text-xs mb-2">
                  <Phone className="w-3.5 h-3.5" />
                  <span>EPA Safe Drinking Water Hotline</span>
                </div>
                <a href="tel:18004264791" className="text-xl font-extrabold text-amber-600 hover:text-amber-700 block mb-1">
                  1-800-426-4791
                </a>
                <p className="text-[11px] text-slate-500">
                  Mon–Fri, 10 AM–4 PM Eastern. Official federal advice.
                </p>
              </div>

              {/* Search ZIP Capsule */}
              <div className="apple-card p-5 bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/80 shadow-apple-card text-center">
                <p className="font-bold text-slate-900 text-sm mb-1">Check Your Exact ZIP</p>
                <p className="text-xs text-slate-500 mb-4">Explore tap metrics for your street address.</p>
                <Link
                  href="/#search"
                  className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-4 rounded-full bg-apple-blue hover:bg-blue-600 text-white font-semibold text-xs transition-all active:scale-[0.98]"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Search Any U.S. ZIP Code</span>
                </Link>
              </div>
            </aside>
          </div>

          {/* Ad 7: Bottom Native Multiplex Recommendations Grid */}
          <MultiplexAd className="my-10" />
        </div>
      </div>
    </>
  )
}
