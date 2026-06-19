// src/app/zip/[slug]/page.tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Script from 'next/script'
import {
  getZipData, STATE_NAMES,
  gradeColor, riskBadgeClass, formatPopulation,
  getContaminantList, getWaterSourceDescription,
  getRadonZoneDescription, cityToSlug,
} from '@/lib/data'
import {
  getZipIntro, getLeadSection, getViolationNarrative,
  getContaminantNarrative, getEnforcementNarrative,
  getLeadRiskNarrative, getComplianceNarrative,
  getWaterQualityFAQs,
} from '@/lib/content'
import { zipPageMeta, zipJsonLd, breadcrumbJsonLd, faqJsonLd } from '@/lib/seo'
import {
  GradeBadge, ScoreRing, DataRow, AlertBox,
  Breadcrumb, StatCard, FaqItem,
} from '@/components/ui'
import { AdTop, AdInContent, AdBottom, AdSidebar } from '@/components/ui/AdSense'

interface Props { params: { slug: string } }

// ISR — revalidate pages every 7 days
export const revalidate = 604800

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = getZipData(params.slug)
  if (!data) return { title: 'ZIP Code Not Found | WaterSafeCheck' }
  return zipPageMeta(data)
}

// ISR: Pages are generated on-demand and cached — no pre-build needed
// This prevents 41K-page build timeout on Vercel free tier
// Pages are cached for 7 days (revalidate = 604800)
export async function generateStaticParams() {
  // Pre-build only the 50 most important ZIP codes for instant load
  const priority = [
    '10001','10002','10003', // New York
    '90001','90210','90291', // Los Angeles
    '60601','60602',         // Chicago
    '77001','77002',         // Houston
    '85001','85002',         // Phoenix
    '19101','19102',         // Philadelphia
    '78201','78202',         // San Antonio
    '92101','92102',         // San Diego
    '75201','75202',         // Dallas
    '78701','78702',         // Austin
    '02101','02102',         // Boston
    '30301','30302',         // Atlanta
    '98101','98102',         // Seattle
    '80201','80202',         // Denver
    '33101','33102',         // Miami
    '89101','89102',         // Las Vegas
    '97201','97202',         // Portland
    '85701','85702',         // Tucson
    '28201','28202',         // Charlotte
    '37201','37202',         // Nashville
    '32099','32099',         // Jacksonville
  ]
  return Array.from(new Set(priority)).map(zip => ({ slug: zip }))
}

