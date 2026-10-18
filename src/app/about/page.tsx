// src/app/about/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import Script from 'next/script'
import { SITE_URL, safeJsonLd } from '@/lib/seo'

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
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(orgSchema) }}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <nav className="mb-6 text-sm text-gray-500" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-brand-700">Home</Link>
          <span className="mx-2" aria-hidden="true">/</span>
          <span className="text-gray-800 font-medium" aria-current="page">About</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-2">About WaterSafeCheck</h1>
        <p className="text-lg text-gray-500 mb-10">Independent drinking water data transparency and public utility analysis</p>

        {/* ── Mission & Identity Section ── */}
        <section className="mb-12" aria-labelledby="mission-heading">
          <h2 id="mission-heading" className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            WaterSafeCheck is an independent data journalism and engineering project. Our goal is simple: <strong>to make public health and water quality data easily accessible and understandable for every American household.</strong>
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            The U.S. Environmental Protection Agency (EPA) collects extensive reports from thousands of public water utilities. However, these compliance records are often locked inside complex databases like the Safe Drinking Water Information System (SDWIS) or dense annual Consumer Confidence Reports (CCRs) that are hard for the average resident to locate and interpret.
          </p>
          <p className="text-gray-700 leading-relaxed">
            We built this platform to bridge that gap. By parsing and organizing open-source government databases, we present clear, localized safety grades, lead risks, and compliance histories for over 41,000 U.S. ZIP codes — entirely free, without requiring any sign-up or personal data.
          </p>
        </section>

        {/* ── Transparency and E-E-A-T Commitment ── */}
        <section className="mb-12" aria-labelledby="standards-heading">
          <div className="bg-gradient-to-br from-brand-50 to-blue-50 border border-brand-100 rounded-2xl p-6">
            <h3 id="standards-heading" className="text-lg font-bold text-gray-900 mb-2">Our Data Integrity Standards</h3>
            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              To ensure the highest accuracy in compliance with YMYL (Your Money or Your Life) search guidelines:
            </p>
            <ul className="text-sm text-gray-700 space-y-2 list-disc pl-5">
              <li>
                <strong>No Speculation:</strong> Every grade and score is derived programmatically from official, historical EPA records. We do not make estimates or speculate on water quality.
              </li>
              <li>
                <strong>Official Citations:</strong> We link directly to official sources like the <a href="https://www.epa.gov/enviro/sdwis-search" target="_blank" rel="noopener noreferrer" className="text-brand-700 hover:underline">EPA SDWIS Database</a> and the <a href="https://echo.epa.gov" target="_blank" rel="noopener noreferrer" className="text-brand-700 hover:underline">ECHO Compliance History</a>.
              </li>
              <li>
                <strong>Regular Updates:</strong> Data is synchronized regularly when the EPA updates its quarterly compliance tracking datasets.
              </li>
              <li>
                <strong>Complete Independence:</strong> WaterSafeCheck has no financial relationship or partnerships with water utilities, municipal governments, or filter manufacturers. Our platform operates as a 100% free public health data resource.
              </li>
            </ul>
          </div>
        </section>

        {/* ── Official Guidelines & References ── */}
        <section className="mb-12" aria-labelledby="references-heading">
          <h2 id="references-heading" className="text-2xl font-bold text-gray-900 mb-4">Official Health Guidelines</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            For drinking water safety, we follow the established standards and thresholds set by public health authorities:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="border border-gray-100 rounded-xl p-4 bg-white shadow-sm">
              <h4 className="font-semibold text-gray-900 text-sm mb-1">EPA Standards</h4>
              <p className="text-xs text-gray-500 leading-relaxed mb-2">Sets the enforceable Maximum Contaminant Levels (MCLs) under the Safe Drinking Water Act.</p>
              <a href="https://www.epa.gov/ground-water-and-drinking-water" target="_blank" rel="noopener noreferrer" className="text-brand-700 hover:underline text-xs font-semibold">View EPA Guidelines →</a>
            </div>
            <div className="border border-gray-100 rounded-xl p-4 bg-white shadow-sm">
              <h4 className="font-semibold text-gray-900 text-sm mb-1">CDC Guidance</h4>
              <p className="text-xs text-gray-500 leading-relaxed mb-2">Provides recommendations on lead exposure prevention and health effects of water contaminants.</p>
              <a href="https://www.cdc.gov/nceh/lead/prevention/sources/water.htm" target="_blank" rel="noopener noreferrer" className="text-brand-700 hover:underline text-xs font-semibold">View CDC Guidance →</a>
            </div>
            <div className="border border-gray-100 rounded-xl p-4 bg-white shadow-sm">
              <h4 className="font-semibold text-gray-900 text-sm mb-1">NSF International</h4>
              <p className="text-xs text-gray-500 leading-relaxed mb-2">Maintains standards for water treatment systems (Standard 42, 53, and 58).</p>
              <a href="https://www.nsf.org/consumer-resources/articles/certified-drinking-water-filters" target="_blank" rel="noopener noreferrer" className="text-brand-700 hover:underline text-xs font-semibold">Verify NSF Filters →</a>
            </div>
          </div>
        </section>

        {/* ── Data Sources ── */}
        <section className="mb-12" aria-labelledby="sources-heading">
          <h2 id="sources-heading" className="text-2xl font-bold text-gray-900 mb-4">Our Primary Data Sources</h2>
          <div className="space-y-4">
            {[
              {
                name: 'EPA Safe Drinking Water Information System (SDWIS)',
                url: 'https://www.epa.gov/enviro/sdwis-search',
                badge: 'Primary Source',
                badgeColor: 'bg-brand-100 text-brand-800 border-brand-200',
                desc: 'Tracks compliance for over 150,000 public water systems nationwide, including violations, system identification, and population served metrics.',
              },
              {
                name: 'EPA ECHO — Enforcement and Compliance History Online',
                url: 'https://echo.epa.gov',
                badge: 'Enforcement Data',
                badgeColor: 'bg-orange-50 text-orange-700 border-orange-200',
                desc: "Shows whether violations resulted in formal regulatory enforcement actions, penalties, or compliance orders, which we use to model compliance risk.",
              },
              {
                name: 'EPA UCMR5 — Unregulated Contaminant Monitoring Rule',
                url: 'https://www.epa.gov/dwucmr/fifth-unregulated-contaminant-monitoring-rule',
                badge: 'PFAS Data',
                badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
                desc: "The latest national screening data tracking unregulated chemical contaminants (including 29 PFAS/forever chemicals) between 2023 and 2025.",
              },
            ].map((src, i) => (
              <div key={i} className="border border-gray-100 rounded-xl p-5 hover:border-brand-100 transition-colors">
                <div className="flex flex-wrap items-start gap-2 mb-2">
                  <h3 className="font-semibold text-gray-900 text-sm flex-1">
                    <a href={src.url} target="_blank" rel="noopener noreferrer" className="text-brand-700 hover:underline">
                      {src.name} ↗
                    </a>
                  </h3>
                  <span className={`badge ${src.badgeColor} text-xs flex-shrink-0`}>{src.badge}</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{src.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Scoring Methodology ── */}
        <section className="mb-12" aria-labelledby="method-heading">
          <h2 id="method-heading" className="text-2xl font-bold text-gray-900 mb-4">How Safety Scores are Calculated</h2>
          <p className="text-gray-700 leading-relaxed mb-5">
            Our platform evaluates raw EPA data using a clear, objective scoring methodology. Each monitored area is graded on a scale from 0 to 100 based on the following weighted indicators:
          </p>
          <div className="space-y-3">
            {[
              { factor: 'Health-Based Violations (5 years)', weight: '35%', color: 'bg-red-500', desc: 'The number and chronological severity of violations where a water system exceeded an EPA Maximum Contaminant Level (MCL).' },
              { factor: 'Unresolved Violations', weight: '20%', color: 'bg-orange-500', desc: 'Violations that remain open or active in official EPA records, indicating unresolved water quality challenges.' },
              { factor: 'Lead Exposure Probability', weight: '20%', color: 'bg-yellow-500', desc: 'Estimated exposure risks derived from housing and service line infrastructure age data.' },
              { factor: 'Enforcement Actions', weight: '15%', color: 'bg-blue-500', desc: 'Formal state or federal compliance orders issued to utilities, indicating the severity of historical compliance lapses.' },
              { factor: 'Infrastructure Risk Indicators', weight: '10%', color: 'bg-gray-400', desc: 'Boil water advisory histories, energy burden proxies, and localized flood risk costs.' },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="flex-shrink-0 text-right" style={{ minWidth: 44 }}>
                  <span className="text-sm font-black text-gray-800">{item.weight}</span>
                </div>
                <div className="flex-shrink-0 w-1 rounded-full self-stretch" style={{ background: item.color.replace('bg-', '') }} />
                <div>
                  <p className="text-sm font-semibold text-gray-800 mb-1">{item.factor}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Limitations ── */}
        <section className="mb-12" aria-labelledby="limits-heading">
          <h2 id="limits-heading" className="text-2xl font-bold text-gray-900 mb-4">Data Limitations & Disclaimers</h2>
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 space-y-3 text-sm text-yellow-900">
            {[
              'We do not test water ourselves. All reports are compiled from public database logs reported by municipal utilities to the EPA.',
              'Data reflects historical compliance records and may not account for real-time changes or temporary local disruptions.',
              'Private well water is not tracked by the Safe Drinking Water Act or logged in the SDWIS database. Well owners should arrange independent laboratory testing.',
              'Our reports provide general utility data. Home plumbing systems (especially pre-1986 pipes) can introduce lead that is not captured by municipal water main samples.',
            ].map((item, i) => (
              <div key={i} className="flex gap-2">
                <span className="font-bold flex-shrink-0">!</span>
                <p>{item}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Founder & Platform Architect (E-E-A-T) ── */}
        <section className="mb-12" aria-labelledby="team-heading">
          <h2 id="team-heading" className="text-2xl font-bold text-gray-900 mb-4">Founder & Lead Platform Architect</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            WaterSafeCheck was founded and engineered by Sahajul Haque, an independent data systems engineer based in Assam, India. The platform was created to transform millions of complex, fragmented U.S. EPA compliance records into free, instant, and accessible water safety reports for American communities.
          </p>
          <div className="card bg-gradient-to-br from-brand-50 via-white to-sky-50 border-brand-100 p-6 rounded-2xl shadow-sm">
            <div className="flex flex-col sm:flex-row gap-5 items-start">
              <img
                src="/images/sahajul-haque.jpg"
                alt="Sahajul Haque — Founder & Lead Platform Architect"
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-white shadow-md flex-shrink-0"
              />
              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                  <h3 className="font-bold text-gray-900 text-xl">Sahajul Haque</h3>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-100 text-brand-800 border border-brand-200">
                    Founder & Lead Platform Architect
                  </span>
                </div>
                <p className="text-xs text-brand-700 mb-3 font-medium">
                  📍 Assam, India · Creator of WaterSafeCheck · Environmental Informatics & Data Engineering
                </p>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  Sahajul architected the high-throughput data processing pipeline that normalizes over 41,000 U.S. ZIP codes from federal EPA SDWIS, ECHO enforcement histories, and UCMR5 contaminant monitoring databases. Driven by a commitment to global public data transparency, he designed WaterSafeCheck to operate as a completely free public service without paywalls, trackers, or corporate influence.
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-gray-100">
                  <a
                    href="https://x.com/saddamh58509953"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-700 hover:text-brand-700 bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm transition-colors"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 24.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    Follow on X (@saddamh58509953)
                  </a>
                  <a
                    href="https://github.com/sahajulhaque196-dot"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-700 hover:text-brand-700 bg-white border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm transition-colors"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
                    GitHub (@sahajulhaque196-dot)
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Contact ── */}
        <section className="mb-6" aria-labelledby="contact-heading">
          <h2 id="contact-heading" className="text-2xl font-bold text-gray-900 mb-4">Get in Touch</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            If you have questions about our data parsing, methodology, or would like to report a data correction, please contact us.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="card border-gray-100">
              <p className="text-sm font-semibold text-gray-800 mb-1">📧 Email</p>
              <a href="mailto:contact@watersafecheck.com" className="text-brand-700 hover:underline text-sm">
                contact@watersafecheck.com
              </a>
              <p className="text-xs text-gray-400 mt-1">Response within 1–2 business days</p>
            </div>
            <div className="card border-gray-100">
              <p className="text-sm font-semibold text-gray-800 mb-1">📋 Contact Form</p>
              <Link href="/contact" className="text-brand-700 hover:underline text-sm">
                Use our contact form →
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
