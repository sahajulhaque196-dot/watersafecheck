// src/app/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllStates } from '@/lib/data'
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/seo'
import { HomeSearch } from '@/components/sections/HomeSearch'
import { blogArticles } from '@/data/blog-articles'
import { AdTop, AdInContent } from '@/components/ui/AdSense'
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
} from 'lucide-react'

// Dynamic client load for Cosmic Parallax Background (pure starfield & earth horizon)
const CosmicParallaxBg = dynamic(
  () => import('@/components/ui/parallax-cosmic-background').then((mod) => mod.CosmicParallaxBg),
  {
    ssr: false,
    loading: () => <div className="absolute inset-0 bg-[#030712]" />,
  }
)

export const runtime = 'edge'
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
  // High-demand GSC impression earners
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

export default async function HomePage() {
  const allStates = await getAllStates()

  // National stats pre-computed from master EPA dataset
  const totalZips = 41344
  const stateList = Object.values(allStates)
  const totalViolations = stateList.reduce((s: number, st) => s + st.health_violations, 0)
  const highLeadAvg = stateList.length
    ? Math.round(stateList.reduce((s: number, st) => s + st.high_lead_pct, 0) / stateList.length)
    : 0

  return (
    <>
      {/* ── Hero Section (Pure Cosmic Parallax Starfield & Earth Horizon) ── */}
      <section className="relative overflow-hidden bg-[#030712] text-white min-h-[660px] sm:min-h-[720px] flex items-center justify-center">
        {/* Exact Cosmic Parallax Starfield & Glowing Earth Horizon — No washing gradient */}
        <CosmicParallaxBg loop={true} className="z-0 pointer-events-none" />

        {/* Soft top gradient for header clarity only */}
        <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-black/40 to-transparent z-[1] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 pb-28 sm:pb-36 text-center pointer-events-auto">
          <FadeIn direction="up" priority>
            <div className="inline-flex items-center gap-2.5 bg-slate-900/80 backdrop-blur-md border border-cyan-500/30 rounded-full px-5 py-2 text-xs sm:text-sm font-semibold mb-8 shadow-[0_0_24px_rgba(6,182,212,0.25)] text-cyan-200">
              <span className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,211,238,0.9)]" />
              Official EPA SDWIS Database &bull; Updated {new Date().getFullYear()} Records
            </div>
          </FadeIn>

          <FadeIn direction="up" priority>
            <h1 className="text-white text-4xl sm:text-6xl lg:text-7xl font-black mb-6 leading-tight tracking-tight drop-shadow-2xl">
              Is Your Tap Water<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-blue-400 drop-shadow-[0_2px_14px_rgba(34,211,238,0.5)]">
                Safe to Drink?
              </span>
            </h1>
          </FadeIn>

          <FadeIn direction="up" priority>
            <p className="text-base sm:text-xl text-slate-200 mb-10 max-w-2xl mx-auto leading-relaxed drop-shadow-md">
              Search 41,000+ U.S. ZIP codes for lead levels, water quality grades,
              EPA violations, and contaminant data — 100% free and independent.
            </p>
          </FadeIn>

          <FadeIn direction="up" delay={0.2}>
            <div className="relative z-10 max-w-3xl mx-auto">
              <HomeSearch />
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm text-slate-300 font-medium">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/70 border border-white/10 backdrop-blur-md">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Free Forever
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/70 border border-white/10 backdrop-blur-md">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> 41,000+ ZIPs Covered
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/70 border border-white/10 backdrop-blur-md">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" /> Official EPA Data
              </span>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── National Stats (Clean Elevated Island) ── */}
      <section className="relative z-20 -mt-10 sm:-mt-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Database Size</span>
              <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Database className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">{totalZips.toLocaleString()}+</p>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">U.S. ZIP Codes Covered</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Nationwide Reach</span>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <MapPin className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">50 States + DC</p>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">All 50 States & Territories</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">EPA Compliance</span>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl sm:text-4xl font-black text-amber-600 tracking-tight">{(totalViolations / 1000).toFixed(0)}K+</p>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">Health Violations Documented</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Water Safety Risk</span>
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ShieldAlert className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl sm:text-4xl font-black text-rose-600 tracking-tight">{highLeadAvg}%</p>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">High Lead Risk ZIPs</p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <AdTop />

        {/* ── How It Works (Fresh Rebuilt 3-Step Process) ── */}
        <section className="mb-20">
          <FadeIn>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-cyan-700 bg-cyan-50 border border-cyan-200 mb-3">
                <Sparkles className="w-3.5 h-3.5 text-cyan-500" /> Transparent & Fast
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-3">
                How WaterSafeCheck Works
              </h2>
              <p className="text-slate-500 text-base sm:text-lg">
                Official EPA compliance data transformed into instant, plain-English drinking water grades for your household.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                step: 'Step 01',
                icon: <Search className="w-7 h-7 text-cyan-600" />,
                title: 'Enter Any US ZIP Code',
                desc: 'Type your 5-digit ZIP code or city name to immediately query local municipal utility compliance records.',
                bg: 'bg-cyan-50',
                border: 'border-cyan-100',
              },
              {
                step: 'Step 02',
                icon: <FileText className="w-7 h-7 text-blue-600" />,
                title: 'Instant EPA Health Grade',
                desc: 'See your water safety rating (A through F), lead levels in ppb, recent violations, and detected contaminants.',
                bg: 'bg-blue-50',
                border: 'border-blue-100',
              },
              {
                step: 'Step 03',
                icon: <ShieldCheck className="w-7 h-7 text-emerald-600" />,
                title: 'Tailored Filter Guidance',
                desc: 'Find NSF-53, NSF-58, and carbon filters certified to remove the specific chemical contaminants found in your tap.',
                bg: 'bg-emerald-50',
                border: 'border-emerald-100',
              },
            ].map((item, index) => (
              <FadeIn key={item.step} delay={index * 0.15}>
                <div className="h-full bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group relative overflow-hidden">
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-14 h-14 rounded-2xl ${item.bg} flex items-center justify-center border ${item.border} group-hover:scale-110 transition-transform duration-300`}>
                      {item.icon}
                    </div>
                    <span className="text-xs font-black uppercase tracking-wider text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-600 leading-relaxed text-sm sm:text-base flex-1">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* ── Interactive Water Filter Quiz Callout ── */}
        <section className="mb-20">
          <FadeIn>
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-8 sm:p-12 shadow-2xl border border-slate-700/60">
              <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold uppercase tracking-wider mb-4">
                    <Filter className="w-3.5 h-3.5" /> Interactive Filter Recommendation Tool
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-3">
                    Not Sure Which Water Filter Actually Removes Your Contaminants?
                  </h3>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                    Take our 60-second Water Filter Recommendation Quiz. Match your home plumbing, budget, and local EPA contaminants to certified NSF-53 and NSF-58 filters.
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <Link
                    href="/water-quality-guide"
                    className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-base shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all duration-300 whitespace-nowrap"
                  >
                    Explore Water Filter Guide <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          </FadeIn>
        </section>

        {/* ── Why Water Quality Matters (Fresh Rebuilt Contaminant Grid) ── */}
        <section className="mb-20">
          <FadeIn>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 border border-rose-200 mb-3">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-500" /> Health & Protection
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-3">
                Why Check Your Tap Water?
              </h2>
              <p className="text-slate-500 text-base sm:text-lg">
                Even water that looks clear can carry invisible chemical contaminants that exceed independent health guidelines.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-all flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                <Droplets className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-bold text-slate-900 text-lg">Lead Contamination</h4>
                <span className="text-[10px] font-bold uppercase bg-amber-100 text-amber-800 px-2 py-0.5 rounded">0 ppb Goal</span>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed flex-1">
                The EPA estimates 10–20% of human lead exposure comes from tap water. Lead has no safe exposure level for children and causes irreversible neurological damage.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-all flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-4">
                <Beaker className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-bold text-slate-900 text-lg">PFAS Chemicals</h4>
                <span className="text-[10px] font-bold uppercase bg-cyan-100 text-cyan-800 px-2 py-0.5 rounded">4 ppt Limit</span>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed flex-1">
                "Forever chemicals" bioaccumulate in human blood and tissues. In 2024, the EPA finalized legally enforceable national limits for 5 individual PFAS compounds.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-all flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <Activity className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-bold text-slate-900 text-lg">Disinfection Byproducts</h4>
                <span className="text-[10px] font-bold uppercase bg-blue-100 text-blue-800 px-2 py-0.5 rounded">TTHMs / HAA5</span>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed flex-1">
                Formed when chlorine disinfectant reacts with natural organic matter. Chronic exposure to elevated TTHMs is linked to bladder and colorectal health risks.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-all flex flex-col">
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-bold text-slate-900 text-lg">Aging Infrastructure</h4>
                <span className="text-[10px] font-bold uppercase bg-rose-100 text-rose-800 px-2 py-0.5 rounded">9.2M Pipes</span>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed flex-1">
                Over 9 million lead service lines still connect American homes to city mains. Utilities are replacing them, but complete remediation will take decades.
              </p>
            </div>
          </div>
        </section>

        <AdInContent />

        {/* ── Trending Water Quality Reports (GSC High Demand) ── */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h2 className="text-2xl font-bold text-slate-900">Trending Water Quality Reports</h2>
              </div>
              <p className="text-sm text-slate-500">Frequently searched municipal utilities and active compliance checks</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {[
              { zip: '65041', name: 'Holts Summit, MO', note: 'EPA SDWIS Report', grade: 'B' },
              { zip: '04064', name: 'Old Orchard Beach, ME', note: 'Water Quality Analysis', grade: 'A' },
              { zip: '90210', name: 'Beverly Hills, CA', note: 'Safety Grade & Lead', grade: 'B' },
              { zip: '10001', name: 'New York, NY', note: 'Fluoride & Hardness', grade: 'B' },
            ].map(item => (
              <Link
                key={item.zip}
                href={`/zip/${item.zip}`}
                className="group block bg-white border border-slate-200/80 hover:border-cyan-400 p-4 rounded-xl shadow-xs hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-black text-slate-900 text-base group-hover:text-cyan-600 transition-colors">
                    ZIP {item.zip}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    Grade {item.grade}
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-700 truncate">
                  {item.name}
                </p>
                <p className="text-[11px] text-cyan-600 mt-2 font-medium flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  View report <ArrowRight className="w-3 h-3" />
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Popular City Water Reports ── */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-1">Popular City Water Quality Reports</h2>
              <p className="text-sm text-slate-500">Explore tap water quality data across major U.S. metropolitan areas</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {POPULAR_CITIES.map(({ city, state, zip }) => (
              <Link
                key={zip}
                href={`/city/${city.toLowerCase().replace(/\s+/g, '-')}-${state.toLowerCase()}`}
                className="group block bg-white border border-slate-200/80 hover:border-blue-400 p-3.5 rounded-xl shadow-xs hover:shadow-md transition-all"
              >
                <p className="font-semibold text-sm text-slate-800 group-hover:text-blue-600 transition-colors">
                  {city}, {state}
                </p>
                <p className="text-xs text-slate-400 mt-0.5 flex items-center justify-between">
                  <span>ZIP {zip}</span>
                  <span className="text-blue-600 font-medium group-hover:translate-x-0.5 transition-transform">View →</span>
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Browse Water Quality by State ── */}
        <section className="mb-16">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-1">Browse Water Quality by State</h2>
            <p className="text-sm text-slate-500">Statewide compliance data, average water safety scores, and city directories</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-2.5">
            {US_STATES_GRID.map(([name, code]) => {
              const st = allStates[code.toUpperCase()]
              return (
                <Link
                  key={code}
                  href={`/state/${code}`}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl border border-slate-200/80 bg-white hover:border-cyan-300 hover:bg-cyan-50/50 transition-all group"
                >
                  <span className="text-xs sm:text-sm text-slate-700 group-hover:text-cyan-700 font-medium truncate">{name}</span>
                  {st && (
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ml-1.5 flex-shrink-0 ${
                      st.avg_score && st.avg_score >= 75 ? 'text-emerald-700 bg-emerald-50 border border-emerald-200' :
                      st.avg_score && st.avg_score >= 60 ? 'text-blue-700 bg-blue-50 border border-blue-200' :
                      'text-amber-700 bg-amber-50 border border-amber-200'
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
              <h2 className="text-2xl font-bold text-slate-900 mb-1">Water Safety Editorial & Guides</h2>
              <p className="text-sm text-slate-500">Expert research on tap contaminants, water filters, and EPA drinking standards</p>
            </div>
            <Link href="/blog" className="text-sm text-cyan-600 hover:text-cyan-700 font-semibold hidden sm:flex items-center gap-1">
              View all articles <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogArticles.slice(0, 6).map(article => (
              <Link key={article.slug} href={`/blog/${article.slug}`} className="group block bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-700 bg-cyan-50 px-2.5 py-1 rounded-full border border-cyan-100">
                    {article.category}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">{article.readTime}</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-cyan-600 transition-colors leading-snug mb-2 line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed line-clamp-3 mb-4 flex-1">
                  {article.intro}
                </p>
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-500">Sahajul Haque</span>
                  <span className="text-xs font-bold text-cyan-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Read article →
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-6 text-center sm:hidden">
            <Link href="/blog" className="inline-flex items-center gap-1 text-sm text-cyan-600 font-semibold">
              View all articles <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        
        {/* ── Homepage Drinking Water Safety FAQs (E-E-A-T & AdSense Quality) ── */}
        <section className="mb-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200 mb-3">
              <HelpCircle className="w-3.5 h-3.5 text-blue-500" /> Consumer Knowledge
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2">
              Frequently Asked Questions About U.S. Tap Water
            </h2>
            <p className="text-slate-500 text-sm sm:text-base">
              Clear, science-backed answers to the most common questions regarding municipal drinking water compliance, lead hazards, and filtration.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            <details className="group bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs transition-all [&_summary::-webkit-details-marker]:hidden" open>
              <summary className="flex items-center justify-between cursor-pointer font-bold text-slate-900 text-base sm:text-lg">
                <span>How does WaterSafeCheck calculate drinking water safety grades?</span>
                <span className="ml-4 flex-shrink-0 text-cyan-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-4 pt-3 border-t border-slate-100 text-slate-600 text-sm sm:text-base leading-relaxed">
                WaterSafeCheck evaluates public utility records from the EPA Safe Drinking Water Information System (SDWIS) over a rolling 5-year monitoring cycle. Our proprietary composite score (0–100) and letter grades (A through F) weight health-based Maximum Contaminant Level (MCL) violations, Lead and Copper Rule 90th percentile samples, public notification delays, and unregulated contaminant screenings (UCMR 5).
              </div>
            </details>

            <details className="group bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs transition-all [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between cursor-pointer font-bold text-slate-900 text-base sm:text-lg">
                <span>Does clear tap water mean it is free from contaminants?</span>
                <span className="ml-4 flex-shrink-0 text-cyan-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-4 pt-3 border-t border-slate-100 text-slate-600 text-sm sm:text-base leading-relaxed">
                No. The most dangerous drinking water contaminants — including dissolved lead, arsenic, nitrate, and per- and polyfluoroalkyl substances (PFAS &quot;forever chemicals&quot;) — are completely odorless, colorless, and tasteless. Water that looks crystal clear can still exceed federal action limits. Regular testing and checking municipal compliance records is the only way to verify safety.
              </div>
            </details>

            <details className="group bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs transition-all [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between cursor-pointer font-bold text-slate-900 text-base sm:text-lg">
                <span>Do standard pitcher filters remove lead and PFAS?</span>
                <span className="ml-4 flex-shrink-0 text-cyan-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-4 pt-3 border-t border-slate-100 text-slate-600 text-sm sm:text-base leading-relaxed">
                Most basic pour-through pitcher filters are only certified under NSF/ANSI 42 for aesthetic chlorine taste and odor reduction. They do <strong>not</strong> reliably eliminate dissolved lead or PFAS unless they hold specific NSF/ANSI 53 (health effects) or NSF/ANSI 58 (reverse osmosis) certifications. Always verify the exact NSF standard on the filter packaging before purchase.
              </div>
            </details>

            <details className="group bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs transition-all [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between cursor-pointer font-bold text-slate-900 text-base sm:text-lg">
                <span>Where does WaterSafeCheck source its water quality data?</span>
                <span className="ml-4 flex-shrink-0 text-cyan-600 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="mt-4 pt-3 border-t border-slate-100 text-slate-600 text-sm sm:text-base leading-relaxed">
                All data is aggregated directly from official, publicly accessible U.S. government sources, including the EPA SDWIS database, EPA Enforcement and Compliance History Online (ECHO), mandatory annual Consumer Confidence Reports (CCRs) filed under 40 CFR § 141.151, and federal UCMR 5 PFAS monitoring studies.
              </div>
            </details>
          </div>
        </section>
        {/* ── Trusted Data Sources (E-E-A-T Transparency) ── */}
        <section className="bg-slate-50 rounded-3xl p-8 sm:p-12 mb-8 border border-slate-200/60">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-2">
              Authoritative Federal Data Sources
            </h2>
            <p className="text-slate-500 text-sm">
              WaterSafeCheck compiles official U.S. government monitoring databases to give you verifiable water quality data.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-xs">
              <span className="text-3xl block mb-2">🏛</span>
              <p className="font-bold text-slate-900 mb-1">EPA SDWIS Database</p>
              <p className="text-xs text-slate-500 leading-relaxed">
                Safe Drinking Water Information System — the official regulatory tracking database for 150,000+ public water systems nationwide.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-xs">
              <span className="text-3xl block mb-2">📋</span>
              <p className="font-bold text-slate-900 mb-1">Consumer Confidence Reports</p>
              <p className="text-xs text-slate-500 leading-relaxed">
                Mandatory annual utility testing data published under 40 CFR § 141.151, detailing precise contaminant measurements.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-xs">
              <span className="text-3xl block mb-2">🔬</span>
              <p className="font-bold text-slate-900 mb-1">EPA UCMR 5 Protocol</p>
              <p className="text-xs text-slate-500 leading-relaxed">
                The EPA's 5th Unregulated Contaminant Monitoring Rule — testing 29 PFAS chemicals and lithium across U.S. water supplies.
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-400 text-center mt-6 max-w-3xl mx-auto leading-relaxed">
            All data is sourced directly from public U.S. EPA databases and certified municipal water suppliers. WaterSafeCheck operates as an independent public education resource and does not perform laboratory testing.
          </p>
        </section>
        {/* ── Author / Founder E-E-A-T Signature Box ── */}
        <section className="bg-gradient-to-br from-white via-slate-50 to-cyan-50/30 rounded-3xl p-6 sm:p-10 mb-8 border border-slate-200/80 shadow-sm">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
            <div className="relative flex-shrink-0 mx-auto md:mx-0">
              <img
                src="/images/sahajul-haque.jpg"
                alt="Sahajul Haque — Founder & Lead Platform Architect"
                width={112}
                height={112}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-white shadow-lg shadow-slate-200"
              />
              <span className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1 rounded-full shadow-md" title="Verified Creator & Platform Architect">
                <ShieldCheck className="w-4 h-4" />
              </span>
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div>
                  <div className="flex items-center justify-center md:justify-start gap-2">
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      Sahajul Haque
                    </h3>
                    <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider text-cyan-700 bg-cyan-100/70 border border-cyan-200 px-2 py-0.5 rounded-full">
                      Founder
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-cyan-600 mt-0.5">
                    Founder &amp; Lead Platform Architect &bull; Assam, India
                  </p>
                </div>

                <Link
                  href="/about"
                  className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-slate-700 hover:text-cyan-600 bg-white border border-slate-200/80 px-3.5 py-2 rounded-xl shadow-2xs hover:shadow-sm transition-all"
                >
                  About the Founder <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                Sahajul Haque engineered WaterSafeCheck to solve a fundamental public health challenge: transforming over 41,000 fragmented, complex U.S. EPA compliance records into instant, plain-English drinking water safety reports. Driven by open-data transparency, he independently maintains WaterSafeCheck as a 100% free public service for American families without paywalls or corporate influence.
              </p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 pt-3 border-t border-slate-200/60">
                <a
                  href="https://github.com/sahajulhaque196-dot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs hover:bg-slate-50 transition-colors"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
                  GitHub (@sahajulhaque196-dot)
                </a>
                <a
                  href="https://x.com/saddamh58509953"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs hover:bg-slate-50 transition-colors"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  Twitter / X (@saddamh58509953)
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-2xs hover:bg-slate-50 transition-colors"
                >
                  Contact Sahajul &rarr;
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