export default function ZipPage({ params }: Props) {
  const data = getZipData(params.slug)
  if (!data) notFound()

  // Note: nearby ZIPs feature disabled to avoid loading 30MB JSON in each page render
  // Enable by passing all zip data or via API route
  const nearbyZips: typeof data[] = []
  const intro = getZipIntro(data)
  const leadSection = getLeadSection(data)
  const violationNarrative = getViolationNarrative(data)
  const contaminantNarrative = getContaminantNarrative(data)
  const enforcementNarrative = getEnforcementNarrative(data)
  const leadRiskNarrative = getLeadRiskNarrative(data)
  const complianceNarrative = getComplianceNarrative(data)
  const faqs = getWaterQualityFAQs(data)
  const contaminants = getContaminantList(data.contaminants)
  const stateName = STATE_NAMES[data.state] || data.state
  const citySlug = data.city ? cityToSlug(data.city, data.state) : null

  const EPAleadMCL = 0.015 // 15 ppb action level
  const leadStatus = data.lead_mg_l !== null
    ? data.lead_mg_l > EPAleadMCL ? 'danger' : data.lead_mg_l > 0.005 ? 'warning' : 'safe'
    : 'unknown'

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: stateName, href: `/state/${data.state.toLowerCase()}` },
    ...(data.city && citySlug ? [{ label: data.city, href: `/city/${citySlug}` }] : []),
    { label: `ZIP ${data.zip}` },
  ]

  return (
    <>
      {/* Structured Data */}
      <Script
        id="zip-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(zipJsonLd(data)) }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(
          breadcrumbs.filter(b => b.href).map(b => ({ name: b.label, url: `https://www.watersafecheck.com${b.href}` }))
        )) }}
      />
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(faqs)) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb items={breadcrumbs} />

        {/* ── Page Header ── */}
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-1">
            ZIP Code {data.zip} Water Quality Report
          </h1>
          <p className="text-lg text-gray-500">
            {data.city}{data.city && data.state ? ', ' : ''}{data.state}
            {data.county ? ` · ${data.county} County` : ''}
          </p>
        </div>

        <AdTop />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* ── Main Content ── */}
          <div className="lg:col-span-3 space-y-8">

            {/* ── Summary Card ── */}
            <div className="card">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                {/* Score Ring */}
                <div className="flex-shrink-0">
                  <ScoreRing score={data.score} grade={data.grade} />
                </div>

                {/* Grade + key stats */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <GradeBadge grade={data.grade} size="lg" />
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Water Safety Grade</p>
                      <p className={`text-sm font-semibold ${
                        data.grade === 'A' ? 'text-green-700' :
                        data.grade === 'B' ? 'text-blue-700' :
                        data.grade === 'C' ? 'text-yellow-700' :
                        data.grade === 'D' ? 'text-orange-700' : 'text-red-700'
                      }`}>
                        {data.grade === 'A' ? 'Excellent — Meets all EPA standards' :
                         data.grade === 'B' ? 'Good — Minor issues on record' :
                         data.grade === 'C' ? 'Fair — Some compliance concerns' :
                         data.grade === 'D' ? 'Poor — Multiple violations recorded' :
                         'Failing — Serious compliance issues'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <StatCard
                      label="Health Violations"
                      value={data.health_violations}
                      color={data.health_violations === 0 ? 'green' : data.health_violations <= 2 ? 'yellow' : 'red'}
                    />
                    <StatCard
                      label="Total Violations"
                      value={data.total_violations}
                      color={data.total_violations === 0 ? 'green' : 'yellow'}
                    />
                    <StatCard
                      label="Lead Risk"
                      value={data.lead_risk || 'N/A'}
                      color={data.lead_risk === 'Low' ? 'green' : data.lead_risk === 'Moderate' ? 'yellow' : 'red'}
                    />
                    <StatCard
                      label="Contaminants"
                      value={data.contaminant_count}
                      color={data.contaminant_count === 0 ? 'green' : 'yellow'}
                    />
                  </div>
                </div>
              </div>

              {/* Active Issues Banner */}
              {data.has_active_issues && (
                <div className="mt-4 alert-danger flex items-start gap-3">
                  <span className="text-xl">⚠</span>
                  <div>
                    <p className="font-bold">Active Water Quality Issues Detected</p>
                    <p className="text-sm mt-1">
                      EPA records show {data.unresolved_violations} unresolved violation{data.unresolved_violations > 1 ? 's' : ''}
                      {data.boil_water_advisories > 0 ? ` and ${data.boil_water_advisories} boil water advisor${data.boil_water_advisories > 1 ? 'ies' : 'y'}` : ''}.
                      Contact {data.system_name || 'your water utility'} for current status.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* ── Intro Narrative ── */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                About Tap Water in ZIP Code {data.zip}
              </h2>
              <div
                className="prose-custom text-base"
                dangerouslySetInnerHTML={{ __html: intro }}
              />
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="font-semibold text-gray-700 mb-1">Water System</p>
                  <p className="text-gray-600">{data.system_name || 'Not available'}</p>
                  {data.pwsid && <p className="text-gray-400 text-xs mt-0.5">EPA ID: {data.pwsid}</p>}
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="font-semibold text-gray-700 mb-1">Water Source</p>
                  <p className="text-gray-600">{data.water_source || 'Not available'}</p>
                </div>
                {data.population > 0 && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="font-semibold text-gray-700 mb-1">Population Served</p>
                    <p className="text-gray-600">{data.population.toLocaleString()} residents</p>
                  </div>
                )}
                {data.county && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="font-semibold text-gray-700 mb-1">County</p>
                    <p className="text-gray-600">{data.county} County, {stateName}</p>
                  </div>
                )}
              </div>
            </div>

            {/* ── Lead Section ── */}
            <div className="card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center text-lg">🧪</div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Lead Levels in ZIP {data.zip}</h2>
                  <p className="text-xs text-gray-400">EPA action level: 15 ppb | Public health goal: 0 ppb</p>
                </div>
              </div>

              <div className={`rounded-xl p-5 mb-4 ${
                leadSection.severity === 'safe' ? 'bg-green-50 border border-green-100' :
                leadSection.severity === 'warning' ? 'bg-yellow-50 border border-yellow-100' :
                leadSection.severity === 'danger' ? 'bg-red-50 border border-red-100' :
                'bg-gray-50 border border-gray-100'
              }`}>
                <p className="font-bold text-lg mb-2">{leadSection.headline}</p>
                <div
                  className="text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: leadSection.body }}
                />
              </div>

              {/* Lead risk narrative */}
              {leadRiskNarrative && (
                <div
                  className="text-sm text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: `<p>${leadRiskNarrative}</p>` }}
                />
              )}

              {/* Lead data table */}
              <div className="mt-4 divide-y divide-gray-50">
                {data.lead_mg_l !== null && (
                  <DataRow
                    label="Lead Level (90th percentile)"
                    value={`${(data.lead_mg_l * 1000).toFixed(2)} ppb (${data.lead_mg_l} mg/L)`}
                    highlight={data.lead_mg_l > EPAleadMCL ? 'danger' : data.lead_mg_l > 0.005 ? 'warning' : 'safe'}
                  />
                )}
                {data.copper_mg_l !== null && (
                  <DataRow
                    label="Copper Level (90th percentile)"
                    value={`${data.copper_mg_l} mg/L`}
                    subtext="EPA action level: 1.3 mg/L"
                    highlight={data.copper_mg_l > 1.3 ? 'danger' : 'safe'}
                  />
                )}
                {data.ccr_lead_ppb !== null && (
                  <DataRow
                    label="Lead (Consumer Confidence Report)"
                    value={`${data.ccr_lead_ppb} ppb`}
                    subtext="From annual CCR filing"
                  />
                )}
                {data.ccr_copper_ppb !== null && (
                  <DataRow
                    label="Copper (Consumer Confidence Report)"
                    value={`${data.ccr_copper_ppb} ppb`}
                    subtext="From annual CCR filing"
                  />
                )}
                <DataRow
                  label="Lead Exposure Risk Rating"
                  value={
                    <span className={`badge ${riskBadgeClass(data.lead_risk)}`}>
                      {data.lead_risk || 'Unknown'}
                    </span>
                  }
                />
                {data.lead_prob !== null && (
                  <DataRow
                    label="Lead Exposure Probability"
                    value={`${data.lead_prob}%`}
                    subtext="EPA model estimate based on housing age and infrastructure"
                  />
                )}
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg text-xs text-blue-700">
                <strong>Note:</strong> Lead levels above are the 90th percentile from EPA monitoring — meaning 90% of samples were at or below this level. Even "undetected" tap water lead doesn't account for lead leaching from home plumbing. If your home was built before 1986, individual tap testing is recommended.
              </div>
            </div>

            <AdInContent />

            {/* ── Violations Section ── */}
            <div className="card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center text-lg">📋</div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Violation History</h2>
                  <p className="text-xs text-gray-400">Past 5 years — EPA SDWIS data</p>
                </div>
              </div>

              <div
                className="prose-custom text-sm mb-4"
                dangerouslySetInnerHTML={{ __html: `<p>${violationNarrative}</p>` }}
              />

              <div className="divide-y divide-gray-50">
                <DataRow label="Total Violations (5 yr)" value={data.total_violations} />
                <DataRow
                  label="Health-Based Violations"
                  value={data.health_violations}
                  highlight={data.health_violations === 0 ? 'safe' : data.health_violations <= 2 ? 'warning' : 'danger'}
                />
                <DataRow
                  label="Unresolved Violations"
                  value={data.unresolved_violations}
                  highlight={data.unresolved_violations > 0 ? 'danger' : 'safe'}
                />
                <DataRow label="Boil Water Advisories" value={data.boil_water_advisories} />
                <DataRow
                  label="Compliance Risk"
                  value={
                    <span className={`badge ${riskBadgeClass(data.compliance_risk)}`}>
                      {data.compliance_risk || 'Unknown'}
                    </span>
                  }
                />
              </div>

              {complianceNarrative && (
                <div
                  className="mt-4 text-sm text-gray-600 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: `<p>${complianceNarrative}</p>` }}
                />
              )}
            </div>

            {/* ── Contaminants Section ── */}
            <div className="card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center text-lg">⚗️</div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Contaminants Detected</h2>
                  <p className="text-xs text-gray-400">Contaminants with health-based violations on record</p>
                </div>
              </div>

              <div
                className="prose-custom text-sm mb-4"
                dangerouslySetInnerHTML={{ __html: `<p>${contaminantNarrative}</p>` }}
              />

              {contaminants.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {contaminants.map((c, i) => (
                    <span key={i} className="badge bg-purple-50 text-purple-700 border-purple-100 text-xs">
                      {c}
                    </span>
                  ))}
                </div>
              )}

              {data.ccr_top_contaminants && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs font-semibold text-gray-600 mb-1">From Consumer Confidence Report:</p>
                  <p className="text-xs text-gray-500">{data.ccr_top_contaminants}</p>
                </div>
              )}

              {/* Enforcement */}
              {data.enforcement_actions > 0 && (
                <div className="mt-4 alert-warning">
                  <p className="font-semibold mb-1">⚖ Enforcement Actions</p>
                  <div
                    className="text-sm"
                    dangerouslySetInnerHTML={{ __html: enforcementNarrative }}
                  />
                </div>
              )}
            </div>

            {/* ── Water Source + Environment ── */}
            <div className="card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-lg">🌊</div>
                <h2 className="text-xl font-bold text-gray-900">Water Source & Environmental Factors</h2>
              </div>

              {data.water_source && (
                <div className="mb-4">
                  <p className="font-semibold text-gray-800 mb-1">{data.water_source}</p>
                  <p className="text-sm text-gray-600">{getWaterSourceDescription(data.water_source)}</p>
                </div>
              )}

              <div className="divide-y divide-gray-50">
                <DataRow label="Water Source Type" value={data.water_source || 'Not available'} />
                {data.ccr_source_type && (
                  <DataRow label="CCR Source Classification" value={data.ccr_source_type} />
                )}
                {data.radon_zone !== null && (
                  <DataRow
                    label="EPA Radon Zone"
                    value={`Zone ${data.radon_zone}`}
                    subtext={data.radon_zone === 1 ? 'Highest potential' : data.radon_zone === 2 ? 'Moderate potential' : 'Lower potential'}
                  />
                )}
                {data.flood_cost !== null && data.flood_cost > 0 && (
                  <DataRow
                    label="Annual Flood Risk Cost"
                    value={`$${data.flood_cost.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                    subtext="Estimated annual flood-related costs per property"
                  />
                )}
                {data.energy_burden !== null && (
                  <DataRow
                    label="Energy Burden"
                    value={`${data.energy_burden}%`}
                    subtext="% of household income spent on energy — indicator of older infrastructure"
                  />
                )}
              </div>

              {data.radon_zone !== null && (
                <p className="mt-3 text-xs text-gray-500">{getRadonZoneDescription(data.radon_zone)}</p>
              )}
            </div>

            {/* ── What To Do Section ── */}
            <div className="card bg-gradient-to-br from-brand-50 to-blue-50 border-brand-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                🛡 What Should You Do? — ZIP {data.zip} Recommendations
              </h2>
              <div className="space-y-3 text-sm">
                {data.grade === 'A' || data.grade === 'B' ? (
                  <>
                    <AlertBox type="safe" title="Your water quality is good">
                      Your water meets all EPA health standards. Standard precautions are sufficient for most residents.
                    </AlertBox>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex gap-2"><span>✓</span> Run cold water for 30 seconds each morning before use — especially if pipes are old</li>
                      <li className="flex gap-2"><span>✓</span> Request your annual Consumer Confidence Report from {data.system_name || 'your water utility'}</li>
                      <li className="flex gap-2"><span>✓</span> If your home was built before 1986, consider testing your own tap for lead</li>
                      <li className="flex gap-2"><span>✓</span> Use a pitcher filter (NSF/ANSI 42 certified) for improved taste</li>
                    </ul>
                    {/* Filter Widget */}
                    <div className="mt-4 pt-4 border-t border-brand-100">
                      <p className="font-semibold text-gray-900 mb-2 font-sans">Recommended Taste & Safety Filter:</p>
                      <div className="bg-white border border-brand-100 rounded-xl p-4 flex flex-col sm:flex-row items-center gap-4 shadow-sm hover:shadow transition-shadow">
                        <div className="text-3xl">🚰</div>
                        <div className="flex-1 text-center sm:text-left">
                          <h4 className="font-bold text-gray-900 text-sm">NSF/ANSI 53 Certified Pitcher Filter</h4>
                          <p className="text-xs text-gray-500 mt-0.5">Best for removing aesthetic chlorine, odors, and low-level heavy metals.</p>
                        </div>
                        <a
                          href="https://www.amazon.com/s?k=NSF+53+water+filter+pitcher&tag=watersafecheck-20"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-primary py-2 px-4 text-xs font-bold whitespace-nowrap shadow-sm hover:shadow"
                        >
                          View Certified Filters →
                        </a>
                      </div>
                    </div>
                  </>
                ) : data.grade === 'C' ? (
                  <>
                    <AlertBox type="warning" title="Some compliance concerns — take precautions">
                      Your water has a moderate compliance history. Take steps to protect vulnerable family members.
                    </AlertBox>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex gap-2"><span>⚠</span> Use a <strong>certified NSF/ANSI 53 filter</strong> for drinking and cooking water if you have young children</li>
                      <li className="flex gap-2"><span>⚠</span> Never give unfiltered tap water to infants in formula — use certified bottled or filtered water</li>
                      <li className="flex gap-2"><span>⚠</span> Request a copy of the Consumer Confidence Report to see what was detected and when</li>
                      <li className="flex gap-2"><span>⚠</span> Call the EPA Safe Drinking Water Hotline: <strong>1-800-426-4791</strong></li>
                    </ul>
                    {/* Filter Widget */}
                    <div className="mt-4 pt-4 border-t border-brand-100">
                      <p className="font-semibold text-gray-900 mb-2">Recommended Water Treatment Systems:</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="bg-white border border-brand-100 rounded-xl p-4 flex flex-col justify-between shadow-sm hover:shadow transition-shadow">
                          <div>
                            <div className="text-2xl mb-1">🏺</div>
                            <h4 className="font-bold text-gray-900 text-sm">NSF 53 Lead Pitcher Filter</h4>
                            <p className="text-xs text-gray-500 mt-1">Specifically certified to reduce lead and copper at the tap.</p>
                          </div>
                          <a
                            href="https://www.amazon.com/s?k=NSF+53+lead+water+filter+pitcher&tag=watersafecheck-20"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary text-center py-2 px-3 text-xs font-bold mt-4 shadow-sm hover:shadow"
                          >
                            Find Lead Filters →
                          </a>
                        </div>
                        <div className="bg-white border border-brand-100 rounded-xl p-4 flex flex-col justify-between shadow-sm hover:shadow transition-shadow">
                          <div>
                            <div className="text-2xl mb-1">⚗️</div>
                            <h4 className="font-bold text-gray-900 text-sm">NSF 58 Under-Sink RO System</h4>
                            <p className="text-xs text-gray-500 mt-1">Advanced filtration for PFAS, fluoride, nitrates, and organic chemicals.</p>
                          </div>
                          <a
                            href="https://www.amazon.com/s?k=NSF+58+reverse+osmosis+system&tag=watersafecheck-20"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary text-center py-2 px-3 text-xs font-bold mt-4 shadow-sm hover:shadow"
                          >
                            Find RO Systems →
                          </a>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <AlertBox type="danger" title="Serious water quality concerns — action recommended">
                      Your water system has significant compliance issues. We strongly recommend protective measures.
                    </AlertBox>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex gap-2"><span>🚨</span> <strong>Install a certified NSF/ANSI 53 or 58 (reverse osmosis) filter immediately</strong> for drinking and cooking</li>
                      <li className="flex gap-2"><span>🚨</span> Do not give unfiltered water to children, pregnant women, or immunocompromised individuals</li>
                      <li className="flex gap-2"><span>🚨</span> Contact {data.system_name || 'your water utility'} to request the current violation status and corrective action plan</li>
                      <li className="flex gap-2"><span>🚨</span> Report concerns to your state environmental agency or call the EPA hotline: <strong>1-800-426-4791</strong></li>
                      <li className="flex gap-2"><span>🚨</span> Consider having your home's tap water independently tested by a certified lab</li>
                    </ul>
                    {/* Filter Widget */}
                    <div className="mt-4 pt-4 border-t border-brand-100">
                      <p className="font-semibold text-gray-900 mb-2">Recommended Water Treatment Systems:</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="bg-white border border-red-100 rounded-xl p-4 flex flex-col justify-between shadow-sm hover:shadow transition-shadow relative">
                          <span className="absolute -top-2 -right-2 bg-red-100 text-red-800 text-[10px] font-black px-2 py-0.5 rounded-full border border-red-200">REQUIRED FOR SAFETY</span>
                          <div>
                            <div className="text-2xl mb-1">🏺</div>
                            <h4 className="font-bold text-gray-900 text-sm">NSF 53 Lead Pitcher Filter</h4>
                            <p className="text-xs text-gray-500 mt-1">Certified to remove lead. Recommended for immediate protection.</p>
                          </div>
                          <a
                            href="https://www.amazon.com/s?k=NSF+53+lead+water+filter+pitcher&tag=watersafecheck-20"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary text-center py-2 px-3 text-xs font-bold mt-4 shadow-sm hover:shadow"
                          >
                            Find Lead Filters →
                          </a>
                        </div>
                        <div className="bg-white border border-brand-200 rounded-xl p-4 flex flex-col justify-between shadow-sm hover:shadow transition-shadow relative ring-2 ring-brand-600 ring-offset-2">
                          <span className="absolute -top-3 left-4 bg-brand-700 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">STRONGLY RECOMMENDED</span>
                          <div>
                            <div className="text-2xl mb-1">⚗️</div>
                            <h4 className="font-bold text-gray-900 text-sm">NSF 58 Under-Sink RO System</h4>
                            <p className="text-xs text-gray-500 mt-1">Reverse Osmosis system certified to remove PFAS, heavy metals, and viruses.</p>
                          </div>
                          <a
                            href="https://www.amazon.com/s?k=NSF+58+reverse+osmosis+system&tag=watersafecheck-20"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary text-center py-2 px-3 text-xs font-bold mt-4 shadow-sm hover:shadow"
                          >
                            Find RO Systems →
                          </a>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* ── FAQ Section ── */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-5">
                Frequently Asked Questions — ZIP {data.zip} Water Quality
              </h2>
              <div className="space-y-2">
                {faqs.map((faq, i) => (
                  <FaqItem key={i} q={faq.q} a={faq.a} open={i === 0} />
                ))}
              </div>
            </div>

            {/* ── Data Sources ── */}
            <div className="text-xs text-gray-400 bg-gray-50 rounded-lg p-4">
              <p className="font-semibold text-gray-500 mb-1">Data Sources & Methodology</p>
              <p>Water quality data for ZIP code {data.zip} is compiled from the EPA Safe Drinking Water Information System (SDWIS), EPA ECHO enforcement database, UCMR5 unregulated contaminant monitoring, and Consumer Confidence Reports filed by {data.system_name || 'the water utility'}. Safety scores are composite metrics derived from violation history, lead levels, enforcement actions, and infrastructure risk indicators. Data reflects a 5-year monitoring window. Last dataset update: 2024. <a href="https://www.epa.gov/enviro/sdwis-search" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600">View EPA source data →</a></p>
            </div>

            <AdBottom />
          </div>

          {/* ── Sidebar ── */}
          <aside className="lg:col-span-1 space-y-6">
            <AdSidebar />

            {/* Quick Facts */}
            <div className="card">
              <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide">Quick Facts</h3>
              <div className="space-y-0 divide-y divide-gray-50">
                <DataRow label="ZIP Code" value={data.zip} />
                <DataRow label="City" value={data.city || '—'} />
                <DataRow label="State" value={stateName} />
                <DataRow label="Safety Grade" value={<GradeBadge grade={data.grade} size="sm" />} />
                <DataRow label="Safety Score" value={`${data.score ?? 'N/A'}/100`} />
                <DataRow label="Population" value={data.population > 0 ? formatPopulation(data.population) : '—'} />
                <DataRow label="Water Source" value={data.water_source || '—'} />
              </div>
            </div>

            {/* State + City links */}
            <div className="card">
              <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide">Browse Related</h3>
              <div className="space-y-2">
                <Link
                  href={`/state/${data.state.toLowerCase()}`}
                  className="flex items-center gap-2 text-sm text-brand-700 hover:text-brand-900 font-medium"
                >
                  <span>🗺</span> All ZIP codes in {stateName}
                </Link>
                {citySlug && (
                  <Link
                    href={`/city/${citySlug}`}
                    className="flex items-center gap-2 text-sm text-brand-700 hover:text-brand-900 font-medium"
                  >
                    <span>🏙</span> All ZIP codes in {data.city}
                  </Link>
                )}
                <a
                  href={`https://echo.epa.gov/facilities/facility-search?p_pwsid=${data.pwsid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
                >
                  <span>↗</span> View in EPA ECHO Database
                </a>
              </div>
            </div>

            {/* Nearby ZIP codes */}
            {nearbyZips.length > 0 && (
              <div className="card">
                <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide">
                  Nearby ZIP Codes in {data.city}
                </h3>
                <div className="space-y-1">
                  {nearbyZips.map(z => (
                    <Link
                      key={z.zip}
                      href={`/zip/${z.zip}`}
                      className="flex items-center justify-between px-2 py-1.5 rounded hover:bg-gray-50 group"
                    >
                      <span className="text-sm font-mono text-gray-700 group-hover:text-brand-700">{z.zip}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">{z.score ?? '—'}/100</span>
                        <GradeBadge grade={z.grade} size="sm" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </>
  )
}
