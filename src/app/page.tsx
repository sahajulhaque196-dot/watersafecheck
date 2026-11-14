// src/app/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getAllStates } from '@/lib/data'
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL, safeJsonLd } from '@/lib/seo'
import { HomeSearch } from '@/components/sections/HomeSearch'
import { blogArticles } from '@/data/blog-articles'
import { DisplayAd, InArticleAd, MultiplexAd } from '@/components/ui/AdSense'
import { FadeIn } from '@/components/ui/FadeIn'
import dynamic from 'next/dynamic'

import {
  Search,
  FileText,
  ShieldAlert,
  Droplets,
  Activity,
  Beaker,
  AlertTriangle,
  Database,
  MapPin,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Filter,
  HelpCircle,
  ChevronRight,
  Shield,
  Award,
} from 'lucide-react'

// Dynamic client load for Cosmic Parallax Background
const CosmicParallaxBg = dynamic(
  () => import('@/components/ui/parallax-cosmic-background').then((mod) => mod.CosmicParallaxBg),
  {
    ssr: false,
    loading: () => <div className="absolute inset-0 bg-[#030712]" />,
  }
)

export const revalidate = 86400

export const metadata: Metadata = {
  title: `${SITE_NAME} — Check Tap Water Safety by ZIP Code`,
  description: SITE_DESCRIPTION,
  alternates: { canonical: SITE_URL },
}

const POPULAR_CITIES = [
  { city: 'New York', state: 'NY', zip: '10001' },
  { city: 'Los Angeles', state: 'CA', zip: '90001' },
  { city: 'Chicago', state: 'IL', zip: '60601' },
  { city: 'Houston', state: 'TX', zip: '77001' },
  { city: 'Phoenix', state: 'AZ', zip: '85001' },
  { city: 'Philadelphia', state: 'PA', zip: '19101' },
  { city: 'San Antonio', state: 'TX', zip: '78201' },
  { city: 'San Diego', state: 'CA', zip: '92101' },
  { city: 'Dallas', state: 'TX', zip: '75201' },
  { city: 'Jacksonville', state: 'FL', zip: '32099' },
  { city: 'Austin', state: 'TX', zip: '78701' },
  { city: 'Columbus', state: 'OH', zip: '43201' },
  { city: 'Maize', state: 'KS', zip: '67101' },
  { city: 'Franklinton', state: 'NC', zip: '27525' },
  { city: 'Chesterton', state: 'IN', zip: '46304' },
  { city: 'Rockledge', state: 'FL', zip: '32955' },
  { city: 'Greenacres', state: 'FL', zip: '33463' },
  { city: 'Newberry', state: 'MI', zip: '49868' },
  { city: 'Alexander', state: 'NY', zip: '14005' },
  { city: 'Windham', state: 'NH', zip: '03087' },
]

const US_STATES_GRID = [
  ['Alabama','al'],['Alaska','ak'],['Arizona','az'],['Arkansas','ar'],
  ['California','ca'],['Colorado','co'],['Connecticut','ct'],['Delaware','de'],
  ['Florida','fl'],['Georgia','ga'],['Hawaii','hi'],['Idaho','id'],
  ['Illinois','il'],['Indiana','in'],['Iowa','ia'],['Kansas','ks'],
  ['Kentucky','ky'],['Louisiana','la'],['Maine','me'],['Maryland','md'],
  ['Massachusetts','ma'],['Michigan','mi'],['Minnesota','mn'],['Mississippi','ms'],
  ['Missouri','mo'],['Montana','mt'],['Nebraska','ne'],['Nevada','nv'],
  ['New Hampshire','nh'],['New Jersey','nj'],['New Mexico','nm'],['New York','ny'],
  ['North Carolina','nc'],['North Dakota','nd'],['Ohio','oh'],['Oklahoma','ok'],
  ['Oregon','or'],['Pennsylvania','pa'],['Rhode Island','ri'],['South Carolina','sc'],
  ['South Dakota','sd'],['Tennessee','tn'],['Texas','tx'],['Utah','ut'],
  ['Vermont','vt'],['Virginia','va'],['Washington','wa'],['West Virginia','wv'],
  ['Wisconsin','wi'],['Wyoming','wy'],['District of Columbia','dc'],
]

const homeFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How does WaterSafeCheck calculate drinking water safety grades?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'WaterSafeCheck evaluates public utility records from the EPA Safe Drinking Water Information System (SDWIS) over a rolling 5-year monitoring cycle. Our proprietary composite score (0–100) and letter grades (A through F) weight health-based Maximum Contaminant Level (MCL) violations, Lead and Copper Rule 90th percentile samples, public notification delays, and unregulated contaminant screenings (UCMR 5).',
      },
    },
    {
      '@type': 'Question',
      name: 'Does clear tap water mean it is free from contaminants?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. The most dangerous drinking water contaminants — including dissolved lead, arsenic, nitrate, and per- and polyfluoroalkyl substances (PFAS forever chemicals) — are completely odorless, colorless, and tasteless. Water that looks crystal clear can still exceed federal action limits. Regular testing and checking municipal compliance records is the only way to verify safety.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do standard pitcher filters remove lead and PFAS?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most basic pour-through pitcher filters are only certified under NSF/ANSI 42 for aesthetic chlorine taste and odor reduction. They do not reliably eliminate dissolved lead or PFAS unless they hold specific NSF/ANSI 53 (health effects) or NSF/ANSI 58 (reverse osmosis) certifications. Always verify the exact NSF standard on the filter packaging before purchase.',
      },
    },
    {
      '@type': 'Question',
      name: 'Where does WaterSafeCheck source its water quality data?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'All data is aggregated directly from official, publicly accessible U.S. government sources, including the EPA SDWIS database, EPA Enforcement and Compliance History Online (ECHO), mandatory annual Consumer Confidence Reports (CCRs) filed under 40 CFR § 141.151, and federal UCMR 5 PFAS monitoring studies.',
      },
    },
  ],
}

