// src/components/layout/Footer.tsx
import Link from 'next/link'

const US_STATES_TOP = [
  ['Alabama','al'],['Arizona','az'],['California','ca'],['Colorado','co'],
  ['Florida','fl'],['Georgia','ga'],['Illinois','il'],['Indiana','in'],
  ['Michigan','mi'],['New Jersey','nj'],['New York','ny'],['North Carolina','nc'],
  ['Ohio','oh'],['Pennsylvania','pa'],['Tennessee','tn'],['Texas','tx'],
  ['Virginia','va'],['Washington','wa'],['Wisconsin','wi'],['Maryland','md'],
]

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main footer grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">

          {/* Brand column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 70 90" width="24" height="30" aria-hidden="true">
                <defs>
                  <linearGradient id="fShield" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#60a5fa" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
                <path d="M5 12 L35 2 L65 12 L65 48 Q65 70 35 85 Q5 70 5 48 Z" fill="url(#fShield)"/>
                <path d="M35 20 Q35 20 46 40 Q52 52 44 58 Q40 62 35 62 Q30 62 26 58 Q18 52 24 40 Q35 20 35 20 Z" fill="#bfdbfe" opacity="0.9"/>
                <polyline points="28,46 34,53 46,38" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="font-black text-white text-base tracking-tight">WaterSafeCheck</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Free EPA-verified drinking water quality data for 41,000+ U.S. ZIP codes. Know what's in your tap water before you drink it.
            </p>
            <a
              href="mailto:contact@watersafecheck.com"
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              contact@watersafecheck.com
            </a>
          </div>

          {/* Browse by State */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wide">
              Browse Water Quality by State
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-1">
              {US_STATES_TOP.map(([name, code]) => (
                <Link
                  key={code}
                  href={`/state/${code}`}
                  className="text-xs text-gray-400 hover:text-white transition-colors py-0.5 truncate"
                >
                  {name}
                </Link>
              ))}
            </div>
            <Link
              href="/"
              className="text-xs text-blue-400 hover:text-blue-300 mt-2 inline-block"
            >
              View all 50 states →
            </Link>
          </div>

          {/* Links column */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4 uppercase tracking-wide">Resources</h3>
            <ul className="space-y-2">
              {[
                ['/blog', 'Blog & Articles'],
              ['/water-quality-guide', 'Water Safety Guide'],
                ['/about', 'About & Our Team'],
                ['/contact', 'Contact Us'],
                ['/disclaimer', 'Disclaimer'],
                ['/privacy', 'Privacy Policy'],
              ['/disclaimer', 'Disclaimer'],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
              <li>
                <a href="https://www.epa.gov/ground-water-and-drinking-water" target="_blank" rel="noopener noreferrer"
                  className="text-sm text-gray-400 hover:text-white transition-colors">
                  EPA Safe Water ↗
                </a>
              </li>
              <li>
                <a href="https://echo.epa.gov" target="_blank" rel="noopener noreferrer"
                  className="text-sm text-gray-400 hover:text-white transition-colors">
                  EPA ECHO Database ↗
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Trust badges row */}
        <div className="border-t border-gray-800 pt-6 mb-6">
          <div className="flex flex-wrap gap-6 justify-center sm:justify-start">
            {[
              { icon: '🏛', text: 'Data from EPA SDWIS' },
              { icon: '🔬', text: 'UCMR5 PFAS Data Included' },
              { icon: '📋', text: 'Consumer Confidence Reports' },
              { icon: '🔒', text: 'No Registration Required' },
              { icon: '💰', text: '100% Free' },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-1.5 text-xs text-gray-500">
                <span>{icon}</span>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <p className="text-xs text-gray-600 leading-relaxed mb-3">
            <strong className="text-gray-500">Data Notice:</strong> WaterSafeCheck aggregates publicly available data from EPA SDWIS, EPA ECHO, UCMR5, and Consumer Confidence Reports. Data reflects historical compliance records and may not represent current conditions. Always contact your local water utility for current advisories. WaterSafeCheck is not affiliated with the EPA or any government agency.
          </p>
          <p className="text-xs text-gray-600 leading-relaxed mb-4">
            <strong className="text-gray-500">Not Medical Advice:</strong> Information on this site is for educational purposes only and does not constitute medical or legal advice. For urgent concerns, call the EPA Safe Drinking Water Hotline: <strong className="text-gray-400">1-800-426-4791</strong>.
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p className="text-xs text-gray-600">
              © {year} WaterSafeCheck.com · All rights reserved · Made with ❤️ for cleaner drinking water
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link href="/privacy" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">Privacy</Link>
              <Link href="/disclaimer" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">Disclaimer</Link>
              <Link href="/contact" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">Contact</Link>
              <Link href="/about" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">About</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
