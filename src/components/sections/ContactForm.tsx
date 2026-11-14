'use client'

import { ArrowRight, Send } from 'lucide-react'

export function ContactForm() {
  return (
    <form
      action="https://formspree.io/f/meewenql"
      method="POST"
      onSubmit={(e) => {
        const action = (e.currentTarget as HTMLFormElement).action
        if (action.includes('YOUR_FORM_ID')) {
          e.preventDefault()
          const data = new FormData(e.currentTarget as HTMLFormElement)
          const subject = encodeURIComponent(`WaterSafeCheck: ${data.get('subject') || 'Contact'}`)
          const body = encodeURIComponent(`Name: ${data.get('name')}\nEmail: ${data.get('email')}\nZIP: ${data.get('zip')}\n\n${data.get('message')}`)
          window.location.href = `mailto:contact@watersafecheck.com?subject=${subject}&body=${body}`
        }
      }}
      className="space-y-4"
    >
      <input type="hidden" name="_replyto" value="contact@watersafecheck.com" />
      <input type="hidden" name="_subject" value="WaterSafeCheck Contact Form" />
      <input type="text" name="_gotcha" className="hidden" aria-hidden="true" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Your Name <span className="text-rose-500" aria-hidden="true">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Sarah Jenkins"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200/80 rounded-2xl text-sm font-medium text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-apple-blue/20 focus:border-apple-blue transition-all"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Email Address <span className="text-rose-500" aria-hidden="true">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="sarah@example.com"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200/80 rounded-2xl text-sm font-medium text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-apple-blue/20 focus:border-apple-blue transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="subject" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Topic <span className="text-rose-500" aria-hidden="true">*</span>
          </label>
          <select
            id="subject"
            name="subject"
            required
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200/80 rounded-2xl text-sm font-medium text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-apple-blue/20 focus:border-apple-blue transition-all"
          >
            <option value="">Select a subject...</option>
            <option value="data-question">Question about water quality data</option>
            <option value="data-correction">Data discrepancy / error report</option>
            <option value="zip-missing">ZIP code query / missing utility</option>
            <option value="understand-report">Assistance understanding report</option>
            <option value="media">Media / research inquiry</option>
            <option value="other">General feedback</option>
          </select>
        </div>

        <div>
          <label htmlFor="zip" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            ZIP Code <span className="text-[11px] font-normal text-slate-400">(optional)</span>
          </label>
          <input
            id="zip"
            name="zip"
            type="text"
            inputMode="numeric"
            maxLength={5}
            placeholder="e.g. 90210"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200/80 rounded-2xl text-sm font-medium text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-apple-blue/20 focus:border-apple-blue transition-all"
          />
        </div>
      </div>

      <div>
        <label htmlFor="message" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
          Your Message <span className="text-rose-500" aria-hidden="true">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          placeholder="How can we assist you with your water quality report?"
          className="w-full px-4 py-3 bg-slate-50 border border-slate-200/80 rounded-2xl text-sm font-medium text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-apple-blue/20 focus:border-apple-blue transition-all resize-none"
        />
      </div>

      <button
        type="submit"
        className="btn-primary w-full py-3.5 text-sm font-semibold flex items-center justify-center gap-2"
      >
        <span>Transmit Message</span>
        <Send className="w-4 h-4" />
      </button>

      <p className="text-xs text-slate-400 text-center pt-1">
        Direct inbox:{' '}
        <a href="mailto:contact@watersafecheck.com" className="text-apple-blue hover:underline">
          contact@watersafecheck.com
        </a>
      </p>
    </form>
  )
}
