// src/app/contact/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { Mail, Phone, Clock, ShieldAlert, HelpCircle, MessageSquare, ExternalLink, ArrowRight } from 'lucide-react'
import { ContactForm } from '@/components/sections/ContactForm'
import { SITE_URL } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Contact WaterSafeCheck — Data Questions, Corrections & Inquiries',
  description: 'Contact WaterSafeCheck for data questions, corrections, media inquiries, or general help understanding your tap water quality report. We respond within 1–2 business days.',
  alternates: { canonical: `${SITE_URL}/contact` },
  openGraph: {
    title: 'Contact WaterSafeCheck — Inquiries & Data Questions',
    description: 'Get in touch with the WaterSafeCheck editorial and environmental data analysis team.',
    url: `${SITE_URL}/contact`,
    type: 'website',
    siteName: 'WaterSafeCheck',
  },
  twitter: {
    card: 'summary',
    title: 'Contact WaterSafeCheck',
    description: 'Contact our data team for inquiries or corrections.',
  },
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F7] text-slate-900 pb-20">
      {/* Hero Header */}
      <div className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <nav className="mb-6 flex items-center space-x-2 text-xs font-semibold text-slate-500 uppercase tracking-wider" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-apple-blue transition-colors">Home</Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-900 font-bold" aria-current="page">Contact</span>
        </nav>

        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-apple-blue/10 text-apple-blue text-xs font-semibold tracking-wide mb-4">
            <MessageSquare className="w-3.5 h-3.5" />
            Support & Data Desk
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
            We’re here to help you understand your water.
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 font-normal leading-relaxed">
            Have questions about your local utility, spotted a data discrepancy, or need assistance interpreting your drinking water score? Reach our dedicated environmental analysis team.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          {/* Left Column: Direct channels (Sticky Sidebar) */}
          <aside className="lg:col-span-4 sticky top-20 self-start space-y-5">
            {/* Direct Email Card */}
            <div className="apple-card p-6 bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl shadow-apple-card transition-all hover:shadow-apple-card-hover">
              <div className="w-12 h-12 rounded-2xl bg-apple-blue/10 text-apple-blue flex items-center justify-center mb-4">
                <Mail className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 mb-1">Direct Support Inbox</h2>
              <p className="text-xs text-slate-500 mb-4">
                Every inquiry is personally reviewed by our data verification desk.
              </p>
              <a
                href="mailto:contact@watersafecheck.com"
                className="inline-flex items-center gap-2 text-sm font-semibold text-apple-blue hover:text-blue-700 transition-colors break-all"
              >
                contact@watersafecheck.com
                <ArrowRight className="w-4 h-4 shrink-0" />
              </a>
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Typical response: 1–2 business days
              </div>
            </div>

            {/* EPA Emergency Hotline Card */}
            <div className="apple-card p-6 bg-gradient-to-br from-amber-500/[0.06] to-amber-500/[0.02] backdrop-blur-xl border border-amber-300/40 rounded-3xl shadow-apple-card transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                  <Phone className="w-6 h-6" />
                </div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-700 text-[11px] font-bold uppercase tracking-wider">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Urgent Notice
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 mb-1">Immediate Water Hazard?</h2>
              <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                If your municipality issued an active boil water notice or you suspect chemical tampering, contact federal regulators immediately.
              </p>
              <div className="p-3 rounded-2xl bg-white border border-amber-200/60 shadow-sm mb-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">EPA Drinking Water Hotline</p>
                <a href="tel:18004264791" className="text-xl font-extrabold text-amber-600 hover:text-amber-700">
                  1-800-426-4791
                </a>
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">
                Mon–Fri, 10:00 AM – 4:00 PM Eastern. Free national toll-free guidance.
              </p>
            </div>

            {/* Verification link */}
            <div className="p-5 rounded-3xl bg-slate-100/70 border border-slate-200/60 text-xs text-slate-600">
              <p className="font-semibold text-slate-900 mb-1">Verify Federal Compliance Directly</p>
              <p className="mb-3 leading-relaxed">
                You can independently cross-reference any utility report against EPA ECHO records.
              </p>
              <a
                href="https://echo.epa.gov"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-bold text-apple-blue hover:underline"
              >
                Open EPA ECHO Database <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </aside>

          {/* Right Column: Interactive Form */}
          <div className="lg:col-span-8">
            <div className="apple-card p-6 sm:p-10 bg-white/90 backdrop-blur-2xl border border-slate-200/80 rounded-3xl shadow-apple-card">
              <div className="mb-6">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-1.5">
                  Send a Secure Message
                </h2>
                <p className="text-sm text-slate-500">
                  Submit your inquiry below. Our team receives submissions instantly at <strong className="text-slate-700">contact@watersafecheck.com</strong>.
                </p>
              </div>

              <ContactForm />
            </div>
          </div>
        </div>

        {/* Common Questions / FAQ Accordions */}
        <div className="apple-card p-6 sm:p-10 bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl shadow-apple-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900">Frequently Asked Questions</h2>
              <p className="text-xs text-slate-500">Instant answers before submitting a ticket</p>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {[
              {
                q: 'My ZIP code shows no utility record. Why?',
                a: 'A small percentage of ZIP codes cross complex water utility boundaries, or are serviced by private wells or small non-community systems that report under a parent administrative ID. Submit your ZIP and street name via the form above, and our analysts will trace the service jurisdiction for you.',
              },
              {
                q: 'I believe the score or violation record for my area is inaccurate. What is the correction protocol?',
                a: 'Please send us your ZIP code and the specific metric you believe is inaccurate. We will pull the raw EPA SDWIS audit log, verify if any recent corrective action has been completed, and update our public records within 48 hours if an official update was promulgated.',
              },
              {
                q: 'Can I cite WaterSafeCheck data in a research paper, thesis, or news report?',
                a: 'Yes. The underlying federal EPA data is in the public domain. When referencing our synthesis, scores, or charts, please cite: "WaterSafeCheck.com, based on EPA SDWIS and ECHO compliance datasets." For high-volume CSV exports or research collaborations, reach out to our team.',
              },
              {
                q: 'Does WaterSafeCheck sell or share my contact information?',
                a: 'Never. Contact submissions are strictly used to reply to your inquiry. We do not maintain marketing email lists or share user inquiries with third parties or filter vendors.',
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
