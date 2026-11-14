// src/app/terms/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { FileText, ShieldCheck, Scale, ArrowRight, ExternalLink } from 'lucide-react'
import { SITE_URL } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of service and user agreement for WaterSafeCheck.com. Learn about our terms of use, content guidelines, disclaimers, and user responsibilities.',
  alternates: { canonical: `${SITE_URL}/terms` },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Terms of Service | WaterSafeCheck',
    description: 'Terms of service and user agreement for WaterSafeCheck.com.',
    url: `${SITE_URL}/terms`,
    type: 'website',
    siteName: 'WaterSafeCheck',
  },
  twitter: {
    card: 'summary',
    title: 'Terms of Service | WaterSafeCheck',
    description: 'Terms of service and user agreement for WaterSafeCheck.com.',
  },
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F7] text-slate-900 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center space-x-2 text-xs font-semibold text-slate-500 uppercase tracking-wider" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-apple-blue transition-colors">Home</Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-900 font-bold" aria-current="page">Terms of Service</span>
        </nav>

        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-apple-blue/10 text-apple-blue text-xs font-semibold tracking-wide mb-3">
            <Scale className="w-3.5 h-3.5" />
            Legal & Compliance
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-3">
            Terms of Service
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Effective Date: January 1, 2026 • Version 2.4
          </p>
        </div>

        {/* Executive Summary Card */}
        <div className="apple-card p-6 sm:p-8 bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl shadow-apple-card mb-10">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="space-y-2 text-sm text-slate-700 leading-relaxed">
              <h2 className="font-bold text-slate-900 text-base">Key Takeaways</h2>
              <p>
                By accessing WaterSafeCheck.com, you agree to these Terms. WaterSafeCheck is an independent educational platform aggregating public federal drinking water compliance data published by the U.S. EPA under the Safe Drinking Water Act (SDWA). We are not a government agency, and our reports do not replace certified physical tap water testing or medical consultation.
              </p>
            </div>
          </div>
        </div>

        {/* Policy Body */}
        <div className="apple-card p-6 sm:p-12 bg-white/90 backdrop-blur-2xl border border-slate-200/80 rounded-3xl shadow-apple-card space-y-10 text-sm sm:text-base text-slate-700 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center">1</span>
              Acceptance of Terms
            </h2>
            <p>
              By accessing or using WaterSafeCheck.com (the &quot;Website&quot;), you acknowledge that you have read, understood, and agreed to be bound by these Terms of Service and our{' '}
              <Link href="/privacy" className="text-apple-blue font-semibold hover:underline">Privacy Policy</Link>. If you do not agree with any part of these Terms, you must discontinue use of the Website immediately.
            </p>
          </section>

          <section className="space-y-3 pt-6 border-t border-slate-100">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center">2</span>
              Description of Service
            </h2>
            <p>
              WaterSafeCheck provides a free public data interface for exploring municipal drinking water records across U.S. ZIP codes, cities, and states. We aggregate, process, and summarize public records published by the U.S. Environmental Protection Agency (EPA SDWIS, ECHO, and UCMR5) and municipal Consumer Confidence Reports (CCR).
            </p>
            <p className="text-slate-600 text-sm">
              Our safety grades, lead risk levels, water hardness metrics, and filter recommendations are analytical interpretations designed to help homeowners make informed water choices.
            </p>
          </section>

          <section className="space-y-3 pt-6 border-t border-slate-100">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center">3</span>
              Informational & Educational Use Only
            </h2>
            <p>
              All materials on this website are published solely for general informational and educational guidance. Nothing on WaterSafeCheck constitutes medical, toxicological, plumbing, engineering, or legal advice.
            </p>
            <p>
              Water quality varies by building age, internal plumbing fixtures, and seasonal shifts. Do not rely solely on this website for critical health decisions. If you suspect immediate contamination or notice an active boil-water notice, contact your municipal water authority or call the EPA Safe Drinking Water Hotline at <strong className="text-slate-900">1-800-426-4791</strong>.
            </p>
            <p>
              Please read our comprehensive{' '}
              <Link href="/disclaimer" className="text-apple-blue font-semibold hover:underline">Medical & Data Disclaimer</Link>.
            </p>
          </section>

          <section className="space-y-3 pt-6 border-t border-slate-100">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center">4</span>
              Intellectual Property & Fair Use
            </h2>
            <p>
              Underlying government datasets (such as EPA SDWIS violation logs) reside in the public domain. However, WaterSafeCheck’s unique site architecture, scoring algorithms, interactive widgets, editorial analyses, and visual representations are proprietary assets protected by copyright and intellectual property laws.
            </p>
            <p>
              You are permitted to quote, link, or reference our findings for non-commercial educational or journalistic purposes, provided you credit &quot;WaterSafeCheck (watersafecheck.com)&quot;. Systematic high-frequency web scraping or automated data extraction without prior written consent is strictly prohibited.
            </p>
          </section>

          <section className="space-y-3 pt-6 border-t border-slate-100">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center">5</span>
              User Conduct & Fair Use Guidelines
            </h2>
            <p>When utilizing our service, you agree not to:</p>
            <ul className="list-disc list-inside space-y-2 text-slate-600 pl-2 text-sm sm:text-base">
              <li>Launch denial-of-service attempts or overwhelm server infrastructure;</li>
              <li>Circumvent rate limiting or security perimeters;</li>
              <li>Misrepresent your identity as an official EPA or state regulator;</li>
              <li>Repackage our proprietary scoring engine for commercial software sales.</li>
            </ul>
          </section>

          <section className="space-y-3 pt-6 border-t border-slate-100">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center">6</span>
              Third-Party Links & Advertising
            </h2>
            <p>
              WaterSafeCheck displays standard third-party advertising via Google AdSense to fund ongoing server maintenance and research operations. Advertisements are served automatically by Google’s advertising networks.
            </p>
            <p>
              We do not endorse any specific commercial product, filter manufacturer, or private testing lab that may appear within Google Ad units. For details on how cookies power these services, review our{' '}
              <Link href="/privacy" className="text-apple-blue font-semibold hover:underline">Privacy Policy</Link>.
            </p>
          </section>

          <section className="space-y-3 pt-6 border-t border-slate-100">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center">7</span>
              Disclaimer of Warranties
            </h2>
            <p className="uppercase text-xs sm:text-sm font-semibold text-slate-600 tracking-wider">
              THE WEBSITE AND ALL MATERIALS ARE PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS. WATERSAFECHECK EXPRESSLY DISCLAIMS ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO FITNESS FOR A PARTICULAR PURPOSE, ACCURACY OF HISTORICAL REGULATORY RECORDS, AND FREEDOM FROM SERVICE INTERRUPTIONS.
            </p>
          </section>

          <section className="space-y-3 pt-6 border-t border-slate-100">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center">8</span>
              Limitation of Liability
            </h2>
            <p className="uppercase text-xs sm:text-sm font-semibold text-slate-600 tracking-wider">
              IN NO EVENT SHALL WATERSAFECHECK, ITS OPERATORS, DIRECTORS, OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES RESULTING FROM YOUR RELIANCE ON DATA PUBLISHED ON THIS PLATFORM OR ANY FAILURE OF MUNICIPAL WATER INFRASTRUCTURE.
            </p>
          </section>

          <section className="space-y-3 pt-6 border-t border-slate-100">
            <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center">9</span>
              Inquiries & Official Notice
            </h2>
            <p>
              For legal inquiries, copyright notices, or questions regarding these Terms, contact our legal desk directly:
            </p>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 text-sm">
              <p className="font-semibold text-slate-900">WaterSafeCheck Legal & Regulatory Desk</p>
              <p className="text-slate-600">Email: <a href="mailto:contact@watersafecheck.com" className="text-apple-blue font-semibold hover:underline">contact@watersafecheck.com</a></p>
              <p className="text-slate-600">Response Window: 2–3 Business Days</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
