// src/app/disclaimer/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { AlertTriangle, Phone, ShieldCheck, Info, ExternalLink, HelpCircle } from 'lucide-react'
import { SITE_URL } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Disclaimer — WaterSafeCheck Data & Health Guidance',
  description: 'Important disclaimer about WaterSafeCheck data — what we can and cannot tell you about your drinking water safety. Read before making health decisions.',
  alternates: { canonical: `${SITE_URL}/disclaimer` },
  openGraph: {
    title: 'Disclaimer | WaterSafeCheck',
    description: 'Important disclaimer about WaterSafeCheck drinking water data and educational guidance.',
    url: `${SITE_URL}/disclaimer`,
    type: 'website',
    siteName: 'WaterSafeCheck',
  },
  twitter: {
    card: 'summary',
    title: 'Disclaimer | WaterSafeCheck',
    description: 'Important disclaimer about WaterSafeCheck drinking water data.',
  },
}

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F7] text-slate-900 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center space-x-2 text-xs font-semibold text-slate-500 uppercase tracking-wider" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-apple-blue transition-colors">Home</Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-900 font-bold" aria-current="page">Disclaimer</span>
        </nav>

        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 text-xs font-semibold tracking-wide mb-3">
            <AlertTriangle className="w-3.5 h-3.5" />
            Regulatory & Health Notice
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-3">
            Important Disclaimer
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Last Updated: January 1, 2026 • Please read prior to making clinical or plumbing decisions
          </p>
        </div>

        {/* Attention Callout Card */}
        <div className="apple-card p-6 sm:p-8 bg-gradient-to-br from-amber-500/[0.08] via-white to-white backdrop-blur-xl border border-amber-300/60 rounded-3xl shadow-apple-card mb-10">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-2 text-sm text-slate-800 leading-relaxed">
              <h2 className="font-bold text-slate-900 text-base">Educational Guidance Only</h2>
              <p>
                WaterSafeCheck provides informational summaries derived from federal EPA databases. It is <strong>not a substitute for professional certified laboratory water testing</strong>, certified plumbing inspections, or medical advice. If you suspect toxic contamination or are under a boil-water order, contact your municipal utility or call the EPA Safe Drinking Water Hotline at <strong className="text-slate-900">1-800-426-4791</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Main Sections */}
        <div className="apple-card p-6 sm:p-12 bg-white/90 backdrop-blur-2xl border border-slate-200/80 rounded-3xl shadow-apple-card space-y-10 text-sm sm:text-base text-slate-700 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center">1</span>
              Informational & Non-Medical Scope
            </h2>
            <p>
              The composite scores, health grades, water hardness metrics, and contaminant analyses published on WaterSafeCheck.com are generated strictly for general public education. Nothing presented on this site constitutes professional medical, health, toxicological, or engineering advice.
            </p>
            <p className="text-slate-600 text-sm">
              Individuals with specialized medical vulnerabilities (infants, pregnant individuals, immunocompromised patients, or dialysis patients) should seek guidance directly from their healthcare provider regarding appropriate water purification methods.
            </p>
          </section>

          <section className="space-y-3 pt-6 border-t border-slate-100">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center">2</span>
              Historical Compliance Records vs. Real-Time Status
            </h2>
            <p>
              All metrics on WaterSafeCheck are compiled from historical records released under the EPA’s Safe Drinking Water Information System (SDWIS), ECHO enforcement databases, UCMR5 monitoring, and annual Consumer Confidence Reports (CCR).
            </p>
            <p>
              Water quality can fluctuate rapidly due to main breaks, seasonal agricultural run-off, or treatment plant repairs. A water system with an unblemished historical compliance rating may experience an acute boil-water event today that has not yet populated federal audit files. Always check with your local water provider for immediate emergency advisories.
            </p>
          </section>

          <section className="space-y-3 pt-6 border-t border-slate-100">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center">3</span>
              We Do Not Conduct Physical Water Testing
            </h2>
            <p>
              WaterSafeCheck is an independent analytical publication. We do not operate laboratories, collect field samples, or dispatch technicians. The data reflects what utilities reported to federal and state overseers.
            </p>
            <p>
              Lead and copper leach into drinking water primarily through service line pipes and indoor solder. To know the exact concentration of contaminants reaching your home faucet, you must test a sample with a state-certified environmental testing laboratory.
            </p>
          </section>

          <section className="space-y-3 pt-6 border-t border-slate-100">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center">4</span>
              Data Boundaries & Technical Constraints
            </h2>
            <p>While our algorithms adhere to strict statistical cleaning rules, known technical limitations exist:</p>
            <ul className="list-disc list-inside space-y-2 text-slate-600 pl-2 text-sm sm:text-base">
              <li>ZIP code boundaries do not always align with municipal water district lines;</li>
              <li>Homes drawing from private domestic wells are not regulated under SDWA and are excluded from public utility datasets;</li>
              <li>Micro-systems serving fewer than 25 permanent residents operate under differing disclosure requirements;</li>
              <li>Lag periods between state enforcement filings and federal database updates can span several months.</li>
            </ul>
          </section>

          <section className="space-y-3 pt-6 border-t border-slate-100">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center">5</span>
              Independent Status — Not a Government Agency
            </h2>
            <p>
              WaterSafeCheck is an independent consumer education resource. We are not owned, operated, funded, or endorsed by the U.S. Environmental Protection Agency (EPA), state health departments, or municipal utility departments.
            </p>
          </section>

          <section className="space-y-3 pt-6 border-t border-slate-100">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center">6</span>
              Water Filter Standards & NSF Certifications
            </h2>
            <p>
              References to filtration technologies (e.g. Activated Carbon, Reverse Osmosis, KDF) and independent test standards (NSF/ANSI 42, 53, 58, 401) are provided solely for consumer guidance. WaterSafeCheck does not sell water filtration hardware or receive kickbacks from water filter companies.
            </p>
            <p className="text-slate-600 text-sm">
              Consumers should always confirm certification claims on the official public directories of NSF International, the Water Quality Association (WQA), or IAPMO before purchasing water filtration equipment.
            </p>
          </section>
        </div>

        {/* EPA Safe Drinking Water Hotline Callout */}
        <div className="mt-10 apple-card p-6 sm:p-8 bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl shadow-apple-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-apple-blue/10 text-apple-blue flex items-center justify-center shrink-0">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-base">Have Urgent Water Questions?</p>
              <p className="text-xs text-slate-500">Contact the EPA Safe Drinking Water Hotline (Mon–Fri, 10 AM–4 PM ET)</p>
            </div>
          </div>
          <a
            href="tel:18004264791"
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-apple-blue hover:bg-blue-600 text-white font-bold text-sm tracking-tight shadow-md shadow-apple-blue/20 text-center transition-all active:scale-[0.98]"
          >
            1-800-426-4791
          </a>
        </div>

        {/* FAQs */}
        <div className="mt-10 apple-card p-6 sm:p-8 bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl shadow-apple-card">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 mb-4 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-slate-500" />
            Disclaimer FAQs
          </h2>
          <div className="divide-y divide-slate-100">
            {[
              {
                q: 'Is WaterSafeCheck an official government database?',
                a: 'No. WaterSafeCheck is an independent educational platform. We process public domain data from the EPA, but we have no governmental affiliation.',
              },
              {
                q: 'Can I make medical treatment decisions based on this website?',
                a: 'No. Never base clinical decisions on our data alone. Speak directly with a qualified physician or public health toxicologist.',
              },
              {
                q: 'How frequently does WaterSafeCheck sync with EPA SDWIS?',
                a: 'We sync our databases regularly as new quarterly federal compliance audits and UCMR monitoring cycles are published.',
              },
              {
                q: 'How do I report a perceived error in my town’s score?',
                a: 'Please email contact@watersafecheck.com with the ZIP code and document link. Our team reviews all discrepancy reports within 48 hours.',
              },
            ].map((faq, idx) => (
              <details key={idx} className="group py-4 select-none">
                <summary className="flex items-center justify-between cursor-pointer list-none text-sm sm:text-base font-semibold text-slate-900 hover:text-apple-blue transition-colors">
                  <span>{faq.q}</span>
                  <span className="ml-4 shrink-0 text-slate-400 group-open:rotate-180 transition-transform">
                    ↓
                  </span>
                </summary>
                <div className="mt-3 text-sm text-slate-600 leading-relaxed pl-1 pr-6 font-normal">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
