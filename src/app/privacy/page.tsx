// src/app/privacy/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { Lock, Shield, EyeOff, Cookie, CheckCircle2, ExternalLink } from 'lucide-react'
import { SITE_URL } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for WaterSafeCheck.com — how we collect, use, and protect your information. We collect minimal data and never sell your personal information.',
  alternates: { canonical: `${SITE_URL}/privacy` },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Privacy Policy | WaterSafeCheck',
    description: 'Privacy policy for WaterSafeCheck.com — how we collect, use, and protect your information.',
    url: `${SITE_URL}/privacy`,
    type: 'website',
    siteName: 'WaterSafeCheck',
  },
  twitter: {
    card: 'summary',
    title: 'Privacy Policy | WaterSafeCheck',
    description: 'Privacy policy for WaterSafeCheck.com.',
  },
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F7] text-slate-900 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center space-x-2 text-xs font-semibold text-slate-500 uppercase tracking-wider" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-apple-blue transition-colors">Home</Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-900 font-bold" aria-current="page">Privacy Policy</span>
        </nav>

        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-semibold tracking-wide mb-3">
            <Lock className="w-3.5 h-3.5" />
            Data Protection & Transparency
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-3">
            Privacy Policy
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Last Updated: January 1, 2026 • CCPA & Global Standard Compliant
          </p>
        </div>

        {/* Apple Style Privacy Manifesto Card */}
        <div className="apple-card p-6 sm:p-8 bg-gradient-to-br from-emerald-500/[0.08] via-white to-white backdrop-blur-xl border border-emerald-200/80 rounded-3xl shadow-apple-card mb-10">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div className="space-y-2 text-sm text-slate-700 leading-relaxed">
              <h2 className="font-bold text-slate-900 text-base">Our Privacy Commitment</h2>
              <p>
                At WaterSafeCheck, we believe your health and location inquiries are private. We collect zero identifiable personal data when you search drinking water metrics, we never sell your data, and we do not profile your home address.
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="apple-card p-6 sm:p-12 bg-white/90 backdrop-blur-2xl border border-slate-200/80 rounded-3xl shadow-apple-card space-y-10 text-sm sm:text-base text-slate-700 leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center">1</span>
              Information We Collect
            </h2>
            <p>WaterSafeCheck operates with strict data minimization principles:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
                <p className="font-bold text-slate-900 text-sm mb-1">Anonymous Telemetry</p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Aggregated page views, browser user agents, and referral sources monitored via Google Analytics without individual identity linkage.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
                <p className="font-bold text-slate-900 text-sm mb-1">ZIP Code Lookups</p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Lookups are cached anonymously to optimize server speeds. Search queries are never tied to names, physical street addresses, or billing info.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4 pt-6 border-t border-slate-100">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center">2</span>
              Cookies & Advertising Partners
            </h2>
            <p>
              We utilize cookies to deliver high-quality site performance and support our free public mission through Google AdSense advertising:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-600 pl-2 text-sm sm:text-base">
              <li>
                <strong>Google AdSense:</strong> Third-party vendors, including Google, employ cookies to serve ads based on prior browsing history.
              </li>
              <li>
                <strong>Performance Cookies:</strong> Keep track of server load and caching states so pages load instantaneously.
              </li>
            </ul>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 text-xs text-slate-600 space-y-2">
              <p className="font-bold text-slate-900">How to manage your ad preferences:</p>
              <p>
                You may opt out of personalized advertising by visiting{' '}
                <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-apple-blue font-semibold hover:underline inline-flex items-center gap-1">
                  Google Ad Settings <ExternalLink className="w-3 h-3" />
                </a>{' '}
                or the Network Advertising Initiative at{' '}
                <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-apple-blue font-semibold hover:underline inline-flex items-center gap-1">
                  aboutads.info/choices <ExternalLink className="w-3 h-3" />
                </a>.
              </p>
            </div>
          </section>

          <section className="space-y-4 pt-6 border-t border-slate-100">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center">3</span>
              How We Protect & Retain Data
            </h2>
            <p>
              We enforce SSL/TLS encryption across all network communication. Contact inquiries are retained in secure corporate mailboxes solely to address your query and are permanently expunged upon resolution.
            </p>
            <p className="font-semibold text-slate-900">
              We never sell, monetize, or license your personal information to third-party data brokers, marketers, or water filter companies.
            </p>
          </section>

          <section className="space-y-4 pt-6 border-t border-slate-100">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center">4</span>
              California CCPA & Consumer Privacy Rights
            </h2>
            <p>
              Under the California Consumer Privacy Act (CCPA) and related state privacy statutes, residents have the right to request disclosure of collected data categories, request total deletion, and confirm that no data is sold.
            </p>
            <p>
              To exercise any privacy rights, simply contact us at{' '}
              <a href="mailto:contact@watersafecheck.com" className="text-apple-blue font-semibold hover:underline">
                contact@watersafecheck.com
              </a>.
            </p>
          </section>
        </div>

        {/* FAQ Accordion */}
        <div className="mt-10 apple-card p-6 sm:p-8 bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl shadow-apple-card">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 mb-4">
            Frequently Asked Privacy Questions
          </h2>
          <div className="divide-y divide-slate-100">
            {[
              {
                q: 'Does WaterSafeCheck sell my personal data?',
                a: 'No. We do not sell, trade, or rent personal data under any circumstances. All water report lookups are completely anonymous.',
              },
              {
                q: 'Why do I see ads on WaterSafeCheck?',
                a: 'WaterSafeCheck is an independent educational platform offered completely free to the public. Non-intrusive display advertising through Google AdSense helps offset server bandwidth and federal database synchronization expenses.',
              },
              {
                q: 'How can I stop seeing personalized ads?',
                a: 'You can visit adssettings.google.com to disable personalized advertising across Google networks, or enable Global Privacy Control (GPC) in modern web browsers.',
              },
              {
                q: 'Is my ZIP code lookup linked to my real identity?',
                a: 'No. Searches are processed statelessly without creating user profiles, storing IP identifiers against ZIP codes, or tracking physical house numbers.',
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
