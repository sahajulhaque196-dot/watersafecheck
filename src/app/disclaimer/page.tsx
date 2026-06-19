// src/app/disclaimer/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Disclaimer | WaterSafeCheck',
  description: 'Important disclaimer about WaterSafeCheck data — what we can and cannot tell you about your drinking water safety. Read before making health decisions.',
  alternates: { canonical: 'https://www.watersafecheck.com/disclaimer' },
}

export default function DisclaimerPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <nav className="mb-6 text-sm text-gray-500" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand-700">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800 font-medium" aria-current="page">Disclaimer</span>
      </nav>

      <h1 className="text-3xl font-black text-gray-900 mb-2">Disclaimer</h1>
      <p className="text-sm text-gray-400 mb-8">Last updated: January 1, 2025</p>

      <div className="space-y-8 text-sm text-gray-700 leading-relaxed">

        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
          <p className="font-bold text-yellow-900 text-base mb-2">Please Read Before Using This Site</p>
          <p className="text-yellow-800">
            WaterSafeCheck provides educational information only. It is not a substitute for professional water testing, medical advice, or direct communication with your water utility. If you have immediate concerns about your water safety, contact the EPA Safe Drinking Water Hotline at <strong>1-800-426-4791</strong> or your local water utility.
          </p>
        </div>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">1. Informational Purpose Only</h2>
          <p className="mb-3">
            WaterSafeCheck.com is an independent public information resource. The content on this website — including water quality grades, scores, violation summaries, and lead level data — is provided for general informational and educational purposes only.
          </p>
          <p>
            Nothing on this website constitutes medical advice, legal advice, engineering advice, or a professional assessment of the safety of any specific water supply. Do not make health decisions based solely on information from this site.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">2. Data Is Historical, Not Real-Time</h2>
          <p className="mb-3">
            All data on WaterSafeCheck is sourced from the U.S. EPA's Safe Drinking Water Information System (SDWIS), EPA ECHO database, UCMR5 monitoring data, and Consumer Confidence Reports filed by water utilities. This data reflects compliance records over a historical period (typically the past 5 years) and is updated periodically as new EPA data becomes available.
          </p>
          <p>
            Water quality can change rapidly. A water system with an excellent compliance record could have an active contamination event today that is not yet reflected in our data. Always check your water utility's current advisories and contact them directly for the most up-to-date information.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">3. We Do Not Test Water</h2>
          <p>
            WaterSafeCheck does not conduct independent water testing of any kind. All data shown on this site was collected and published by federal agencies. We aggregate, interpret, and present this public data in a user-friendly format. If you want to know the actual contaminant levels in the water coming out of your specific tap, you need to have your home's water independently tested by a certified laboratory.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">4. Data Accuracy Limitations</h2>
          <p className="mb-3">We make every effort to accurately represent EPA source data, but we cannot guarantee the accuracy, completeness, or timeliness of the information presented. Known limitations include:</p>
          <ul className="space-y-2 list-disc list-inside">
            <li>Some water systems span multiple ZIP codes, or multiple systems serve the same ZIP code. Data may not perfectly align with your specific address.</li>
            <li>Private well users are entirely outside the scope of SDWIS and are not represented in our data.</li>
            <li>Very small water systems (serving fewer than 25 people) may not be required to report to SDWIS.</li>
            <li>Utilities may underreport violations. Our data reflects what was reported, not necessarily all violations that occurred.</li>
            <li>Data processing errors may occur despite our best efforts to clean and validate EPA records.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">5. No Affiliation with EPA or Government</h2>
          <p>
            WaterSafeCheck is an independent website and is not affiliated with, endorsed by, or operated by the U.S. Environmental Protection Agency, any state environmental agency, or any government body. We use publicly available government data but are not a government resource.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">6. No Endorsement of Products or Services</h2>
          <p>
            Any mention of water filters, testing laboratories, or other products on this site is for informational purposes only. WaterSafeCheck does not endorse, recommend, or receive compensation for any specific products, brands, or services. Always research products independently and look for NSF International certification when purchasing water treatment equipment.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">7. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, WaterSafeCheck and its operators shall not be liable for any direct, indirect, incidental, consequential, or special damages arising from your use of or reliance on information presented on this site. This includes, without limitation, any health outcomes, property decisions, or financial decisions made based on information found on WaterSafeCheck.com.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-3">8. Contact & Corrections</h2>
          <p>
            If you believe any data on this site is inaccurate, please{' '}
            <Link href="/contact" className="text-brand-700 underline">contact us</Link> or email{' '}
            <a href="mailto:contact@watersafecheck.com" className="text-brand-700 underline">contact@watersafecheck.com</a>.
            We take data accuracy seriously and will investigate all reported errors promptly.
          </p>
        </section>

        <div className="bg-brand-50 border border-brand-100 rounded-xl p-5">
          <p className="font-semibold text-brand-900 mb-1">Questions About Your Water?</p>
          <p className="text-brand-800 text-sm">
            Call the <strong>EPA Safe Drinking Water Hotline: 1-800-426-4791</strong> (Mon–Fri, 10 AM–4 PM ET) or contact your local water utility directly. You can also{' '}
            <Link href="/" className="underline">search your ZIP code</Link> for your utility's contact information.
          </p>
        </div>

      </div>

        {/* FAQ */}
        <section className="mt-8 pt-6 border-t border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <div className="space-y-2">
            {[
              {
                q: 'Is WaterSafeCheck affiliated with the EPA or any government agency?',
                a: 'No. WaterSafeCheck is an independent website. We use publicly available EPA data but are not affiliated with, endorsed by, or operated by the U.S. Environmental Protection Agency or any state or local government agency.'
              },
              {
                q: 'Can I rely on WaterSafeCheck data to make health decisions?',
                a: 'Our data is for informational and educational purposes only. For health decisions, consult your healthcare provider and contact your water utility directly. For urgent water safety concerns, call the EPA Safe Drinking Water Hotline at 1-800-426-4791.'
              },
              {
                q: 'How current is the data on WaterSafeCheck?',
                a: "Our data reflects EPA records over a historical monitoring window (typically 5 years) and is updated periodically as EPA releases new data. It may not reflect real-time conditions. Always check your utility's current advisories for the most up-to-date information."
              },
              {
                q: 'What should I do if I think my water quality data is wrong?',
                a: 'Contact us at contact@watersafecheck.com with the ZIP code and the specific data you believe is incorrect. We compare against original EPA source data and correct genuine errors. You can also verify directly at echo.epa.gov.'
              },
              {
                q: 'Does WaterSafeCheck test water?',
                a: 'No. We do not conduct any independent water testing. All data comes from official EPA databases — SDWIS, ECHO, UCMR5, and Consumer Confidence Reports filed by water utilities.'
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
