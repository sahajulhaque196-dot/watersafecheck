// src/app/privacy/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy | WaterSafeCheck',
  description: 'Privacy policy for WaterSafeCheck.com — how we collect, use, and protect your information. We collect minimal data and never sell your personal information.',
  alternates: { canonical: 'https://www.watersafecheck.com/privacy' },
  robots: { index: true, follow: true },
}

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <nav className="mb-6 text-sm text-gray-500" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand-700">Home</Link>
        <span className="mx-2" aria-hidden="true">/</span>
        <span className="text-gray-800 font-medium" aria-current="page">Privacy Policy</span>
      </nav>

      <h1 className="text-3xl font-black text-gray-900 mb-2">Privacy Policy</h1>
      <p className="text-sm text-gray-400 mb-8">Last updated: January 1, 2025</p>

      <div className="space-y-8 text-sm text-gray-700 leading-relaxed">

        <div className="alert-info">
          <strong>Short version:</strong> We collect minimal information, we don't sell your data, and we use standard analytics and advertising tools (Google Analytics & AdSense). If you have questions, email us at{' '}
          <a href="mailto:contact@watersafecheck.com" className="underline font-medium">contact@watersafecheck.com</a>.
        </div>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">1. What We Collect</h2>
          <p className="mb-3">WaterSafeCheck.com collects only the information needed to operate the site:</p>
          <ul className="space-y-2 list-disc list-inside">
            <li><strong>Usage data:</strong> Google Analytics collects anonymized information — pages visited, time on site, browser type, referring URL. This data is aggregated and not linked to your identity.</li>
            <li><strong>ZIP code searches:</strong> We may log ZIP codes searched for analytics. We do not link searches to your identity or location.</li>
            <li><strong>Contact form:</strong> If you contact us, we collect your name, email, and message to respond to your inquiry. We store these in our email inbox only.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">2. Cookies</h2>
          <p className="mb-3">We use cookies for:</p>
          <ul className="space-y-2 list-disc list-inside">
            <li><strong>Google Analytics:</strong> Measures site traffic. Opt out at <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-brand-700 underline">Google Analytics Opt-out</a>.</li>
            <li><strong>Google AdSense:</strong> Serves advertisements. Ads may be personalized based on your browsing. Manage preferences at <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-brand-700 underline">Google Ad Settings</a>.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">3. Google AdSense & Third-Party Advertising</h2>
          <p className="mb-3">This site uses Google AdSense to display advertisements from third-party advertisers. Google and its advertising partners use cookies, web beacons, and similar tracking technologies to serve ads based on your prior visits to this site and other websites on the internet.</p>
          <p className="mb-3">Third-party vendors, including Google, use cookies to serve ads based on your prior visits to our website and other websites. Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to WaterSafeCheck.com and/or other sites on the Internet.</p>
          <p className="mb-3">We receive compensation when ads are displayed, which helps us keep WaterSafeCheck free for all users.</p>
          <p className="mb-3"><strong>To opt out of personalized advertising:</strong></p>
          <ul className="space-y-2 list-disc list-inside text-sm mb-3">
            <li>Visit <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-brand-700 underline">Google Ads Settings</a> to opt out of personalized ads from Google</li>
            <li>Visit <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-brand-700 underline">aboutads.info/choices</a> to opt out of interest-based advertising from participating companies</li>
            <li>Use the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-brand-700 underline">Google Analytics Opt-out Browser Add-on</a> to prevent Google Analytics from collecting your data</li>
            <li>Enable "Do Not Track" in your browser settings</li>
          </ul>
          <p>For more information about Google's privacy practices, see the <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-brand-700 underline">Google Privacy Policy</a>.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">4. How We Use Your Information</h2>
          <ul className="space-y-1 list-disc list-inside">
            <li>To operate and improve the site</li>
            <li>To understand which content is most useful to visitors</li>
            <li>To respond to contact inquiries</li>
            <li>To display relevant advertising through Google AdSense</li>
          </ul>
          <p className="mt-3"><strong>We do not sell, trade, or rent your personal information to any third party.</strong></p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">5. Data Retention</h2>
          <p>Analytics data is retained per Google Analytics default policies (26 months). Contact inquiries are retained for as long as needed to respond, then deleted. You can request deletion by emailing <a href="mailto:contact@watersafecheck.com" className="text-brand-700 underline">contact@watersafecheck.com</a>.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">6. Third-Party Links</h2>
          <p>We link to external sites including EPA.gov, echo.epa.gov, and others. We are not responsible for the privacy practices of these sites.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">7. Children's Privacy</h2>
          <p>This site is not directed at children under 13. We do not knowingly collect personal information from children. If you believe we have, contact us immediately.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">8. California Privacy Rights (CCPA)</h2>
          <p>California residents may request information about categories of personal data collected, request deletion, and opt out of data sales. We do not sell personal data. Contact us at <a href="mailto:contact@watersafecheck.com" className="text-brand-700 underline">contact@watersafecheck.com</a> to exercise your rights.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">9. Changes to This Policy</h2>
          <p>Material changes will be noted with an updated date at the top of this page. Continued use of the site after changes constitutes acceptance.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">10. Contact</h2>
          <p>
            Questions about privacy: <a href="mailto:contact@watersafecheck.com" className="text-brand-700 underline">contact@watersafecheck.com</a>
            {' '}or use our <Link href="/contact" className="text-brand-700 underline">contact form</Link>.
          </p>
        </section>
      </div>

        {/* FAQ Section */}
        <section className="mt-8 pt-6 border-t border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <div className="space-y-2">
            {[
              {
                q: 'Does WaterSafeCheck sell my personal data?',
                a: 'No. We do not sell, trade, or rent your personal information to any third party. We use anonymized analytics data only to improve the site experience.'
              },
              {
                q: 'Why do I see ads on WaterSafeCheck?',
                a: 'WaterSafeCheck is free to use. Advertising revenue through Google AdSense helps cover our operating costs. Ads are served based on your browsing history and interests by Google — we do not control which specific ads appear.'
              },
              {
                q: 'How can I stop seeing personalized ads?',
                a: 'Visit Google Ad Settings at adssettings.google.com to opt out of personalized advertising. You can also use the AdChoices opt-out at aboutads.info/choices.'
              },
              {
                q: 'Is my ZIP code search tracked?',
                a: 'ZIP code searches may be logged anonymously for analytics purposes — for example, to understand which areas are most searched. We do not link ZIP searches to your identity or location.'
              },
              {
                q: 'How do I request deletion of my data?',
                a: 'Email contact@watersafecheck.com with your request. We will delete any stored personal data associated with you (such as contact form submissions) within 30 days.'
              }
            ].map((item, i) => (
              <details key={i} className="border border-gray-100 rounded-xl overflow-hidden">
                <summary className="flex items-center justify-between px-5 py-3 cursor-pointer hover:bg-gray-50 transition-colors list-none select-none text-sm font-semibold text-gray-800">
                  {item.q}
                </summary>
                <div className="px-5 pb-4 pt-2 text-sm text-gray-600 leading-relaxed border-t border-gray-50">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </section>
    </div>
  )
}
