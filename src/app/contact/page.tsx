// src/app/contact/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { ContactForm } from '@/components/sections/ContactForm'

export const metadata: Metadata = {
  title: 'Contact WaterSafeCheck — Data Questions, Corrections & Inquiries',
  description: 'Contact WaterSafeCheck for data questions, corrections, media inquiries, or general help understanding your tap water quality report. We respond within 1–2 business days.',
  alternates: { canonical: 'https://www.watersafecheck.com/contact' },
}

export default function ContactPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <nav className="mb-6 text-sm text-gray-500" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand-700">Home</Link>
        <span className="mx-2" aria-hidden="true">/</span>
        <span className="text-gray-800 font-medium" aria-current="page">Contact</span>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-2">Contact Us</h1>
      <p className="text-gray-500 mb-8 text-lg">
        Questions, corrections, or just want to understand your water report better? We're here.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Left column: Direct contact info */}
        <div className="lg:col-span-1 space-y-4">
          <div className="card border-brand-100 bg-brand-50">
            <div className="text-2xl mb-2">📧</div>
            <h2 className="font-bold text-gray-900 mb-1">Email Us Directly</h2>
            <a
              href="mailto:contact@watersafecheck.com"
              className="text-brand-700 font-semibold hover:underline break-all"
            >
              contact@watersafecheck.com
            </a>
            <p className="text-xs text-gray-500 mt-2">
              We read every email personally. Typical response: 1–2 business days.
            </p>
          </div>
          <div className="card border-gray-100">
            <div className="text-2xl mb-2">📞</div>
            <h2 className="font-bold text-gray-900 mb-1">Urgent Water Safety?</h2>
            <p className="text-brand-700 font-bold text-lg">1-800-426-4791</p>
            <p className="text-xs text-gray-500 mt-1">
              EPA Safe Drinking Water Hotline<br />
              Mon–Fri, 10 AM–4 PM Eastern
            </p>
          </div>
        </div>

        {/* Right column: Contact form card */}
        <div className="lg:col-span-2 card">
          <h2 className="font-bold text-gray-900 mb-1">Send Us a Message</h2>
          <p className="text-sm text-gray-500 mb-5">
            This form sends directly to <strong>contact@watersafecheck.com</strong>. You can also email us there directly.
          </p>
          <ContactForm />
        </div>
      </div>

      {/* FAQ for contact page */}
      <div className="card border-gray-100 mb-6">
        <h2 className="font-bold text-gray-900 mb-4">Common Questions</h2>
        <div className="space-y-4 text-sm">
          <div>
            <p className="font-semibold text-gray-800 mb-1">My ZIP code shows no data. Why?</p>
            <p className="text-gray-600">
              A small number of ZIP codes may fall between water system service boundaries, or be served by very small systems that report under a parent utility ID. Contact us with your ZIP and we'll investigate. You can also try searching your city name or a neighboring ZIP code.
            </p>
          </div>
          <div className="border-t border-gray-50 pt-4">
            <p className="font-semibold text-gray-800 mb-1">I think the data for my area is wrong. What should I do?</p>
            <p className="text-gray-600">
              Send us the ZIP code and what you believe is incorrect. We'll compare against the original EPA source data and update if there's an error. You can also verify directly at{' '}
              <a href="https://echo.epa.gov" target="_blank" rel="noopener noreferrer" className="text-brand-700 underline">echo.epa.gov</a>.
            </p>
          </div>
          <div className="border-t border-gray-50 pt-4">
            <p className="font-semibold text-gray-800 mb-1">Can I use WaterSafeCheck data in my news article or research?</p>
            <p className="text-gray-600">
              Yes — the underlying EPA data is public domain. Please attribute "WaterSafeCheck, based on EPA SDWIS and ECHO data." For research partnerships or data exports, email us directly.
            </p>
          </div>
          <div className="border-t border-gray-50 pt-4">
            <p className="font-semibold text-gray-800 mb-1">How quickly do you respond?</p>
            <p className="text-gray-600">
              We typically respond within 1–2 business days. For urgent water safety concerns (contamination advisory, active boil water notice), please contact the EPA hotline at 1-800-426-4791 rather than waiting for our reply.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
