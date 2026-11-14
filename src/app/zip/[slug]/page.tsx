// src/app/zip/[slug]/page.tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  getZipData, STATE_NAMES,
  gradeColor, riskBadgeClass, formatPopulation,
  getContaminantList, getWaterSourceDescription,
  getRadonZoneDescription, cityToSlug, getNearbyZips,
  getUtilityZips,
} from '@/lib/data'
import {
  getZipIntro, getLeadSection, getViolationNarrative,
  getContaminantNarrative, getEnforcementNarrative,
  getLeadRiskNarrative, getComplianceNarrative,
  getWaterQualityFAQs, getDirectAnswerSnippet,
  getWaterHardnessAnalysis, getEpaVerificationUrl,
  getFilterRecommendation, getZipTestingGuide,
} from '@/lib/content'
import { SITE_URL, safeJsonLd, zipPageMeta, zipJsonLd, faqJsonLd } from '@/lib/seo'
import {
  GradeBadge, ScoreRing, DataRow, AlertBox, WaterFilterQuiz,
  Breadcrumb, StatCard, FaqItem,
} from '@/components/ui'
import { DisplayAd, InArticleAd, MultiplexAd } from '@/components/ui/AdSense'
import {
  ShieldCheck, Droplets, CheckCircle2, AlertTriangle, ExternalLink,
  Sparkles, Activity, Beaker, Shield, ChevronRight, MapPin, Building2,
  Users, HelpCircle, Layers, Check, Phone, ArrowUpRight, BookOpen,
} from 'lucide-react'

interface Props { params: { slug: string } }

export const runtime = 'edge'
export const revalidate = 604800

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await getZipData(params.slug)
  if (!data) return { title: 'ZIP Code Not Found | WaterSafeCheck' }
  return zipPageMeta(data)
}

export async function generateStaticParams() {
  const priority = [
    '10001','10002','10003',
    '90001','90210','90291',
    '60601','60602',
    '77001','77002',
    '85001','85002',
    '19101','19102',
    '78201','78202',
    '92101','92102',
    '75201','75202',
    '78701','78702',
    '02101','02102',
    '30301','30302',
    '98101','98102',
    '80201','80202',
    '33101','33102',
    '89101','89102',
    '97201','97202',
    '85701','85702',
    '28201','28202',
    '37201','37202',
    '32099','32202',
  ]
  return Array.from(new Set(priority)).map(zip => ({ slug: zip }))
}

