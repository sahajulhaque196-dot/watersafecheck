// src/app/terms/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service | WaterSafeCheck',
  description: 'Terms of service and user agreement for WaterSafeCheck.com. Learn about our terms of use, content guidelines, disclaimers, and user responsibilities.',
  alternates: { canonical: 'https://www.watersafecheck.com/terms' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Terms of Service | WaterSafeCheck',
    description: 'Terms of service and user agreement for WaterSafeCheck.com.',
    url: 'https://www.watersafecheck.com/terms',
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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <nav className="mb-6 text-sm text-gray-500" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand-700">Home</Link>
        <span className="mx-2" aria-hidden="true">/</span>
        <span className="text-gray-800 font-medium" aria-current="page">Terms of Service</span>
      </nav>

      <h1 className="text-3xl font-black text-gray-900 mb-2">Terms of Service</h1>
      <p className="text-sm text-gray-400 mb-8">Last updated: January 1, 2026</p>

      <div className="space-y-8 text-sm text-gray-700 leading-relaxed">
        <div className="alert-info">
          <strong>Summary:</strong> By accessing and using WaterSafeCheck.com, you agree to these Terms of Service. WaterSafeCheck provides educational drinking water data based on public U.S. EPA records. We are an independent resource, not a government agency.
        </div>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">1. Acceptance of Terms</h2>
          <p>
            By accessing or using WaterSafeCheck.com (the &quot;Website&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;) and our{' '}
            <Link href="/privacy" className="text-brand-700 underline font-medium">Privacy Policy</Link>. If you do not agree with any part of these Terms, you must discontinue use of the Website immediately.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">2. Description of Service</h2>
          <p className="mb-3">
            WaterSafeCheck is an independent data analysis and public education project. We aggregate, process, and present publicly available data published by the U.S. Environmental Protection Agency (EPA), state environmental agencies, and public water utilities under the Safe Drinking Water Act (SDWA).
          </p>
          <p>
            Our service includes water safety grades, historical violation records, lead risk indicators, water hardness estimates, and water testing guidance for U.S. ZIP codes and municipalities.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">3. Informational & Educational Use Only</h2>
          <p className="mb-3">
            All content, data, guides, and scores provided on WaterSafeCheck are for general educational and informational purposes only. The information does not constitute medical, health, environmental engineering, or legal advice.
          </p>
          <p className="mb-3">
            Water quality conditions can change quickly due to seasonal variations, main breaks, or local infrastructure changes. Do not rely solely on this website for critical health or medical decisions. If you have immediate water contamination concerns, contact your local water utility or call the EPA Safe Drinking Water Hotline at <strong>1-800-426-4791</strong>.
          </p>
          <p>
            For more details, please review our full{' '}
            <Link href="/disclaimer" className="text-brand-700 underline font-medium">Disclaimer</Link>.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">4. Intellectual Property & Fair Use</h2>
          <p className="mb-3">
            The underlying government data sourced from EPA SDWIS, ECHO, and UCMR5 is in the public domain. However, the unique website design, compilation, proprietary scoring algorithms, editorial articles, graphics, and branding on WaterSafeCheck are protected by copyright and intellectual property laws.
          </p>
          <p>
            You may cite or link to our pages for journalistic, educational, or non-commercial research purposes with appropriate attribution to &quot;WaterSafeCheck (watersafecheck.com)&quot;. Automated mass scraping or unauthorized reproduction of entire datasets for commercial resale without prior written permission is prohibited.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">5. User Conduct & Prohibited Activities</h2>
          <p className="mb-2">When using our Website, you agree not to:</p>
          <ul className="space-y-1.5 list-disc list-inside">
            <li>Use the Website in any manner that could disable, overburden, or impair our servers or networks;</li>
            <li>Attempt to gain unauthorized access to any part of the Website or API endpoints;</li>
            <li>Use automated bots or scripts to disrupt normal website operation;</li>
            <li>Misrepresent your identity or affiliation with WaterSafeCheck or any government agency.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">6. Third-Party Links, Advertising & Affiliate Disclosure</h2>
          <p className="mb-3">
            WaterSafeCheck contains links to external third-party websites (such as EPA.gov, state water boards, and educational resources) as well as display advertisements served via Google AdSense and affiliate referral links (such as Amazon Associates) for certified water filtration and testing equipment.
          </p>
          <p className="mb-3">
            We are not responsible for the content, privacy policies, or commercial practices of third-party websites. When you click on third-party links or advertisements, you do so at your own risk.
          </p>
          <p>
            As an Amazon Associate, WaterSafeCheck may earn an affiliate commission from qualifying purchases through product links on our site, at no additional cost to the user.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">7. Disclaimer of Warranties</h2>
          <p className="mb-3">
            THE WEBSITE AND ALL CONTENT ARE PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.
          </p>
          <p>
            WE DO NOT WARRANT THAT THE DATA IS ERROR-FREE, UNINTERRUPTED, OR FREE OF TECHNICAL INACCURACIES, NOR DO WE WARRANT THE ACTUAL SAFETY OF ANY INDIVIDUAL TAP OR PRIVATE WELL.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">8. Limitation of Liability</h2>
          <p>
            TO THE FULLEST EXTENT PERMITTED BY LAW, WATERSAFECHECK AND ITS OPERATORS, EMPLOYEES, AND AFFILIATES SHALL NOT BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES RESULTING FROM YOUR USE OF OR INABILITY TO USE THE SITE.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">9. Modifications to Terms</h2>
          <p>
            We reserve the right to revise or update these Terms of Service at any time. Any changes will be posted on this page with an updated &quot;Last updated&quot; date. Continued use of the Website following any changes constitutes acceptance of the new Terms.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">10. Contact Us</h2>
          <p>
            If you have any questions or concerns regarding these Terms of Service, please contact us at{' '}
            <a href="mailto:contact@watersafecheck.com" className="text-brand-700 underline font-medium">contact@watersafecheck.com</a> or visit our{' '}
            <Link href="/contact" className="text-brand-700 underline font-medium">Contact Page</Link>.
          </p>
        </section>
      </div>
    </div>
  )
}
