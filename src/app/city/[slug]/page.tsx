// src/app/city/[slug]/page.tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Script from 'next/script'
import { getCityData, getAllCityData, getAllZipData, getZipData, STATE_NAMES, STATE_AGENCIES } from '@/lib/data'
import { cityPageMeta, breadcrumbJsonLd } from '@/lib/seo'
import { GradeBadge, Breadcrumb, ZipCard, FaqItem, StatCard } from '@/components/ui'
import { AdTop, AdInContent, AdBottom } from '@/components/ui/AdSense'

interface Props { params: { slug: string } }

export const revalidate = 604800

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = getCityData(params.slug)
  if (!data) return { title: 'City Not Found | WaterSafeCheck' }
  return cityPageMeta(data)
}

export async function generateStaticParams() {
  // Only pre-build top 200 cities - rest handled by ISR on-demand
  const all = getAllCityData()
  return Object.entries(all)
    .sort((a, b) => b[1].zip_count - a[1].zip_count)
    .slice(0, 200)
    .map(([slug]) => ({ slug }))
}

export default function CityPage({ params }: Props) {
  const data = getCityData(params.slug)
  if (!data) return notFound()

  const allZips = getAllZipData()
  const cityZips = data.zips.map(zip => allZips[zip]).filter(Boolean)
  const stateName = data.state_name || STATE_NAMES[data.state] || data.state

  // Sort ZIPs by score descending
  const sortedZips = cityZips.sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
  const avgScore = cityZips.length
    ? Math.round(cityZips.reduce((s, z) => s + (z.score ?? 0), 0) / cityZips.length)
    : null
  const totalViol = cityZips.reduce((s, z) => s + z.health_violations, 0)
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
    { label: `${data.city} Water Quality` },
  ]

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
        ? `Yes — tap water in ${data.city} meets all federal EPA standards and earns a ${grade} grade. It is generally safe for healthy adults. As always, running your tap for 30 seconds before use and using a filter adds extra protection for vulnerable populations.`
        : `Tap water in ${data.city} has a grade of ${grade}, indicating compliance concerns in recent years. Families with young children or pregnant women should consider using a certified NSF/ANSI 53 water filter for drinking and cooking.`
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
      q: `How do I get the water quality report for ${data.city}?`,
      a: `Each ZIP code in ${data.city} has a full water quality report on this site — click any ZIP code below. You can also get the annual Consumer Confidence Report (CCR) from your local water utility. The CCR is required to be published every year by July 1 and contains actual contaminant measurements and violation history.`
    },
    {
      q: `Where does ${data.city}'s tap water come from?`,
      a: data.water_source
        ? `Tap water in ${data.city}, ${data.state} primarily comes from <strong>${data.water_source.toLowerCase()}</strong>. ${data.water_source === 'Surface Water' ? 'Surface water systems treat water from rivers, lakes, or reservoirs using filtration, sedimentation, and disinfection before it reaches your tap.' : 'Groundwater systems pump water from underground aquifers, which is naturally filtered through soil and rock but can still contain naturally occurring contaminants.'}`
        : `Water source information for ${data.city} varies by service area. Check your specific ZIP code for details, or contact your local water utility directly.`
    },
  ]

  return (
    <>
      <Script id="breadcrumb-schema" type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(
          breadcrumbs.filter(b => b.href).map(b => ({ name: b.label, url: `https://www.watersafecheck.com${b.href}` }))
        )) }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={breadcrumbs} />

        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-1">
          {data.city}, {data.state} Tap Water Quality
        </h1>
        <p className="text-lg text-gray-500 mb-6">
          Water safety reports for all {data.zip_count} ZIP code{data.zip_count > 1 ? 's' : ''} in {data.city}, {stateName}
        </p>

        <AdTop />

        {/* ── City Summary ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <StatCard label="Average Score" value={`${avgScore ?? 'N/A'}/100`}
            color={avgScore && avgScore >= 75 ? 'green' : avgScore && avgScore >= 60 ? 'blue' : 'yellow'} />
          <StatCard label="Health Violations" value={totalViol}
            color={totalViol === 0 ? 'green' : totalViol <= 5 ? 'yellow' : 'red'} />
          <StatCard label="ZIP Codes" value={data.zip_count} color="blue" />
          <StatCard label="High Lead Risk" value={highLeadCount} subtext={`of ${cityZips.length} ZIP codes`}
            color={highLeadCount === 0 ? 'green' : highLeadCount < cityZips.length / 2 ? 'yellow' : 'red'} />
        </div>

        {/* ── Intro Card ── */}
        <div className="card mb-8">
          <div className="flex items-start gap-4">
            <GradeBadge grade={grade} size="lg" />
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

        {/* ── ZIP Codes Grid ── */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            Water Quality by ZIP Code — {data.city}, {data.state}
          </h2>
          <p className="text-sm text-gray-500 mb-5">
            Click any ZIP code for the full water quality report
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {sortedZips.map(z => (
              <ZipCard
                key={z.zip}
                zip={z.zip}
                city={z.city}
                state={z.state}
                score={z.score}
                grade={z.grade}
                violations={z.health_violations}
              />
            ))}
          </div>
        </div>

        {/* ── FAQ ── */}
        <div className="card mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-5">
            Frequently Asked Questions — {data.city} Water Quality
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
            Looking for water quality in other cities in {stateName}?
          </p>
          <Link href={`/state/${data.state.toLowerCase()}`} className="btn-primary inline-flex">
            View All Cities in {stateName} →
          </Link>
        </div>

        <AdBottom />
      </div>
    </>
  )
}
