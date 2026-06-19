'use client'

export function ContactForm() {
  return (
    <form
      action="https://formspree.io/f/meewenql"
      method="POST"
      onSubmit={(e) => {
        // Fallback: if Formspree not configured, open mailto
        const action = (e.currentTarget as HTMLFormElement).action;
        if (action.includes('YOUR_FORM_ID')) {
          e.preventDefault();
          const data = new FormData(e.currentTarget as HTMLFormElement);
          const subject = encodeURIComponent(`WaterSafeCheck: ${data.get('subject') || 'Contact'}`);
          const body = encodeURIComponent(`Name: ${data.get('name')}\nEmail: ${data.get('email')}\nZIP: ${data.get('zip')}\n\n${data.get('message')}`);
          window.location.href = `mailto:contact@watersafecheck.com?subject=${subject}&body=${body}`;
        }
      }}
      className="space-y-5"
    >
      <input type="hidden" name="_replyto" value="contact@watersafecheck.com" />
      <input type="hidden" name="_subject" value="WaterSafeCheck Contact Form" />
      <input type="text" name="_gotcha" className="hidden" aria-hidden="true" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Your Name <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Jane Smith"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-all"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Your Email <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="jane@example.com"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition-all"
          />
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
          What's this about? <span className="text-red-500" aria-hidden="true">*</span>
        </label>
        <select
          id="subject"
          name="subject"
          required
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 bg-white"
        >
          <option value="">Select a topic...</option>
          <option value="data-question">Question about my water quality data</option>
          <option value="data-correction">I think there's an error in the data</option>
          <option value="zip-missing">My ZIP code has no data</option>
          <option value="understand-report">Help understanding my water report</option>
          <option value="media">Media / press inquiry</option>
          <option value="other">Something else</option>
        </select>
      </div>

      <div>
        <label htmlFor="zip" className="block text-sm font-medium text-gray-700 mb-1">
          Your ZIP Code <span className="text-xs text-gray-400 font-normal">(optional — helps us look up your data)</span>
        </label>
        <input
          id="zip"
          name="zip"
          type="text"
          inputMode="numeric"
          maxLength={5}
          placeholder="e.g. 90210"
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
          Your Message <span className="text-red-500" aria-hidden="true">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          placeholder="Tell us what you're wondering about or what you found..."
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 resize-none"
        />
      </div>

      <button
        type="submit"
        className="btn-primary w-full py-3 text-base"
      >
        Send Message
      </button>

      <p className="text-xs text-gray-400 text-center">
        Or email us directly at{' '}
        <a href="mailto:contact@watersafecheck.com" className="text-brand-600 hover:underline">
          contact@watersafecheck.com
        </a>
      </p>
    </form>
  )
}
