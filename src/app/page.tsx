// src/app/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { StateData } from '@/lib/types'
import { SITE_DESCRIPTION, SITE_NAME } from '@/lib/seo'
import { HomeSearch } from '@/components/sections/HomeSearch'
import { blogArticles } from '@/data/blog-articles'
import { AdTop, AdInContent } from '@/components/ui/AdSense'
import { FadeIn } from '@/components/ui/FadeIn'
import { Search, FileText, ShieldAlert, Droplets, Activity, Beaker, AlertTriangle } from 'lucide-react'

export const metadata: Metadata = {
  title: `${SITE_NAME} — Check Tap Water Safety by ZIP Code`,
  description: SITE_DESCRIPTION,
  alternates: { canonical: 'https://www.watersafecheck.com' },
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
  ['Wisconsin','wi'],['Wyoming','wy'],
]

export default async function HomePage() {
  const { data: statesData } = await supabase.from('states').select('*')
  const allStates = ((statesData || []) as StateData[]).reduce((acc, curr) => {
    acc[curr.code] = curr
    return acc
  }, {} as Record<string, StateData>)

  // National stats
  const totalZips = 41344 // pre-computed from master dataset
  const stateList = Object.values(allStates)
  const totalViolations = stateList.reduce((s: number, st) => s + st.health_violations, 0)
  const highLeadAvg = stateList.length
    ? Math.round(stateList.reduce((s: number, st) => s + st.high_lead_pct, 0) / stateList.length)
    : 0

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-brand-900 text-white">
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-700/50 via-brand-900 to-brand-900"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-water-500/20 blur-3xl rounded-full"></div>
        <div className="absolute top-20 -left-20 w-72 h-72 bg-brand-500/20 blur-3xl rounded-full"></div>
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32 text-center">
          <FadeIn direction="up">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-5 py-2 text-sm font-medium mb-8 shadow-xl">
              <span className="w-2.5 h-2.5 bg-water-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
              Free EPA Data — Updated 2024
            </div>
          </FadeIn>
          
          <FadeIn direction="up" delay={0.1}>
            <h1 className="text-white text-4xl sm:text-6xl lg:text-7xl font-black mb-6 leading-tight tracking-tight">
              Is Your Tap Water<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-water-300 to-water-500 drop-shadow-sm">Safe to Drink?</span>
            </h1>
          </FadeIn>

          <FadeIn direction="up" delay={0.2}>
            <p className="text-lg sm:text-xl text-brand-100 mb-10 max-w-2xl mx-auto leading-relaxed">
              Search 41,000+ U.S. ZIP codes for lead levels, water quality grades,
              violations, and contaminant data — powered by official EPA records.
            </p>
          </FadeIn>

          <FadeIn direction="up" delay={0.3}>
            <div className="relative z-10 max-w-3xl mx-auto">
              <HomeSearch />
            </div>
            <p className="text-sm text-brand-300 mt-5 font-medium">
              No sign-up required. 100% free. Data from EPA SDWIS & Consumer Confidence Reports.
            </p>
          </FadeIn>
        </div>
        
      </section>

      {/* ── National Stats ── */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl font-black text-brand-700">{totalZips.toLocaleString()}+</p>
              <p className="text-sm text-gray-500 mt-1">ZIP Codes Covered</p>
            </div>
            <div>
              <p className="text-3xl font-black text-brand-700">50</p>
              <p className="text-sm text-gray-500 mt-1">States + DC</p>
            </div>
            <div>
              <p className="text-3xl font-black text-orange-600">{(totalViolations / 1000).toFixed(0)}K+</p>
              <p className="text-sm text-gray-500 mt-1">Health Violations Found</p>
            </div>
            <div>
              <p className="text-3xl font-black text-red-600">{highLeadAvg}%</p>
              <p className="text-sm text-gray-500 mt-1">High Lead Risk ZIPs</p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AdTop />

        {/* ── How It Works ── */}
        <section className="mb-20">
          <FadeIn>
            <h2 className="text-3xl sm:text-4xl font-black text-center text-brand-900 mb-4 tracking-tight">How WaterSafeCheck Works</h2>
            <p className="text-center text-gray-500 mb-12 max-w-2xl mx-auto text-lg">
              We aggregate official EPA data into clear, actionable water quality reports for every ZIP code in America.
            </p>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                icon: <Search className="w-10 h-10 text-brand-600" />,
                title: 'Enter Your ZIP Code',
                desc: 'Type in any U.S. ZIP code to instantly access water quality data for your exact service area.',
              },
              {
                step: '2',
                icon: <FileText className="w-10 h-10 text-brand-600" />,
                title: 'View Your Water Report',
                desc: 'See your water safety grade (A–F), lead levels in ppb, health violations, contaminants detected, and more — all from official EPA sources.',
              },
              {
                step: '3',
                icon: <ShieldAlert className="w-10 h-10 text-brand-600" />,
                title: 'Take Action if Needed',
                desc: 'Get tailored recommendations based on your specific water data, including filter suggestions, utility contacts, and health resources.',
              },
            ].map((item, index) => (
              <FadeIn key={item.step} delay={index * 0.15}>
                <div className="card-hover h-full flex flex-col relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 font-black text-8xl text-brand-900 pointer-events-none transition-transform group-hover:scale-110 group-hover:-translate-y-2 group-hover:translate-x-2">
                    {item.step}
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center mb-6 shadow-sm border border-brand-100 group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* ── Why Water Quality Matters ── */}
        <section className="mb-20">
          <FadeIn>
            <div className="card bg-gradient-to-br from-brand-50 to-white border-brand-100 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-water-300/10 blur-3xl rounded-full"></div>
              <div className="relative z-10 max-w-4xl mx-auto">
                <h2 className="text-3xl font-black text-gray-900 mb-8 tracking-tight">Why Check Your Tap Water?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-600">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <Droplets className="w-6 h-6 text-brand-500" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2 text-lg">Lead Contamination</h4>
                      <p className="leading-relaxed">The EPA estimates that 10–20% of human lead exposure comes from drinking water. Lead has no safe exposure level for children and can cause irreversible neurological damage.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <Beaker className="w-6 h-6 text-brand-500" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2 text-lg">PFAS "Forever Chemicals"</h4>
                      <p className="leading-relaxed">PFAS chemicals have been detected in water supplies serving millions. The EPA issued its first federal PFAS MCLs in 2024, setting limits at 4 parts per trillion.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <Activity className="w-6 h-6 text-brand-500" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2 text-lg">Disinfection Byproducts</h4>
                      <p className="leading-relaxed">When chlorine reacts with organic matter, it forms compounds (TTHMs and HAA5s) linked to increased cancer risk with long-term exposure.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <AlertTriangle className="w-6 h-6 text-brand-500" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2 text-lg">Aging Infrastructure</h4>
                      <p className="leading-relaxed">Over 6 million lead service lines still deliver water to homes. The EPA's Lead and Copper Rule requires utilities to identify and replace these pipes, but it will take years.</p>
                    </div>
                  </div>
                </div>
                <div className="mt-10">
                  <Link href="/water-quality-guide" className="btn-primary inline-flex">
                    Read the Complete Water Safety Guide →
                  </Link>
                </div>
              </div>
            </div>
          </FadeIn>
        </section>

        <AdInContent />

        {/* ── Popular Cities ── */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Popular City Water Reports</h2>
          <p className="text-sm text-gray-500 mb-6">Check water quality for major U.S. cities</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {POPULAR_CITIES.map(({ city, state, zip }) => (
              <Link
                key={zip}
                href={`/city/${city.toLowerCase().replace(/\s+/g, '-')}-${state.toLowerCase()}`}
                className="card-hover group block"
              >
                <p className="font-semibold text-sm text-gray-800 group-hover:text-brand-700 transition-colors">
                  {city}, {state}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">View water quality →</p>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Browse by State ── */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Browse Water Quality by State</h2>
          <p className="text-sm text-gray-500 mb-6">View all ZIP codes and city reports for any U.S. state</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {US_STATES_GRID.map(([name, code]) => {
              const st = allStates[code.toUpperCase()]
              return (
                <Link
                  key={code}
                  href={`/state/${code}`}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg border border-gray-100 hover:border-brand-200 hover:bg-brand-50 transition-all group"
                >
                  <span className="text-sm text-gray-700 group-hover:text-brand-700 font-medium">{name}</span>
                  {st && (
                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                      st.avg_score && st.avg_score >= 75 ? 'text-green-700 bg-green-50' :
                      st.avg_score && st.avg_score >= 60 ? 'text-blue-700 bg-blue-50' :
                      'text-orange-700 bg-orange-50'
                    }`}>
                      {st.avg_score ? `${st.avg_score}` : '—'}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        </section>

        {/* ── Blog / Latest Articles ── */}
        <section className="mb-14">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Water Safety Articles</h2>
              <p className="text-sm text-gray-500">Plain-English guides on tap water safety, filters, and EPA data</p>
            </div>
            <Link href="/blog" className="text-sm text-brand-700 hover:underline font-medium hidden sm:block">
              View all articles →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {blogArticles.slice(0, 3).map(article => (
              <Link key={article.slug} href={`/blog/${article.slug}`} className="card-hover group block">
                <p className="text-xs text-brand-600 font-semibold mb-1.5">{article.category}</p>
                <h3 className="text-sm font-bold text-gray-800 group-hover:text-brand-700 transition-colors leading-snug mb-2 line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-3">
                  {article.intro.slice(0, 120)}...
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">{article.readTime}</span>
                  <span className="text-xs text-brand-600 font-semibold">Read →</span>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-4 text-center sm:hidden">
            <Link href="/blog" className="text-sm text-brand-700 hover:underline font-medium">
              View all articles →
            </Link>
          </div>
        </section>

        {/* ── Data Source Trust ── */}
        <section className="bg-gray-50 rounded-2xl p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">Trusted Data Sources</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center text-sm">
            <div className="flex flex-col items-center gap-2">
              <span className="text-3xl">🏛</span>
              <p className="font-semibold text-gray-800">EPA SDWIS</p>
              <p className="text-gray-500">Safe Drinking Water Information System — the EPA's official compliance database for 150,000+ public water systems</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-3xl">📋</span>
              <p className="font-semibold text-gray-800">Consumer Confidence Reports</p>
              <p className="text-gray-500">Annual water quality reports that utilities are legally required to publish, containing actual contaminant measurements</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-3xl">🔬</span>
              <p className="font-semibold text-gray-800">EPA UCMR5 Monitoring</p>
              <p className="text-gray-500">The EPA's 5th Unregulated Contaminant Monitoring Rule — the most comprehensive PFAS screening of U.S. water systems ever conducted</p>
            </div>
          </div>
          <p className="text-xs text-gray-400 text-center mt-6">
            All data is sourced from public U.S. government databases. WaterSafeCheck does not conduct independent water testing.
            Data reflects monitoring records and may not reflect current real-time conditions.
          </p>
        </section>
      </div>
    </>
  )
}
