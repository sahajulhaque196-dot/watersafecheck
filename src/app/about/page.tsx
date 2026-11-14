// src/app/about/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { SITE_URL, safeJsonLd } from '@/lib/seo'
import { Breadcrumb } from '@/components/ui'
import { ShieldCheck, CheckCircle2, Award, ExternalLink, ArrowRight, Database, Beaker, Users, Sparkles, MapPin, Search } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About WaterSafeCheck — Our Mission, Data Sources & Methodology',
  description: 'Learn about the WaterSafeCheck project. Discover how we parse public EPA Safe Drinking Water Act compliance databases to make water safety information accessible for every American household.',
  alternates: { canonical: `${SITE_URL}/about` },
  openGraph: {
    title: 'About WaterSafeCheck — Our Mission, Data Sources & Methodology',
    description: 'Learn about the WaterSafeCheck project, our EPA compliance parsing methodology, and our commitment to public health transparency.',
    url: `${SITE_URL}/about`,
    type: 'website',
    siteName: 'WaterSafeCheck',
  },
  twitter: {
    card: 'summary',
    title: 'About WaterSafeCheck — Mission & Data Sources',
    description: 'Learn how WaterSafeCheck translates public EPA compliance records into free water safety reports.',
  },
}

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'WaterSafeCheck',
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.svg`,
  description: 'An independent data transparency project that simplifies public U.S. EPA drinking water compliance records for local communities.',
  founder: {
    '@type': 'Person',
    name: 'Sahajul Haque',
    jobTitle: 'Founder & Lead Platform Architect',
    url: `${SITE_URL}/about`,
    image: `${SITE_URL}/images/sahajul-haque.jpg`,
    sameAs: [
      'https://x.com/saddamh58509953',
      'https://github.com/sahajulhaque196-dot'
    ],
    address: {
      '@type': 'PostalAddress',
      addressRegion: 'Assam',
      addressCountry: 'India'
    },
    knowsAbout: [
      'EPA SDWIS Compliance Data',
      'Safe Drinking Water Act Standards',
      'Environmental Data Engineering',
      'Full-Stack Web Development',
      'Public Health Data Transparency'
    ]
  },
  knowsAbout: [
    'Drinking Water Quality',
    'EPA SDWIS Compliance',
    'Safe Drinking Water Act Guidelines',
    'Lead and Copper Rule Standards',
    'Public Health Data Transparency'
  ],
  publishingPrinciples: `${SITE_URL}/about`,
}

export default function AboutPage() {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'About & Methodology' },
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(orgSchema) }}
      />

      <div className="min-h-screen bg-[#F5F5F7] text-slate-900 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <Breadcrumb items={breadcrumbs} />

          {/* ── Apple-Style Editorial Header ── */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-white to-sky-50/50 p-6 sm:p-10 border border-slate-200/80 shadow-apple-card mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-apple-blue/10 text-apple-blue text-xs font-semibold tracking-wide mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              Public Health Data Transparency
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mb-3">
              About WaterSafeCheck
            </h1>
            <p className="text-base sm:text-xl text-slate-600 font-normal leading-relaxed max-w-3xl">
              Independent drinking water data journalism and public utility compliance engineering for over 41,000 U.S. communities.
            </p>
          </div>

          {/* ── 2-Column Responsive Layout with Sticky Sidebar ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* ── Left Column: Main Narrative (8 cols) ── */}
            <main className="lg:col-span-8 space-y-10">

              {/* Mission Card */}
              <section className="apple-card p-6 sm:p-8 bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/80 shadow-apple-card">
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-4">Our Mission</h2>
                <div className="prose-custom text-slate-600 space-y-4 text-sm sm:text-base leading-relaxed">
                  <p>
                    WaterSafeCheck is an independent public interest data engineering initiative. Our mission is direct: <strong>to make municipal drinking water quality and EPA compliance records immediately accessible, understandable, and actionable for every household in America.</strong>
                  </p>
                  <p>
                    The U.S. Environmental Protection Agency gathers comprehensive compliance reports across thousands of municipal and rural water systems. However, these vital records are typically locked in bureaucratic databases like the Safe Drinking Water Information System (SDWIS) or dense annual Consumer Confidence Reports (CCRs) that are difficult to locate and parse.
                  </p>
                  <p>
                    We built WaterSafeCheck to eliminate that friction. By continuously processing open federal datasets, we provide localized water safety scores, lead risks, and compliance histories for over 41,000 U.S. ZIP codes — 100% free with zero paywalls.
                  </p>
                </div>
              </section>

              {/* Integrity Standards Bento */}
              <section className="apple-card p-6 sm:p-8 bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/80 shadow-apple-card">
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-5">Our Data Integrity Principles</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    {
                      title: 'No Speculation',
                      text: 'Every grade and score is computed programmatically from official historical EPA SDWIS filings. We never guess or simulate quality metrics.',
                    },
                    {
                      title: 'Official Primary Citations',
                      text: 'Every report links directly to authoritative sources including the EPA SDWIS Registry and ECHO Compliance History logs.',
                    },
                    {
                      title: 'Quarterly Synchronization',
                      text: 'Data pipelines refresh regularly when the EPA issues quarterly compliance updates and annual Consumer Confidence datasets.',
                    },
                    {
                      title: 'Complete Editorial Independence',
                      text: 'WaterSafeCheck maintains zero commercial affiliations, financial partnerships, or sponsorships with water utilities or filter brands.',
                    },
                  ].map((p, i) => (
                    <div key={i} className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/60">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="w-4 h-4 text-apple-blue" />
                        <h3 className="font-bold text-slate-900 text-sm">{p.title}</h3>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">{p.text}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Primary Data Sources */}
              <section className="apple-card p-6 sm:p-8 bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/80 shadow-apple-card">
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-5">Authoritative Federal Sources</h2>
                <div className="space-y-3.5">
                  {[
                    {
                      name: 'EPA Safe Drinking Water Information System (SDWIS)',
                      url: 'https://www.epa.gov/enviro/sdwis-search',
                      badge: 'Primary Record',
                      desc: 'Official regulatory registry tracking violations, water system IDs, and population metrics for over 150,000 public utilities nationwide.',
                    },
                    {
                      name: 'EPA ECHO — Enforcement and Compliance History Online',
                      url: 'https://echo.epa.gov',
                      badge: 'Enforcement Tracking',
                      desc: 'Documents whether violations prompted formal federal enforcement actions, consent decrees, or compliance penalties.',
                    },
                    {
                      name: 'EPA UCMR 5 — Unregulated Contaminant Monitoring Rule',
                      url: 'https://www.epa.gov/dwucmr/fifth-unregulated-contaminant-monitoring-rule',
                      badge: 'PFAS Screening',
                      desc: 'The latest national screening data tracking 29 individual PFAS compounds and lithium in public drinking supplies.',
                    },
                  ].map((src, i) => (
                    <div key={i} className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/70 hover:border-apple-blue/40 transition-all">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <a
                          href={src.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-slate-900 text-sm hover:text-apple-blue inline-flex items-center gap-1"
                        >
                          <span>{src.name}</span>
                          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                        </a>
                        <span className="badge text-[10px] bg-white border border-slate-200 text-slate-700">
                          {src.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">{src.desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Scoring Methodology Breakdown */}
              <section className="apple-card p-6 sm:p-8 bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/80 shadow-apple-card">
                <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-3">How Safety Scores Are Calculated</h2>
                <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                  Our scoring algorithm weights 5 objective compliance indicators (0–100 total):
                </p>

                <div className="space-y-3">
                  {[
                    { factor: 'Health-Based MCL Violations (5 Years)', weight: '35%', bar: 'bg-rose-500', desc: 'Incidents where water exceeded EPA Maximum Contaminant Levels.' },
                    { factor: 'Unresolved Active Issues', weight: '20%', bar: 'bg-orange-500', desc: 'Violations that remain open without certified closure in SDWIS records.' },
                    { factor: 'Lead Exposure Vulnerability', weight: '20%', bar: 'bg-amber-500', desc: 'Derived from 90th percentile samples and housing construction age.' },
                    { factor: 'Enforcement Actions', weight: '15%', bar: 'bg-apple-blue', desc: 'Formal state or federal compliance orders issued to utilities.' },
                    { factor: 'Infrastructure Proxies', weight: '10%', bar: 'bg-slate-400', desc: 'Historical boil water advisories and local infrastructure indicators.' },
                  ].map((item, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/60 flex items-center gap-4">
                      <div className="w-12 text-right">
                        <span className="font-mono font-bold text-slate-900 text-sm">{item.weight}</span>
                      </div>
                      <div className={`w-1 self-stretch rounded-full ${item.bar}`} />
                      <div className="flex-1">
                        <p className="font-bold text-slate-800 text-xs sm:text-sm mb-0.5">{item.factor}</p>
                        <p className="text-[11px] text-slate-500 leading-snug">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </main>

            {/* ── Right Column: Sticky Sidebar (4 cols) ── */}
            <aside className="lg:col-span-4 sticky top-20 self-start space-y-6">
              {/* Founder Profile Card */}
              <div className="apple-card p-6 bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/80 shadow-apple-card">
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative flex-shrink-0">
                    <Image
                      src="/images/sahajul-haque.jpg"
                      alt="Sahajul Haque — Founder & Lead Platform Architect"
                      width={80}
                      height={80}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md"
                    />
                    <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-0.5 rounded-full shadow-xs" title="Verified Creator">
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </span>
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-lg tracking-tight">Sahajul Haque</h3>
                    <p className="text-xs font-semibold text-apple-blue">Founder &amp; Platform Architect</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Assam, India</p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  Sahajul engineered the data pipelines normalizing records across 41,000+ U.S. ZIP codes from federal EPA SDWIS, ECHO, and UCMR5 datasets.
                </p>

                <div className="space-y-2 pt-3 border-t border-slate-100 text-xs font-medium">
                  <a
                    href="https://x.com/saddamh58509953"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors"
                  >
                    <span>Follow @saddamh58509953</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </a>
                  <a
                    href="https://github.com/sahajulhaque196-dot"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors"
                  >
                    <span>GitHub Profile</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </a>
                </div>
              </div>

              {/* Platform Scale Bento */}
              <div className="apple-card p-5 bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/80 shadow-apple-card">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-3">Coverage Scale</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Monitored</span>
                    <span className="font-bold text-slate-900 text-sm">41,344 ZIPs</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Territories</span>
                    <span className="font-bold text-slate-900 text-sm">50 States + DC</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Access Cost</span>
                    <span className="font-bold text-emerald-600 text-sm">100% Free</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Federal Source</span>
                    <span className="font-bold text-slate-900 text-sm">EPA SDWIS</span>
                  </div>
                </div>
              </div>

              {/* Search ZIP Capsule */}
              <div className="apple-card p-5 bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/80 shadow-apple-card text-center">
                <p className="font-bold text-slate-900 text-sm mb-1">Check Your Community</p>
                <p className="text-xs text-slate-500 mb-4">Search compliance grades for any U.S. ZIP.</p>
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
        </div>
      </div>
    </>
  )
}