export default async function ZipPage({ params }: Props) {
  const data = await getZipData(params.slug)
  if (!data) notFound()

  const [nearbyZips, utilityZips] = await Promise.all([
    getNearbyZips(data.zip, data.city, data.state),
    getUtilityZips(data.pwsid, data.zip, 8),
  ])
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
  const testingGuide = getZipTestingGuide(data)

  const directAnswer = getDirectAnswerSnippet(data)
  const hardness = getWaterHardnessAnalysis(data)
  const epaUrl = getEpaVerificationUrl(data.pwsid)
  const filterAdv = getFilterRecommendation(data)

  const EPAleadMCL = 0.015
  const leadStatus = data.lead_mg_l !== null
    ? data.lead_mg_l > EPAleadMCL ? 'danger' : data.lead_mg_l > 0.005 ? 'warning' : 'safe'
    : 'unknown'

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: stateName, href: `/state/${data.state.toLowerCase()}` },
    ...(data.city && citySlug ? [{ label: data.city, href: `/city/${citySlug}` }] : []),
    { label: `ZIP ${data.zip}` },
  ]

  const breadcrumbItems = [
    { name: 'Home', url: SITE_URL },
    { name: stateName, url: `${SITE_URL}/state/${data.state.toLowerCase()}` },
    ...(data.city && citySlug ? [{ name: data.city, url: `${SITE_URL}/city/${citySlug}` }] : []),
    { name: `ZIP ${data.zip}`, url: `${SITE_URL}/zip/${data.zip}` },
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(zipJsonLd(data, breadcrumbItems)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd(faqs)) }}
      />

      <div className="min-h-screen bg-[#F5F5F7] text-slate-900 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <Breadcrumb items={breadcrumbs} />

          {/* ── Apple-Style Report Hero Banner ── */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-white to-sky-50/50 p-6 sm:p-10 border border-slate-200/80 shadow-apple-card mb-8">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-apple-blue/10 text-apple-blue text-xs font-semibold tracking-wide">
                <ShieldCheck className="w-3.5 h-3.5" />
                Official EPA SDWIS Verified
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold tracking-wide">
                <Beaker className="w-3.5 h-3.5 text-slate-500" />
                Water Quality &amp; Testing Guide
              </span>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${
                data.boil_water_advisories > 0 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-50 text-emerald-700'
              }`}>
                <Activity className="w-3.5 h-3.5" />
                {data.boil_water_advisories > 0 ? `${data.boil_water_advisories} Past Advisory Event(s)` : 'No Active SDWIS Violations'}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mb-2">
              ZIP Code {data.zip} Water Quality &amp; Testing Report
            </h1>
            <p className="text-base sm:text-xl text-slate-600 font-normal">
              {data.city}{data.city && data.state ? ', ' : ''}{data.state}
              {data.county ? ` · ${data.county} County` : ''} · Updated for {new Date().getFullYear()}
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
                Compiled &amp; verified by <Link href="/about" className="font-semibold text-slate-900 hover:text-apple-blue underline">Sahajul Haque</Link> from EPA SDWIS records
              </span>
            </div>

            {/* YMYL Public Health Notice */}
            <div className="mt-4 p-3.5 rounded-2xl bg-amber-500/[0.08] border border-amber-300/60 text-xs text-amber-900 leading-relaxed flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>Public Health Notice:</strong> Water quality records reflect historical Safe Drinking Water Act filings. If you are pregnant, nursing, preparing infant formula, or immunocompromised, consult a physician. Boiling water neutralizes microbial pathogens, but does NOT eliminate dissolved chemical contaminants like lead or PFAS.
              </div>
            </div>
          </div>

          {/* ── Direct Answer Quick Callout (Apple Glass Card) ── */}
          <section
            aria-label="Direct Water Safety Summary"
            className="mb-8 p-6 sm:p-8 rounded-3xl bg-white/90 backdrop-blur-xl border-2 border-sky-300/80 shadow-[0_8px_30px_-6px_rgba(14,165,233,0.14)] relative overflow-hidden"
          >
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-sky-400 via-blue-500 to-cyan-400" />
            <div className="flex items-center gap-2 mb-2 text-sky-600 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              Quick EPA Verified Answer
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-2 tracking-tight">
              Is Tap Water Safe to Drink in ZIP {data.zip} ({data.city || 'Local Area'}, {data.state})? ({new Date().getFullYear()} EPA Compliance Summary)
            </h2>
            <p className="text-slate-700 text-base sm:text-lg leading-relaxed font-normal">
              {directAnswer}
            </p>
          </section>

          {/* Ad 1: Top Hero High-Visibility Display Ad */}
          <DisplayAd className="my-6" />

          {/* ── 2-Column Responsive Layout with Sticky Sidebar ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* ── Left Column: Main Detailed Content (8 cols) ── */}
            <main className="lg:col-span-8 space-y-8">

              {/* ── Health Dashboard Summary Card ── */}
              <div className="apple-card p-6 sm:p-8 bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/80 shadow-apple-card">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8">
                  {/* Score Ring */}
                  <div className="flex-shrink-0 self-center sm:self-auto">
                    <ScoreRing score={data.score} grade={data.grade} />
                  </div>

                  {/* Grade + Key Metric Bento */}
                  <div className="flex-1 w-full">
                    <div className="flex items-center gap-3.5 mb-5">
                      <GradeBadge grade={data.grade} size="lg" />
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Water Safety Grade</p>
                        <p className={`text-base sm:text-lg font-extrabold ${
                          data.grade === 'A' ? 'text-emerald-600' :
                          data.grade === 'B' ? 'text-apple-blue' :
                          data.grade === 'C' ? 'text-amber-600' :
                          data.grade === 'D' ? 'text-orange-600' : 'text-rose-600'
                        }`}>
                          {data.grade === 'A' ? 'Excellent — Meets all EPA standards' :
                           data.grade === 'B' ? 'Good — Minor compliance notes on record' :
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
                  <div className="mt-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0 text-rose-600 mt-0.5" />
                    <div>
                      <p className="font-bold text-rose-900">Active Water Quality Issues Detected</p>
                      <p className="text-xs sm:text-sm mt-1 text-rose-800 leading-relaxed">
                        EPA records show {data.unresolved_violations} unresolved violation{data.unresolved_violations > 1 ? 's' : ''}
                        {data.boil_water_advisories > 0 ? ` and ${data.boil_water_advisories} boil water advisor${data.boil_water_advisories > 1 ? 'ies' : 'y'}` : ''}.
                        Contact {data.system_name || 'your water utility'} for the latest remedial status.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* ── Intro Narrative ── */}
              <div className="apple-card p-6 sm:p-8 bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/80 shadow-apple-card">
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-4">
                  About Tap Water in ZIP Code {data.zip}
                </h2>
                <div
                  className="prose-custom text-slate-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: intro }}
                />
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Water System</p>
                    <p className="font-bold text-slate-800">{data.system_name || 'Not available'}</p>
                    {data.pwsid && <p className="text-slate-400 text-xs mt-0.5 font-mono">EPA ID: {data.pwsid}</p>}
                  </div>
                  <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Water Source</p>
                    <p className="font-bold text-slate-800">{data.water_source || 'Not available'}</p>
                  </div>
                  {data.population > 0 && (
                    <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Population Served</p>
                      <p className="font-bold text-slate-800">{data.population.toLocaleString()} residents</p>
                    </div>
                  )}
                  {data.county && (
                    <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-100">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">County</p>
                      <p className="font-bold text-slate-800">{data.county} County, {stateName}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* ── Lead Section ── */}
              <div className="apple-card p-6 sm:p-8 bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/80 shadow-apple-card">
                <div className="flex items-center gap-3.5 mb-5">
                  <div className="w-11 h-11 rounded-2xl bg-rose-100/90 border border-rose-200 text-rose-600 flex items-center justify-center font-bold shadow-xs">
                    <Droplets className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Lead Levels in ZIP {data.zip}</h2>
                    <p className="text-xs text-slate-400">EPA action level: 15 ppb | Public health goal: 0 ppb</p>
                  </div>
                </div>

                <div className={`rounded-2xl p-5 mb-5 ${
                  leadSection.severity === 'safe' ? 'bg-emerald-50/90 border border-emerald-200/70 text-emerald-900' :
                  leadSection.severity === 'warning' ? 'bg-amber-50/90 border border-amber-200/70 text-amber-900' :
                  leadSection.severity === 'danger' ? 'bg-rose-50/90 border border-rose-200/70 text-rose-900' :
                  'bg-slate-50 border border-slate-200/70 text-slate-800'
                }`}>
                  <p className="font-bold text-base mb-1.5">{leadSection.headline}</p>
                  <div
                    className="text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: leadSection.body }}
                  />
                </div>

                {leadRiskNarrative && (
                  <div
                    className="text-sm text-slate-600 leading-relaxed mb-4"
                    dangerouslySetInnerHTML={{ __html: `<p>${leadRiskNarrative}</p>` }}
                  />
                )}

                {/* Lead Bento Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
                  {data.lead_mg_l !== null && (
                    <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                        Lead (90th Percentile)
                      </span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl font-black text-slate-900">{(data.lead_mg_l * 1000).toFixed(2)}</span>
                        <span className="text-xs font-semibold text-slate-400">ppb</span>
                      </div>
                      <span className={`text-[11px] font-semibold block mt-1.5 ${data.lead_mg_l > EPAleadMCL ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {data.lead_mg_l > EPAleadMCL ? '⚠️ Exceeds EPA 15 ppb limit' : '✓ Below EPA 15 ppb limit'}
                      </span>
                    </div>
                  )}
                  {data.copper_mg_l !== null && (
                    <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                        Copper (90th Percentile)
                      </span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl font-black text-slate-900">{data.copper_mg_l}</span>
                        <span className="text-xs font-semibold text-slate-400">mg/L</span>
                      </div>
                      <span className={`text-[11px] font-semibold block mt-1.5 ${data.copper_mg_l > 1.3 ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {data.copper_mg_l > 1.3 ? '⚠️ Exceeds 1.3 mg/L limit' : '✓ Below 1.3 mg/L limit'}
                      </span>
                    </div>
                  )}
                  <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Exposure Rating
                    </span>
                    <div className="mt-1 flex items-center justify-between">
                      <span className={`badge ${riskBadgeClass(data.lead_risk)} font-bold`}>
                        {data.lead_risk || 'Standard'}
                      </span>
                      {data.lead_prob !== null && (
                        <span className="text-xs font-bold text-slate-600">{data.lead_prob}% Prob.</span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-1.5">Housing age & infrastructure factor</span>
                  </div>
                </div>

                <div className="mt-3 p-3.5 bg-sky-50/80 rounded-2xl text-xs text-slate-600 leading-relaxed border border-sky-100">
                  <strong>Monitoring Methodology:</strong> Values are the 90th percentile from EPA monitoring logs. If your home was constructed before 1986, individualized tap testing is recommended due to interior plumbing solder.
                </div>
              </div>

              {/* Ad 3: In-Content Editorial Fluid Ad (Post-Lead) */}
              <InArticleAd className="my-8" />

              {/* ── Water Hardness & Minerals Section ── */}
              <div className="apple-card p-6 sm:p-8 bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/80 shadow-apple-card">
                <div className="flex items-center gap-3.5 mb-5">
                  <div className="w-11 h-11 rounded-2xl bg-sky-100/90 border border-sky-200 text-sky-600 flex items-center justify-center font-bold shadow-xs">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Water Hardness &amp; Mineral Content</h2>
                    <p className="text-xs text-slate-400">Grains per gallon (GPG) & Parts per million (PPM)</p>
                  </div>
                </div>

                <div className="rounded-2xl p-5 mb-5 border border-slate-200/80 bg-slate-50/60">
                  <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                    <span className="text-lg font-bold text-slate-900 tracking-tight">Classification: {hardness.category}</span>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white border border-slate-200/80 shadow-xs">
                      {hardness.gpg} GPG &bull; {hardness.ppm} mg/L
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed mb-3">
                    {hardness.description}
                  </p>
                  <div className="p-3 bg-white rounded-xl text-xs font-medium text-slate-700 border border-slate-100">
                    <strong>Recommendation:</strong> {hardness.recommendation}
                  </div>
                </div>

                <div className="divide-y divide-slate-100 text-sm">
                  <DataRow label="Hardness (GPG)" value={`${hardness.gpg} GPG`} subtext="Grains per gallon" />
                  <DataRow label="Hardness (PPM / mg/L)" value={`${hardness.ppm} mg/L`} subtext="Parts per million CaCO3" />
                  <DataRow label="Appliance Scaling Risk" value={hardness.category === 'Soft' ? 'Very Low' : hardness.category === 'Moderately Hard' ? 'Moderate' : 'High / Severe'} highlight={hardness.category === 'Soft' ? 'safe' : hardness.category === 'Moderately Hard' ? 'safe' : 'warning'} />
                </div>
              </div>

              {/* ── Interactive Water Filter & Safety Quiz ── */}
              <WaterFilterQuiz
                zip={data.zip}
                city={data.city || undefined}
                state={data.state || undefined}
                leadStatus={leadStatus}
                hardnessCategory={hardness.category}
                hasViolations={data.health_violations > 0}
              />

              {/* ── Official EPA SDWIS Verification Banner ── */}
              <div className="p-6 bg-slate-950 text-white rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl border border-white/10">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center text-sky-400">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">Official EPA SDWIS Database Entry</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Utility: {data.system_name || 'Public Water System'} &bull; PWSID: {data.pwsid || 'SDWA Monitored'}
                    </p>
                  </div>
                </div>
                <a
                  href={epaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-apple-blue hover:bg-blue-600 text-white text-xs font-bold rounded-full transition-all shadow-md active:scale-95 whitespace-nowrap"
                >
                  <span>Verify on EPA.gov</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Ad 4: Post-EPA Banner High-CTR Display Ad */}
              <DisplayAd className="my-8" />

              {/* ── Violations Section ── */}
              <div className="apple-card p-6 sm:p-8 bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/80 shadow-apple-card">
                <div className="flex items-center gap-3.5 mb-5">
                  <div className="w-11 h-11 rounded-2xl bg-amber-100/90 border border-amber-200 text-amber-600 flex items-center justify-center font-bold shadow-xs">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Violation History</h2>
                    <p className="text-xs text-slate-400">Past 5 years &bull; EPA SDWIS records</p>
                  </div>
                </div>

                <div
                  className="prose-custom text-sm text-slate-700 leading-relaxed mb-5"
                  dangerouslySetInnerHTML={{ __html: `<p>${violationNarrative}</p>` }}
                />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
                  <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Total SDWA Violations</span>
                    <span className="text-2xl font-black text-slate-900">{data.total_violations}</span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">5-year monitoring record</span>
                  </div>
                  <div className={`p-4 rounded-2xl ${data.health_violations === 0 ? 'bg-emerald-50/80 border border-emerald-200/70 text-emerald-900' : 'bg-rose-50/80 border border-rose-200/70 text-rose-900'}`}>
                    <span className="text-[10px] font-bold uppercase tracking-wider block mb-1 opacity-70">Health-Based Violations</span>
                    <span className="text-2xl font-black">{data.health_violations}</span>
                    <span className="text-[11px] font-semibold block mt-0.5">{data.health_violations === 0 ? '✓ Zero Health Violations' : '⚠️ Exceeded Safe Limit'}</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Unresolved Status</span>
                    <span className={`text-2xl font-black ${data.unresolved_violations > 0 ? 'text-rose-600' : 'text-slate-900'}`}>{data.unresolved_violations}</span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">{data.boil_water_advisories > 0 ? `${data.boil_water_advisories} Boil Advisory Event(s)` : 'No open violations'}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
                  <span className="font-semibold text-slate-700">Overall System Compliance Risk:</span>
                  <span className={`badge ${riskBadgeClass(data.compliance_risk)} font-bold`}>
                    {data.compliance_risk || 'Normal'}
                  </span>
                </div>

                {complianceNarrative && (
                  <div
                    className="mt-4 text-sm text-slate-600 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: `<p>${complianceNarrative}</p>` }}
                  />
                )}
              </div>

              {/* ── Contaminants Section ── */}
              <div className="apple-card p-6 sm:p-8 bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/80 shadow-apple-card">
                <div className="flex items-center gap-3.5 mb-5">
                  <div className="w-11 h-11 rounded-2xl bg-indigo-100/90 border border-indigo-200 text-indigo-600 flex items-center justify-center font-bold shadow-xs">
                    <Beaker className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Contaminants Detected</h2>
                    <p className="text-xs text-slate-400">Contaminants with health-based violations on record</p>
                  </div>
                </div>

                <div
                  className="prose-custom text-sm text-slate-700 leading-relaxed mb-4"
                  dangerouslySetInnerHTML={{ __html: `<p>${contaminantNarrative}</p>` }}
                />

                {contaminants.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {contaminants.map((c, i) => (
                      <span key={i} className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/80 text-xs font-semibold">
                        {c}
                      </span>
                    ))}
                  </div>
                )}

                {data.ccr_top_contaminants && (
                  <div className="mt-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">From Consumer Confidence Report:</p>
                    <p className="text-xs text-slate-700 leading-relaxed">{data.ccr_top_contaminants}</p>
                  </div>
                )}

                {data.enforcement_actions > 0 && (
                  <div className="mt-4 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900">
                    <p className="font-semibold mb-1">Enforcement Actions Recorded</p>
                    <div
                      className="text-sm leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: enforcementNarrative }}
                    />
                  </div>
                )}
              </div>

              {/* Ad 5: In-Content Editorial Ad (Post-Contaminants) */}
              <InArticleAd className="my-8" />

              {/* ── Water Source + Environment ── */}
              <div className="apple-card p-6 sm:p-8 bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/80 shadow-apple-card">
                <div className="flex items-center gap-3.5 mb-5">
                  <div className="w-11 h-11 rounded-2xl bg-sky-100/90 border border-sky-200 text-sky-600 flex items-center justify-center font-bold shadow-xs">
                    <Droplets className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Water Source &amp; Environmental Factors</h2>
                </div>

                {data.water_source && (
                  <div className="mb-4">
                    <p className="font-bold text-slate-900 mb-1">{data.water_source}</p>
                    <p className="text-sm text-slate-600 leading-relaxed">{getWaterSourceDescription(data.water_source)}</p>
                  </div>
                )}

                <div className="divide-y divide-slate-100">
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
                  <p className="mt-4 text-xs text-slate-500 leading-relaxed">{getRadonZoneDescription(data.radon_zone)}</p>
                )}
              </div>

              {/* ── Water Quality Testing Guide ── */}
              <section className="apple-card p-6 sm:p-8 bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/80 shadow-apple-card">
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="w-11 h-11 rounded-2xl bg-blue-100/90 border border-blue-200 text-blue-600 flex items-center justify-center font-bold shadow-xs">
                    <Beaker className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                      Water Testing Protocol for ZIP {data.zip}
                    </h2>
                    <p className="text-xs text-slate-400">Certified Tap &amp; Well Water Procedures</p>
                  </div>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed mb-5">
                  {testingGuide.summary}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80">
                    <h3 className="text-xs font-bold uppercase text-slate-800 tracking-wider mb-2.5 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Tap Water Testing Steps
                    </h3>
                    <ul className="space-y-2 text-xs text-slate-600">
                      {testingGuide.tapTestingSteps.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="font-bold text-apple-blue">{idx + 1}.</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/80">
                    <h3 className="text-xs font-bold uppercase text-amber-900 tracking-wider mb-2.5 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      Private Well Testing Steps
                    </h3>
                    <ul className="space-y-2 text-xs text-slate-600">
                      {testingGuide.wellTestingSteps.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="font-bold text-amber-700">&bull;</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="p-3.5 bg-sky-50 rounded-2xl border border-sky-100 text-xs text-slate-700">
                  <strong>Certified Lab Testing:</strong> Always use an EPA-certified drinking water laboratory in {data.state} for legal, well, or real estate compliance testing.
                </div>
              </section>

              {/* ── Recommended Actions Section ── */}
              <div className="apple-card p-6 sm:p-8 bg-gradient-to-br from-blue-50/40 via-white to-sky-50/20 backdrop-blur-2xl rounded-3xl border border-blue-200/70 shadow-apple-card">
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-4">
                  Recommended Actions &bull; ZIP {data.zip}
                </h2>
                <div className="space-y-4 text-sm mt-4">
                  {data.grade === 'A' || data.grade === 'B' ? (
                    <>
                      <AlertBox type="safe" title="Water quality meets federal standards">
                        Your water complies with EPA primary health thresholds. Standard household maintenance is recommended.
                      </AlertBox>
                      <ul className="space-y-2 text-slate-600">
                        <li className="flex gap-2"><span>&bull;</span> Run cold tap water for 30 seconds before use each morning if plumbing is older</li>
                        <li className="flex gap-2"><span>&bull;</span> Request your annual Consumer Confidence Report from {data.system_name || 'your water utility'}</li>
                        <li className="flex gap-2"><span>&bull;</span> If your residence was constructed before 1986, test your fixtures for lead solder leaching</li>
                        <li className="flex gap-2"><span>&bull;</span> Use an NSF/ANSI 42 or 53 certified pitcher filter for crisp taste</li>
                      </ul>
                    </>
                  ) : (
                    <>
                      <AlertBox type="warning" title="Elevated compliance concerns detected">
                        Your water system has recorded compliance events. Independent filtration is advised for vulnerable family members.
                      </AlertBox>
                      <ul className="space-y-2 text-slate-600">
                        <li className="flex gap-2"><span>&bull;</span> Use an NSF/ANSI 53 or 58 (Reverse Osmosis) certified filter for drinking and cooking</li>
                        <li className="flex gap-2"><span>&bull;</span> Never use unfiltered tap water for infant formula if plumbing is pre-1986</li>
                        <li className="flex gap-2"><span>&bull;</span> Call the EPA Safe Drinking Water Hotline: 1-800-426-4791</li>
                      </ul>
                    </>
                  )}
                </div>
              </div>

              {/* Ad 7: Pre-FAQ High-Intent Display Ad */}
              <DisplayAd className="my-8" />

              {/* ── FAQ Section ── */}
              <div className="apple-card p-6 sm:p-8 bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/80 shadow-apple-card">
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-6 flex items-center gap-2">
                  <HelpCircle className="w-6 h-6 text-apple-blue" />
                  Frequently Asked Questions &bull; ZIP {data.zip} Water
                </h2>
                <div className="space-y-3">
                  {faqs.map((faq, i) => (
                    <FaqItem key={i} q={faq.q} a={faq.a} open={i === 0} />
                  ))}
                </div>
              </div>

              {/* ── Data Sources ── */}
              <div className="text-xs text-slate-500 apple-card p-5 bg-slate-50/70 border border-slate-200/80 rounded-2xl leading-relaxed">
                <p className="font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-1">Official Data Sources &amp; Methodology</p>
                <p>
                  Water quality data for ZIP code {data.zip} is aggregated from the EPA Safe Drinking Water Information System (SDWIS), EPA ECHO enforcement database, UCMR 5 monitoring, and municipal Consumer Confidence Reports filed by {data.system_name || 'the local water authority'}. Safety scores reflect rolling multi-year compliance histories.
                </p>
              </div>

              {/* Ad 8: Bottom Native Multiplex Recommendations Grid */}
              <MultiplexAd className="my-10" />
            </main>

            {/* ── Right Column: Sticky Sidebar (4 cols) ── */}
            <aside className="lg:col-span-4 sticky top-20 self-start space-y-6">
              {/* Ad 2: Sticky Sidebar Top Display Ad */}
              <DisplayAd className="my-2" style={{ minHeight: '250px' }} />

              {/* Quick Facts Bento */}
              <div className="apple-card p-5 sm:p-6 bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/80 shadow-apple-card">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-apple-blue" />
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">Quick Facts</h3>
                </div>
                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-200/60">
                    <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">ZIP Code</span>
                    <span className="font-mono font-bold text-slate-900 text-sm block mt-0.5">{data.zip}</span>
                  </div>
                  <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-200/60">
                    <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">EPA Grade</span>
                    <div className="mt-1 flex items-center justify-between">
                      <GradeBadge grade={data.grade} size="sm" />
                      <span className="font-bold text-slate-800 text-xs">{data.score ?? '—'}/100</span>
                    </div>
                  </div>
                  <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-200/60">
                    <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Population</span>
                    <span className="font-bold text-slate-800 text-xs block mt-0.5">{data.population > 0 ? formatPopulation(data.population) : '—'}</span>
                  </div>
                  <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-200/60">
                    <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Source</span>
                    <span className="font-bold text-slate-800 text-xs block truncate mt-0.5" title={data.water_source || ''}>{data.water_source || '—'}</span>
                  </div>
                </div>
              </div>

              {/* Regional Explorer */}
              <div className="apple-card p-5 sm:p-6 bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/80 shadow-apple-card">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-3.5 h-3.5 text-apple-blue" />
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">Regional Explorer</h3>
                </div>
                <div className="space-y-2">
                  <Link
                    href={`/state/${data.state.toLowerCase()}`}
                    className="flex items-center justify-between p-3 rounded-2xl border border-slate-200/70 hover:border-apple-blue/40 hover:bg-slate-50 text-xs text-slate-800 font-semibold transition-all group"
                  >
                    <span>All ZIPs in {stateName}</span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-apple-blue group-hover:translate-x-0.5 transition-all" />
                  </Link>
                  {citySlug && (
                    <Link
                      href={`/city/${citySlug}`}
                      className="flex items-center justify-between p-3 rounded-2xl border border-slate-200/70 hover:border-apple-blue/40 hover:bg-slate-50 text-xs text-slate-800 font-semibold transition-all group"
                    >
                      <span>All ZIPs in {data.city}</span>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-apple-blue group-hover:translate-x-0.5 transition-all" />
                    </Link>
                  )}
                  <a
                    href={`https://echo.epa.gov/facilities/facility-search?p_pwsid=${data.pwsid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-2xl border border-slate-200/70 hover:border-slate-300 text-xs text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    <span>Official EPA ECHO Record</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </a>
                </div>
              </div>

              {/* Research & Testing Pillar Guides */}
              <div className="apple-card p-5 bg-gradient-to-br from-blue-50/70 to-sky-50/40 rounded-3xl border border-blue-200/70 shadow-apple-card">
                <div className="flex items-center gap-2 mb-2 text-apple-blue font-bold text-xs uppercase tracking-wider">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Essential Guides</span>
                </div>
                <div className="space-y-2 text-xs">
                  <Link href="/water-quality-guide" className="block p-2.5 rounded-2xl bg-white border border-blue-100 hover:border-apple-blue font-semibold text-slate-800 hover:text-apple-blue transition-colors shadow-xs">
                    📖 EPA Drinking Water Guide &rarr;
                  </Link>
                  <Link href="/blog/private-well-water-safety-testing-guide" className="block p-2.5 rounded-2xl bg-white border border-blue-100 hover:border-apple-blue font-semibold text-slate-800 hover:text-apple-blue transition-colors shadow-xs">
                    🧪 Private Well Water Testing &rarr;
                  </Link>
                </div>
              </div>

              {/* Ad 6: Sticky Sidebar Mid Display Ad */}
              <DisplayAd className="my-2" style={{ minHeight: '250px' }} />

              {/* Nearby ZIP codes */}
              {nearbyZips.length > 0 && (
                <div className="apple-card p-5 sm:p-6 bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/80 shadow-apple-card">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                      Nearby in {data.city || stateName}
                    </h3>
                    <span className="text-[10px] text-slate-400 font-semibold px-2 py-0.5 rounded-full bg-slate-100">{nearbyZips.length} ZIPs</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {nearbyZips.map(z => (
                      <Link
                        key={z.zip}
                        href={`/zip/${z.zip}`}
                        className="flex items-center justify-between p-2.5 rounded-2xl border border-slate-200/70 bg-slate-50/50 hover:bg-white hover:border-apple-blue/40 hover:shadow-xs transition-all text-xs group active:scale-[0.98]"
                      >
                        <span className="font-mono font-bold text-slate-800 group-hover:text-apple-blue">{z.zip}</span>
                        <GradeBadge grade={z.grade} size="sm" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Same Water Utility ZIPs */}
              {utilityZips.length > 0 && (
                <div className="apple-card p-5 sm:p-6 bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/80 shadow-apple-card">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                      Same Water Utility
                    </h3>
                    <span className="text-[10px] text-slate-400 font-semibold px-2 py-0.5 rounded-full bg-slate-100">{utilityZips.length} ZIPs</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mb-3 truncate" title={data.system_name || 'Public Utility'}>
                    {data.system_name || 'Shared utility network'}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {utilityZips.map(z => (
                      <Link
                        key={`util-${z.zip}`}
                        href={`/zip/${z.zip}`}
                        className="flex items-center justify-between p-2.5 rounded-2xl border border-slate-200/70 bg-slate-50/50 hover:bg-white hover:border-apple-blue/40 hover:shadow-xs transition-all text-xs group active:scale-[0.98]"
                      >
                        <div className="truncate pr-1">
                          <span className="font-mono font-bold text-slate-800 group-hover:text-apple-blue block">{z.zip}</span>
                          {z.city && <span className="text-[10px] text-slate-400 truncate block">{z.city}</span>}
                        </div>
                        <GradeBadge grade={z.grade} size="sm" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </div>
    </>
  )
}