export default async function HomePage() {
  const allStates = await getAllStates()

  const totalZips = 41344
  const stateList = Object.values(allStates)
  const totalViolations = stateList.reduce((s: number, st) => s + st.health_violations, 0)
  const highLeadAvg = stateList.length
    ? Math.round(stateList.reduce((s: number, st) => s + st.high_lead_pct, 0) / stateList.length)
    : 0

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(homeFaqSchema) }}
      />

      {/* ── Apple-Style Hero Section (Cosmic Parallax & Precision Typography) ── */}
      <section className="relative overflow-hidden bg-[#05070e] text-white min-h-[640px] sm:min-h-[720px] flex items-center justify-center">
        <CosmicParallaxBg loop={true} className="z-0 pointer-events-none" />

        {/* Ambient subtle gradient wash */}
        <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-[#05070e]/80 to-transparent z-[1] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-24 sm:pb-32 text-center pointer-events-auto">
          <FadeIn direction="up" priority>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.08] backdrop-blur-xl border border-white/15 text-xs sm:text-[13px] font-medium text-slate-200 mb-8 shadow-apple-glow select-none">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse shadow-[0_0_8px_#38bdf8]" />
              <span>Official EPA SDWIS Records &bull; {new Date().getFullYear()} National Dataset</span>
            </div>
          </FadeIn>

          <FadeIn direction="up" priority>
            <h1 className="text-white text-4xl sm:text-6xl lg:text-7xl font-extrabold mb-6 leading-[1.08] tracking-[-0.035em]">
              Is Your Tap Water<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-200 via-white to-blue-300">
                Safe to Drink?
              </span>
            </h1>
          </FadeIn>

          <FadeIn direction="up" priority>
            <p className="text-base sm:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed font-normal tracking-[-0.015em]">
              Search 41,000+ U.S. ZIP codes for lead levels, EPA compliance records,
              contaminant chemistry, and certified filter recommendations.
            </p>
          </FadeIn>

          <FadeIn direction="up" delay={0.15}>
            <div id="search" className="relative z-10 max-w-3xl mx-auto">
              <HomeSearch />
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs sm:text-[13px] text-slate-300 font-medium">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/[0.06] border border-white/10 backdrop-blur-md">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% Free Public Resource</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/[0.06] border border-white/10 backdrop-blur-md">
                <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                <span>41,000+ ZIPs Covered</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/[0.06] border border-white/10 backdrop-blur-md">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                <span>Direct EPA SDWIS Database</span>
              </span>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Apple Health Summary Island (National Metrics Bento Grid) ── */}
      <section className="relative z-20 -mt-12 sm:-mt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {/* Card 1: Database Size */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-sky-50/70 via-white to-white backdrop-blur-2xl p-4 sm:p-6 border-2 border-sky-400 hover:border-sky-500 shadow-[0_10px_30px_-4px_rgba(14,165,233,0.22)] hover:shadow-[0_18px_40px_-4px_rgba(14,165,233,0.35)] transition-all duration-300 group">
            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-500" />
            <div className="flex items-center justify-between mb-2.5 sm:mb-3">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-sky-700">Database Size</span>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-2xl bg-sky-500 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-md shadow-sky-500/30">
                <Database className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>
            <p className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">{totalZips.toLocaleString()}+</p>
            <p className="text-[11px] sm:text-sm text-slate-600 mt-1 font-medium truncate">U.S. ZIP Codes Monitored</p>
          </div>

          {/* Card 2: Territories */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-blue-50/70 via-white to-white backdrop-blur-2xl p-4 sm:p-6 border-2 border-blue-400 hover:border-blue-500 shadow-[0_10px_30px_-4px_rgba(59,130,246,0.22)] hover:shadow-[0_18px_40px_-4px_rgba(59,130,246,0.35)] transition-all duration-300 group">
            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500" />
            <div className="flex items-center justify-between mb-2.5 sm:mb-3">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-blue-700">Territories</span>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-2xl bg-blue-500 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-md shadow-blue-500/30">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>
            <p className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">50 States + DC</p>
            <p className="text-[11px] sm:text-sm text-slate-600 mt-1 font-medium truncate">Complete National Reach</p>
          </div>

          {/* Card 3: Health Violations */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-amber-50/70 via-white to-white backdrop-blur-2xl p-4 sm:p-6 border-2 border-amber-400 hover:border-amber-500 shadow-[0_10px_30px_-4px_rgba(245,158,11,0.22)] hover:shadow-[0_18px_40px_-4px_rgba(245,158,11,0.35)] transition-all duration-300 group">
            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-amber-400 via-orange-500 to-yellow-400" />
            <div className="flex items-center justify-between mb-2.5 sm:mb-3">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-amber-700">Violations</span>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-md shadow-amber-500/30">
                <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>
            <p className="text-2xl sm:text-4xl font-extrabold text-amber-600 tracking-tight">{(totalViolations / 1000).toFixed(0)}K+</p>
            <p className="text-[11px] sm:text-sm text-slate-600 mt-1 font-medium truncate">Documented Past Violations</p>
          </div>

          {/* Card 4: Lead Vulnerability */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-rose-50/70 via-white to-white backdrop-blur-2xl p-4 sm:p-6 border-2 border-rose-400 hover:border-rose-500 shadow-[0_10px_30px_-4px_rgba(244,63,94,0.22)] hover:shadow-[0_18px_40px_-4px_rgba(244,63,94,0.35)] transition-all duration-300 group">
            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-rose-500 via-red-500 to-pink-500" />
            <div className="flex items-center justify-between mb-2.5 sm:mb-3">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-rose-700">Lead Risk</span>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-md shadow-rose-500/30">
                <ShieldAlert className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>
            <p className="text-2xl sm:text-4xl font-extrabold text-rose-600 tracking-tight">{highLeadAvg}%</p>
            <p className="text-[11px] sm:text-sm text-slate-600 mt-1 font-medium truncate">Elevated Lead Risk Areas</p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Ad 1: Top High-Visibility Display Ad */}
        <DisplayAd className="my-6" />

        {/* ── Apple 3-Step Feature Process ── */}
        <section className="mb-16">
          <FadeIn>
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-apple-blue bg-apple-blue/10 mb-3">
                <Sparkles className="w-3.5 h-3.5" /> Instant & Verifiable
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
                How WaterSafeCheck Works
              </h2>
              <p className="text-slate-500 text-base sm:text-lg leading-relaxed">
                We translate dense municipal EPA compliance logs into clear, actionable health grades for your home.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                step: '01',
                icon: <Search className="w-6 h-6 text-white" />,
                title: 'Enter Any U.S. ZIP Code',
                desc: 'Type your 5-digit ZIP code to pull records for the municipal utility that supplies water to your tap.',
                borderColor: 'border-2 border-sky-400 hover:border-sky-500',
                topBar: 'bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-500',
                cardBg: 'bg-gradient-to-b from-sky-50/70 via-white to-white',
                iconBg: 'bg-sky-500 text-white shadow-md shadow-sky-500/30',
                badgeColor: 'text-sky-800 bg-sky-100 border border-sky-300 font-bold',
                shadowColor: 'shadow-[0_10px_30px_-6px_rgba(14,165,233,0.22)] hover:shadow-[0_18px_40px_-6px_rgba(14,165,233,0.35)]',
              },
              {
                step: '02',
                icon: <FileText className="w-6 h-6 text-white" />,
                title: 'Instant Water Safety Grade',
                desc: 'Review your composite health score (A to F), 90th percentile lead samples, and violation history.',
                borderColor: 'border-2 border-indigo-400 hover:border-indigo-500',
                topBar: 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500',
                cardBg: 'bg-gradient-to-b from-indigo-50/70 via-white to-white',
                iconBg: 'bg-indigo-500 text-white shadow-md shadow-indigo-500/30',
                badgeColor: 'text-indigo-800 bg-indigo-100 border border-indigo-300 font-bold',
                shadowColor: 'shadow-[0_10px_30px_-6px_rgba(99,102,241,0.22)] hover:shadow-[0_18px_40px_-6px_rgba(99,102,241,0.35)]',
              },
              {
                step: '03',
                icon: <ShieldCheck className="w-6 h-6 text-white" />,
                title: 'Certified Filter Solutions',
                desc: 'Find filters verified under NSF 53 or NSF 58 to eliminate the specific contaminants found in your supply.',
                borderColor: 'border-2 border-emerald-400 hover:border-emerald-500',
                topBar: 'bg-gradient-to-r from-emerald-400 via-teal-500 to-green-500',
                cardBg: 'bg-gradient-to-b from-emerald-50/70 via-white to-white',
                iconBg: 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30',
                badgeColor: 'text-emerald-800 bg-emerald-100 border border-emerald-300 font-bold',
                shadowColor: 'shadow-[0_10px_30px_-6px_rgba(16,185,129,0.22)] hover:shadow-[0_18px_40px_-6px_rgba(16,185,129,0.35)]',
              },
            ].map((item, index) => (
              <FadeIn key={item.step} delay={index * 0.1}>
                <div className={`h-full p-7 sm:p-8 rounded-3xl ${item.cardBg} backdrop-blur-2xl ${item.borderColor} ${item.shadowColor} transition-all duration-300 flex flex-col group relative overflow-hidden`}>
                  <div className={`absolute top-0 inset-x-0 h-2 ${item.topBar}`} />
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-12 h-12 rounded-2xl ${item.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs`}>
                      {item.icon}
                    </div>
                    <span className={`text-xs font-bold tracking-wider px-3.5 py-1 rounded-full ${item.badgeColor}`}>
                      Step {item.step}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2 tracking-tight">{item.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed flex-1">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* Ad 2: Mid-Page High-CTR Display Ad */}
        <DisplayAd className="my-12" />

        {/* ── Interactive Water Filter Quiz Teaser ── */}
        <section className="mb-20">
          <FadeIn>
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-[#0d1322] to-slate-950 text-white p-8 sm:p-12 shadow-2xl border border-white/10">
              <div className="absolute top-0 right-0 w-96 h-96 bg-apple-blue/15 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-apple-blue/20 text-sky-300 border border-apple-blue/30 text-xs font-semibold uppercase tracking-wider mb-4">
                    <Filter className="w-3.5 h-3.5" /> Interactive Filter Recommendation Tool
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
                    Not Sure Which Water Filter Actually Removes Your Contaminants?
                  </h3>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                    Take our 60-second assessment. Match your home plumbing, budget, and local EPA contaminants to verified NSF-53 and NSF-58 systems.
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <Link
                    href="/water-quality-guide"
                    className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm shadow-lg active:scale-95 transition-all whitespace-nowrap"
                  >
                    <span>Explore Water Filter Guide</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </FadeIn>
        </section>

        {/* ── Why Water Quality Matters (Apple Health Style Contaminant Bento) ── */}
        <section className="mb-20">
          <FadeIn>
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-rose-600 bg-rose-50 mb-3">
                <AlertTriangle className="w-3.5 h-3.5" /> Health & Protection
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
                Why Check Your Tap Water?
              </h2>
              <p className="text-slate-500 text-base sm:text-lg leading-relaxed">
                Even crystal clear water can harbor tasteless, odorless chemical compounds that exceed health guidelines.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Contaminant 1: Lead */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-amber-50/70 via-white to-white backdrop-blur-2xl p-6 flex flex-col border-2 border-amber-400 hover:border-amber-500 shadow-[0_10px_30px_-6px_rgba(245,158,11,0.20)] hover:shadow-[0_18px_40px_-4px_rgba(245,158,11,0.32)] transition-all duration-300 group">
              <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500" />
              <div className="w-11 h-11 rounded-2xl bg-amber-500 text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md shadow-amber-500/30">
                <Droplets className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-slate-900 text-base">Lead Leaching</h4>
                <span className="text-[10px] font-bold uppercase bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 rounded-full">0 ppb Goal</span>
              </div>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed flex-1">
                The EPA estimates 10–20% of human lead exposure comes from drinking water. Lead has zero safe threshold for young children.
              </p>
            </div>

            {/* Contaminant 2: PFAS */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-sky-50/70 via-white to-white backdrop-blur-2xl p-6 flex flex-col border-2 border-sky-400 hover:border-sky-500 shadow-[0_10px_30px_-6px_rgba(14,165,233,0.20)] hover:shadow-[0_18px_40px_-4px_rgba(14,165,233,0.32)] transition-all duration-300 group">
              <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-sky-400 via-blue-500 to-cyan-400" />
              <div className="w-11 h-11 rounded-2xl bg-sky-500 text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md shadow-sky-500/30">
                <Beaker className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-slate-900 text-base">PFAS Chemicals</h4>
                <span className="text-[10px] font-bold uppercase bg-sky-100 text-sky-800 border border-sky-300 px-2 py-0.5 rounded-full">4 ppt Limit</span>
              </div>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed flex-1">
                &ldquo;Forever chemicals&rdquo; persist indefinitely in human tissue. The EPA has established legally enforceable limits for 5 PFAS compounds.
              </p>
            </div>

            {/* Contaminant 3: Disinfection */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-indigo-50/70 via-white to-white backdrop-blur-2xl p-6 flex flex-col border-2 border-indigo-400 hover:border-indigo-500 shadow-[0_10px_30px_-6px_rgba(99,102,241,0.20)] hover:shadow-[0_18px_40px_-4px_rgba(99,102,241,0.32)] transition-all duration-300 group">
              <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500" />
              <div className="w-11 h-11 rounded-2xl bg-indigo-500 text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md shadow-indigo-500/30">
                <Activity className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-slate-900 text-base">Disinfection Byproducts</h4>
                <span className="text-[10px] font-bold uppercase bg-indigo-100 text-indigo-800 border border-indigo-300 px-2 py-0.5 rounded-full">TTHMs</span>
              </div>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed flex-1">
                Chemicals created when disinfectant chlorine reacts with naturally occurring organic matter in reservoirs and rivers.
              </p>
            </div>

            {/* Contaminant 4: Aging Pipes */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-rose-50/70 via-white to-white backdrop-blur-2xl p-6 flex flex-col border-2 border-rose-400 hover:border-rose-500 shadow-[0_10px_30px_-6px_rgba(244,63,94,0.20)] hover:shadow-[0_18px_40px_-4px_rgba(244,63,94,0.32)] transition-all duration-300 group">
              <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-rose-500 via-red-500 to-pink-500" />
              <div className="w-11 h-11 rounded-2xl bg-rose-500 text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md shadow-rose-500/30">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-slate-900 text-base">Aging Pipes</h4>
                <span className="text-[10px] font-bold uppercase bg-rose-100 text-rose-800 border border-rose-300 px-2 py-0.5 rounded-full">9.2M Lines</span>
              </div>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed flex-1">
                Over 9 million legacy lead service pipes remain in service nationwide, gradually being replaced over multi-decade schedules.
              </p>
            </div>
          </div>
        </section>

        {/* Ad 3: In-Content Editorial Ad (After Contaminants) */}
        <InArticleAd className="my-12 max-w-4xl mx-auto" />

        {/* ── Trending Water Quality Reports ── */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Trending Water Quality Reports</h2>
              </div>
              <p className="text-sm text-slate-500">Frequently searched municipal utilities and active compliance checks</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            {[
              { zip: '65041', name: 'Holts Summit, MO', note: 'EPA SDWIS Report', grade: 'B' },
              { zip: '04064', name: 'Old Orchard Beach, ME', note: 'Water Quality Analysis', grade: 'A' },
              { zip: '90210', name: 'Beverly Hills, CA', note: 'Safety Grade & Lead', grade: 'B' },
              { zip: '10001', name: 'New York, NY', note: 'Fluoride & Hardness', grade: 'B' },
            ].map(item => (
              <Link
                key={item.zip}
                href={`/zip/${item.zip}`}
                className="card p-4 hover:border-apple-blue/40 shadow-xs hover:shadow-apple-card transition-all active:scale-[0.98] group block"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono font-bold text-slate-900 text-base group-hover:text-apple-blue transition-colors">
                    ZIP {item.zip}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    Grade {item.grade}
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-700 truncate">
                  {item.name}
                </p>
                <p className="text-[11px] text-apple-blue mt-2 font-medium flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  View report &rarr;
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Popular City Water Reports ── */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-1 tracking-tight">Popular Metropolitan Areas</h2>
              <p className="text-sm text-slate-500">Explore tap water quality data across major U.S. cities</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {POPULAR_CITIES.map(({ city, state, zip }) => (
              <Link
                key={zip}
                href={`/city/${city.toLowerCase().replace(/\s+/g, '-')}-${state.toLowerCase()}`}
                className="card p-3.5 hover:border-apple-blue/30 transition-all active:scale-[0.98] group block"
              >
                <p className="font-semibold text-sm text-slate-800 group-hover:text-apple-blue transition-colors truncate">
                  {city}, {state}
                </p>
                <p className="text-xs text-slate-400 mt-1 flex items-center justify-between">
                  <span>ZIP {zip}</span>
                  <span className="text-apple-blue font-medium group-hover:translate-x-0.5 transition-transform">View &rarr;</span>
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Ad 4: Directory Break Display Ad */}
        <DisplayAd className="my-12" />

        {/* ── Browse Water Quality by State ── */}
        <section id="states" className="mb-16">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-1 tracking-tight">Browse Water Quality by State</h2>
            <p className="text-sm text-slate-500">Statewide compliance data, average water safety scores, and city directories</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-2.5">
            {US_STATES_GRID.map(([name, code]) => {
              const st = allStates[code.toUpperCase()]
              return (
                <Link
                  key={code}
                  href={`/state/${code}`}
                  className="card p-3 flex items-center justify-between hover:border-apple-blue/30 active:scale-[0.98] transition-all group"
                >
                  <span className="text-xs sm:text-sm text-slate-700 group-hover:text-apple-blue font-medium truncate">{name}</span>
                  {st && (
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ml-1.5 flex-shrink-0 ${
                      st.avg_score && st.avg_score >= 75 ? 'text-emerald-700 bg-emerald-50 border border-emerald-200/60' :
                      st.avg_score && st.avg_score >= 60 ? 'text-apple-blue bg-blue-50 border border-blue-200/60' :
                      'text-amber-700 bg-amber-50 border border-amber-200/60'
                    }`}>
                      {st.avg_score ? `${st.avg_score}` : '—'}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        </section>

        {/* ── Latest Water Safety Articles ── */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-1 tracking-tight">Water Safety Research & Guides</h2>
              <p className="text-sm text-slate-500">Expert research on tap contaminants, water filters, and EPA standards</p>
            </div>
            <Link href="/blog" className="text-sm text-apple-blue font-semibold hidden sm:flex items-center gap-1 hover:underline">
              <span>View all articles</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogArticles.slice(0, 6).map(article => (
              <Link key={article.slug} href={`/blog/${article.slug}`} className="card p-6 hover:shadow-apple-card-hover transition-all flex flex-col group active:scale-[0.98]">
                <div className="flex items-center justify-between mb-3">
                  <span className="badge text-xs bg-slate-100 text-slate-700 font-semibold">
                    {article.category}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">{article.readTime}</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-apple-blue transition-colors leading-snug mb-2 line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed line-clamp-3 mb-4 flex-1">
                  {article.intro}
                </p>
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-500">Sahajul Haque</span>
                  <span className="font-semibold text-apple-blue flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Read article &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Ad 5: High-Intent Pre-FAQ Display Ad */}
        <DisplayAd className="my-12" />

        {/* ── Apple-Style FAQ Accordion ── */}
        <section className="mb-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-apple-blue bg-apple-blue/10 mb-3">
              <HelpCircle className="w-3.5 h-3.5" /> Consumer Knowledge
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-500 text-sm sm:text-base">
              Clear, science-backed answers regarding drinking water compliance, lead hazards, and filtration.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {[
              {
                q: 'How does WaterSafeCheck calculate drinking water safety grades?',
                a: 'WaterSafeCheck evaluates public utility records from the EPA Safe Drinking Water Information System (SDWIS) over a rolling 5-year monitoring cycle. Our composite score (0–100) and letter grades (A through F) weight health-based Maximum Contaminant Level (MCL) violations, Lead and Copper Rule 90th percentile samples, public notification delays, and unregulated contaminant screenings (UCMR 5).',
              },
              {
                q: 'Does clear tap water mean it is free from contaminants?',
                a: 'No. The most dangerous drinking water contaminants — including dissolved lead, arsenic, nitrate, and per- and polyfluoroalkyl substances (PFAS &quot;forever chemicals&quot;) — are completely odorless, colorless, and tasteless. Water that looks crystal clear can still exceed federal action limits. Regular testing and checking municipal compliance records is the only way to verify safety.',
              },
              {
                q: 'Do standard pitcher filters remove lead and PFAS?',
                a: 'Most basic pour-through pitcher filters are only certified under NSF/ANSI 42 for aesthetic chlorine taste and odor reduction. They do <strong>not</strong> reliably eliminate dissolved lead or PFAS unless they hold specific NSF/ANSI 53 (health effects) or NSF/ANSI 58 (reverse osmosis) certifications. Always verify the exact NSF standard on the filter packaging before purchase.',
              },
              {
                q: 'Where does WaterSafeCheck source its water quality data?',
                a: 'All data is aggregated directly from official, publicly accessible U.S. government sources, including the EPA SDWIS database, EPA Enforcement and Compliance History Online (ECHO), mandatory annual Consumer Confidence Reports (CCRs) filed under 40 CFR § 141.151, and federal UCMR 5 PFAS monitoring studies.',
              },
            ].map((faq, i) => (
              <details
                key={faq.q}
                className="group card p-5 sm:p-6 transition-all open:border-apple-blue/30"
                open={i === 0}
              >
                <summary className="flex items-center justify-between cursor-pointer font-bold text-slate-900 text-base sm:text-lg select-none list-none">
                  <span className="pr-4">{faq.q}</span>
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm transition-transform duration-200 group-open:rotate-45 group-open:bg-apple-blue/10 group-open:text-apple-blue">
                    +
                  </span>
                </summary>
                <div
                  className="mt-4 pt-3 border-t border-slate-100 text-slate-600 text-sm sm:text-base leading-relaxed prose-custom"
                  dangerouslySetInnerHTML={{ __html: faq.a }}
                />
              </details>
            ))}
          </div>
        </section>

        {/* Ad 6: Bottom Native Multiplex Recommendations Grid */}
        <MultiplexAd className="my-14" />

        {/* ── Author / Founder E-E-A-T Signature Box ── */}
        <section className="card p-6 sm:p-10 mb-8 border border-slate-200/90 shadow-apple-card">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
            <div className="relative flex-shrink-0 mx-auto md:mx-0">
              <Image
                src="/images/sahajul-haque.jpg"
                alt="Sahajul Haque — Founder & Lead Platform Architect"
                width={112}
                height={112}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-white shadow-md"
              />
              <span className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1 rounded-full shadow-md" title="Verified Creator & Platform Architect">
                <ShieldCheck className="w-4 h-4" />
              </span>
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div>
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                      Sahajul Haque
                    </h3>
                    <span className="badge text-[10px] font-bold bg-sky-100 text-apple-blue">
                      Founder
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-apple-blue mt-0.5">
                    Founder &amp; Lead Platform Architect &bull; Assam, India
                  </p>
                </div>

                <Link
                  href="/about"
                  className="btn-secondary !py-2 !px-4 text-xs font-semibold self-center md:self-auto"
                >
                  <span>About the Founder</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                Sahajul Haque engineered WaterSafeCheck to solve a fundamental public health challenge: transforming over 41,000 fragmented, complex U.S. EPA compliance records into instant, plain-English drinking water safety reports. Driven by open-data transparency, he independently maintains WaterSafeCheck as a 100% free public service for American families.
              </p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 pt-3 border-t border-slate-100">
                <a
                  href="https://github.com/sahajulhaque196-dot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full transition-colors"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
                  <span>GitHub</span>
                </a>
                <a
                  href="https://x.com/saddamh58509953"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-full transition-colors"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  <span>Twitter / X</span>
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-apple-blue hover:underline px-3 py-1.5"
                >
                  <span>Contact Sahajul &rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
