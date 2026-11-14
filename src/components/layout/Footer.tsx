// src/components/layout/Footer.tsx
import Link from 'next/link'
import { ShieldCheck, ArrowUpRight } from 'lucide-react'

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
    <footer className="bg-[#12141a] text-slate-400 border-t border-slate-800/80 antialiased">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-12">
        {/* Main 4-column Apple Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand & Purpose Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-sky-400 flex items-center justify-center shadow-md">
                <svg viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" fill="white" fillOpacity="0.2" />
                  <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                </svg>
              </div>
              <span className="font-bold text-white text-base tracking-tight">WaterSafeCheck</span>
            </div>

            <p className="text-[13px] text-slate-400 leading-relaxed max-w-sm">
              Free, independent EPA SDWIS drinking water compliance records for 41,000+ U.S. ZIP codes. Built to give every household crystal-clear insight into their tap water before they drink.
            </p>

            <div className="pt-2 text-xs text-slate-400 space-y-1">
              <div>
                Platform engineered by{' '}
                <Link href="/about" className="text-white hover:text-sky-300 font-medium underline underline-offset-4 transition-colors">
                  Sahajul Haque
                </Link>{' '}
                (Assam, India).
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1">
                <a
                  href="mailto:contact@watersafecheck.com"
                  className="text-sky-400 hover:text-sky-300 transition-colors break-all"
                >
                  contact@watersafecheck.com
                </a>
                <span className="text-slate-600 hidden xs:inline">&bull;</span>
                <a
                  href="https://x.com/saddamh58509953"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-0.5 text-sky-400 hover:text-sky-300 transition-colors"
                >
                  <span>@saddamh58509953</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Directory States */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-semibold text-xs tracking-wider uppercase mb-4 text-slate-200">
              Browse by State
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2 text-xs">
              {US_STATES_TOP.map(([name, code]) => (
                <Link
                  key={code}
                  href={`/state/${code}`}
                  className="text-slate-400 hover:text-white transition-colors truncate"
                >
                  {name}
                </Link>
              ))}
            </div>
            <Link
              href="/#states"
              className="text-xs text-sky-400 hover:text-sky-300 font-medium mt-3 inline-block transition-colors"
            >
              Explore all 50 states &rarr;
            </Link>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-xs tracking-wider uppercase mb-4 text-slate-200">
              Resources & Legal
            </h3>
            <ul className="space-y-2 text-xs">
              {[
                ['/water-quality-guide', 'Water Safety Guide'],
                ['/blog', 'Research & Articles'],
                ['/about', 'Methodology & Team'],
                ['/contact', 'Contact Us'],
                ['/terms', 'Terms of Service'],
                ['/disclaimer', 'Data Disclaimer'],
                ['/privacy', 'Privacy Policy'],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="text-slate-400 hover:text-white transition-colors block py-0.5">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Disclaimer & Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/60 text-[11px] text-slate-400 space-y-3">
          <p className="leading-relaxed">
            <strong className="text-slate-400 font-medium">Official Notice:</strong> WaterSafeCheck is an independent public interest data aggregator. All testing data and violation records are sourced from public disclosures by the U.S. Environmental Protection Agency (EPA SDWIS) and municipal Consumer Confidence Reports. WaterSafeCheck is not affiliated with or endorsed by the EPA or any government utility.
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-slate-400">
            <div>
              &copy; {year} WaterSafeCheck. All rights reserved.
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Verified Public Domain Data
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
