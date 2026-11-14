// src/app/water-quality-guide/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { DisplayAd, InArticleAd, MultiplexAd } from '@/components/ui/AdSense'
import { SITE_URL, safeJsonLd } from '@/lib/seo'
import { GradeBadge, Breadcrumb, FaqItem } from '@/components/ui'
import { ShieldCheck, Beaker, Droplets, AlertTriangle, ArrowRight, Sparkles, Phone, ExternalLink, Bookmark, CheckCircle2, Search, ArrowUpRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'U.S. Tap Water Safety Guide — What EPA Data Really Means for Your Family',
  description: 'A plain-English guide to U.S. drinking water safety. Learn what EPA violations mean, how to read lead levels, what water grades tell you, filter recommendations, and when to worry about your tap water.',
  alternates: { canonical: `${SITE_URL}/water-quality-guide` },
  openGraph: {
    title: 'U.S. Tap Water Safety Guide — What EPA Data Really Means for Your Family',
    description: 'A plain-English guide to U.S. drinking water safety, EPA violations, lead limits, and filter recommendations by Sahajul Haque, founder of WaterSafeCheck.',
    type: 'article',
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do I know if my tap water is safe to drink?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Search your ZIP code at WaterSafeCheck.com for a free EPA-based water quality report. You can also request your annual Consumer Confidence Report from your water utility — it lists every contaminant tested and whether any exceeded safe limits.',
      },
    },
    {
      '@type': 'Question',
      name: 'What does an EPA drinking water violation mean?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A health-based violation means a water system exceeded the Maximum Contaminant Level (MCL) for a regulated contaminant at some point. It does not necessarily mean the water is currently unsafe, but it does mean the system has had documented problems. Utilities are required to notify customers when health-based violations occur.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is lead in tap water dangerous?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. There is no safe level of lead exposure for children. Lead at any detectable level can affect brain development. The EPA action level is 15 ppb, but the public health goal is zero. Homes built before 1986 are at higher risk due to lead pipes and solder.',
      },
    },
    {
      '@type': 'Question',
      name: 'What water filter removes lead?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Only filters certified to NSF/ANSI Standard 53 or Standard 58 (reverse osmosis) are verified to remove lead. Standard Brita-style pitcher filters (NSF/ANSI 42) reduce chlorine taste but are not certified for lead unless specifically labeled. Always check for NSF certification before buying.',
      },
    },
  ],
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'U.S. Tap Water Safety Guide — What EPA Data Really Means for Your Family',
  description: 'A comprehensive guide to understanding EPA drinking water safety data, lead levels, violations, and water quality grades.',
  image: [`${SITE_URL}/images/water-hero.jpg`],
  author: {
    '@type': 'Person',
    name: 'Sahajul Haque',
    jobTitle: 'Founder & Lead Platform Architect',
    url: `${SITE_URL}/about`,
    image: `${SITE_URL}/images/sahajul-haque.jpg`,
    sameAs: ['https://x.com/saddamh58509953', 'https://github.com/sahajulhaque196-dot'],
  },
  publisher: {
    '@type': 'Organization',
    name: 'WaterSafeCheck',
    url: SITE_URL,
    logo: { '@type': 'ImageObject', url: `${SITE_URL}/images/water-hero.jpg` },
  },
  datePublished: '2025-01-01',
  dateModified: '2026-08-27',
  mainEntityOfPage: `${SITE_URL}/water-quality-guide`,
}

const MCL_TABLE = [
  { name: 'Lead', mcl: '15 ppb (action level)', goal: '0', effect: 'Neurological impairment in children; renal damage', source: 'Corroded legacy plumbing; service mains' },
  { name: 'Arsenic', mcl: '0.010 mg/L', goal: '0', effect: 'Skin lesions; increased cancer risk', source: 'Geological deposits; agricultural runoff' },
  { name: 'Nitrate', mcl: '10 mg/L', goal: '10', effect: 'Methemoglobinemia (blue baby syndrome)', source: 'Fertilizer runoff; septic seepage' },
  { name: 'Total Trihalomethanes (TTHMs)', mcl: '0.080 mg/L', goal: 'n/a', effect: 'Liver/kidney toxicity; oncogenic risk', source: 'Chlorine disinfection byproduct' },
  { name: 'Haloacetic Acids (HAA5)', mcl: '0.060 mg/L', goal: 'n/a', effect: 'Increased oncogenic risk', source: 'Water chlorination byproduct' },
  { name: 'Copper', mcl: '1.3 mg/L (action level)', goal: '1.3', effect: 'Gastrointestinal distress; liver complications', source: 'Corrosion of copper plumbing' },
  { name: 'Fluoride', mcl: '4.0 mg/L', goal: '4.0', effect: 'Skeletal fluorosis; dental staining', source: 'Natural aquifers; municipal additive' },
  { name: 'Chromium (total)', mcl: '0.1 mg/L', goal: '0.1', effect: 'Allergic dermatitis', source: 'Industrial discharge; natural erosion' },
  { name: 'Barium', mcl: '2 mg/L', goal: '2', effect: 'Hypertension increase', source: 'Drilling waste; refinery discharges' },
  { name: 'E. coli', mcl: 'Zero tolerance', goal: '0', effect: 'Acute bacterial gastroenteritis', source: 'Human and livestock waste infiltration' },
  { name: 'Benzene', mcl: '0.005 mg/L', goal: '0', effect: 'Anemia; leukemia risk', source: 'Petroleum leaks; industrial effluents' },
  { name: 'Uranium', mcl: '30 µg/L', goal: '0', effect: 'Kidney toxicity; oncogenic risk', source: 'Natural mineral erosion' },
]

export default function WaterQualityGuidePage() {
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Water Safety Guide' },
  ]

  const guideSections = [
    { id: 'epa-regulations', title: '1. How the EPA Regulates Drinking Water' },
    { id: 'water-grades', title: '2. Understanding Water Grades (A–F)' },
    { id: 'lead-water', title: '3. Lead in Tap Water: The Full Picture' },
    { id: 'pfas', title: '4. PFAS "Forever Chemicals" Rules' },
    { id: 'disinfection-byproducts', title: '5. Disinfection Byproducts (TTHMs)' },
    { id: 'ccr', title: '6. Reading Consumer Confidence Reports' },
    { id: 'mcl-table', title: '7. EPA Contaminant Limits Table' },
    { id: 'water-filters', title: '8. Certified NSF Filter Systems' },
    { id: 'vulnerable-populations', title: '9. Infants & Vulnerable Groups' },
    { id: 'take-action', title: '10. Contacting EPA & Regulators' },
    { id: 'faqs', title: '11. Frequently Asked Questions' },
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(articleSchema) }}
      />

      <div className="min-h-screen bg-[#F5F5F7] text-slate-900 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <Breadcrumb items={breadcrumbs} />

          {/* ── Editorial Header Banner ── */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-white to-sky-50/50 p-6 sm:p-10 border border-slate-200/80 shadow-apple-card mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-apple-blue/10 text-apple-blue text-xs font-semibold tracking-wide mb-3">
              <Beaker className="w-3.5 h-3.5" />
              Comprehensive Educational Guide
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mb-3 leading-[1.12]">
              U.S. Tap Water Safety Guide
            </h1>
            <p className="text-base sm:text-xl text-slate-600 font-normal leading-relaxed mb-6 max-w-3xl">
              What EPA compliance records really mean for your family — and what evidence-backed steps every household should take.
            </p>

            {/* Author byline */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 border border-slate-200/70 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <Image
                  src="/images/sahajul-haque.jpg"
                  alt="Sahajul Haque"
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shadow-sm"
                />
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    Researched &amp; Authored by Sahajul Haque
                  </p>
                  <p className="text-xs text-slate-500">
                    Founder &amp; Lead Platform Architect &bull; WaterSafeCheck
                  </p>
                </div>
              </div>
              <div className="text-xs text-slate-400 font-medium hidden sm:block">
                Updated {new Date().getFullYear()} National Edition
              </div>
            </div>
          </div>

          {/* Ad 1: Top Hero High-Visibility Display Ad */}
          <DisplayAd className="my-6" />

          {/* ── 2-Column Responsive Layout with Sticky Sidebar ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* ── Left Column: Main In-Depth Guide (8 cols) ── */}
            <main className="lg:col-span-8 space-y-10">

              {/* Section 1: EPA Regulations */}
              <section id="epa-regulations" className="apple-card p-6 sm:p-8 bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/80 shadow-apple-card scroll-mt-24">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-4">
                  1. How the EPA Regulates Your Drinking Water
                </h2>
                <div className="prose-custom text-slate-600 space-y-4 text-sm sm:text-base leading-relaxed">
                  <p>
                    Most Americans receive drinking water from a community water utility that draws from surface reservoirs, lakes, or underground aquifers, treats the water, and pumps it through municipal mains. The U.S. Environmental Protection Agency (EPA) oversees these utilities under the landmark <strong>Safe Drinking Water Act (SDWA)</strong> of 1974.
                  </p>
                  <p>
                    The EPA sets mandatory thresholds — <strong>Maximum Contaminant Levels (MCLs)</strong> — for more than 90 contaminants. Public utilities serving 25 or more people must regularly sample their output and upload testing logs to the federal SDWIS database.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                  <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200/70">
                    <p className="font-bold text-emerald-900 mb-1.5 text-sm">MCLG — Public Health Goal</p>
                    <p className="text-xs text-emerald-800 leading-relaxed">
                      Non-enforceable target where zero biological or carcinogenic risk exists. For known carcinogens (lead, benzene, arsenic), the MCLG is set strictly to zero.
                    </p>
                  </div>
                  <div className="p-5 rounded-2xl bg-sky-50/70 border border-sky-200/70">
                    <p className="font-bold text-sky-900 mb-1.5 text-sm">MCL — Enforceable Legal Limit</p>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      Legally binding standard. Exceeding an MCL constitutes a federal health violation requiring corrective public disclosures and immediate remediation.
                    </p>
                  </div>
                </div>
              </section>

              {/* Section 2: Water Grades */}
              <section id="water-grades" className="apple-card p-6 sm:p-8 bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/80 shadow-apple-card scroll-mt-24">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-4">
                  2. Understanding Water Quality Grades (A–F)
                </h2>
                <p className="text-slate-600 mb-6 leading-relaxed text-sm sm:text-base">
                  WaterSafeCheck assigns a letter grade from A through F to each ZIP code based on EPA compliance scores (0–100):
                </p>

                <div className="space-y-3">
                  {[
                    { grade: 'A', score: '85–100', desc: 'Outstanding compliance history. Zero or minimal health-based violations over 5 years. Standard household precautions sufficient.' },
                    { grade: 'B', score: '70–84', desc: 'Good compliance with minor issues noted in historical monitoring. Carbon block filtration is a prudent choice for homes with young children.' },
                    { grade: 'C', score: '55–69', desc: 'Moderate compliance concerns. Multiple violations or elevated lead risk documented. Certified NSF/ANSI 53 filter recommended.' },
                    { grade: 'D', score: '40–54', desc: 'Substandard compliance. Repeat violations or unresolved alerts. Certified filtration strongly advised for cooking and drinking.' },
                    { grade: 'F', score: 'Below 40', desc: 'Critical compliance failures. Unresolved violations and enforcement actions. Reverse Osmosis (NSF 58) recommended immediately.' },
                  ].map(item => (
                    <div key={item.grade} className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 border border-slate-200/60 flex items-start gap-4">
                      <GradeBadge grade={item.grade} size="md" />
                      <div>
                        <p className="font-bold text-slate-900 text-sm mb-0.5">
                          Grade {item.grade} &bull; Score {item.score}
                        </p>
                        <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Section 3: Lead */}
              <section id="lead-water" className="apple-card p-6 sm:p-8 bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/80 shadow-apple-card scroll-mt-24">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-4">
                  3. Lead in Tap Water: The Full Picture
                </h2>
                <div className="prose-custom text-slate-600 space-y-4 mb-6 text-sm sm:text-base leading-relaxed">
                  <p>
                    Lead rarely enters drinking water at the reservoir or aquifer. Instead, it leaches directly from municipal lead service lines, lead solder in pre-1986 plumbing, and legacy brass valves.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-rose-50/70 border border-rose-200/80 mb-6">
                  <h3 className="font-bold text-rose-900 text-sm mb-3">EPA Action Thresholds</h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between border-b border-rose-200/60 pb-2">
                      <span className="font-medium text-rose-800">EPA Action Level</span>
                      <span className="font-bold text-rose-900">15 ppb</span>
                    </div>
                    <div className="flex justify-between border-b border-rose-200/60 pb-2">
                      <span className="font-medium text-rose-800">Public Health Goal (MCLG)</span>
                      <span className="font-bold text-rose-900">0 ppb</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-rose-800">AAP Pediatric Guidance</span>
                      <span className="font-bold text-rose-900">&lt; 1 ppb for infant formula</span>
                    </div>
                  </div>
                </div>

                <h3 className="font-bold text-slate-900 text-base mb-3">4 Essential Lead Safety Steps</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {[
                    { title: 'Morning Flush', text: 'Run cold tap water for 30–60 seconds before filling cups or kettles.' },
                    { title: 'Cold Water Only', text: 'Never use hot tap water for infant formula or cooking; heat accelerates lead leaching.' },
                    { title: 'NSF 53 Certification', text: 'Verify filters carry the independent NSF/ANSI 53 or 58 seal for lead reduction.' },
                    { title: 'In-Home Testing', text: 'Test your fixtures directly if your building was constructed prior to 1986.' },
                  ].map((step, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
                      <p className="font-bold text-slate-900 mb-1">{step.title}</p>
                      <p className="text-slate-500 leading-relaxed">{step.text}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Ad 3: In-Content Editorial Fluid Ad (Post-Lead) */}
              <InArticleAd className="my-8" />

              {/* Section 7: MCL Reference Table */}
              <section id="mcl-table" className="apple-card p-6 sm:p-8 bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/80 shadow-apple-card scroll-mt-24">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-4">
                  7. EPA Contaminant Limits &bull; Reference Table
                </h2>
                <p className="text-sm text-slate-500 mb-4 leading-relaxed">
                  Key regulated drinking water parameters, federal MCL thresholds, and health effects:
                </p>

                <div className="overflow-hidden rounded-2xl border border-slate-200/80 shadow-xs">
                  <div className="table-scroll overflow-x-auto">
                    <table className="w-full text-xs text-left border-collapse min-w-[550px]">
                      <thead>
                        <tr className="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200/70">
                          <th className="px-4 py-3">Contaminant</th>
                          <th className="px-4 py-3">EPA MCL</th>
                          <th className="px-4 py-3">Health Goal</th>
                          <th className="px-4 py-3">Health Impact</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {MCL_TABLE.map((row, i) => (
                          <tr key={i} className="hover:bg-slate-50/70">
                            <td className="px-4 py-3 font-bold text-slate-900 whitespace-nowrap">{row.name}</td>
                            <td className="px-4 py-3 font-mono text-apple-blue font-semibold whitespace-nowrap">{row.mcl}</td>
                            <td className="px-4 py-3 text-slate-400 font-mono">{row.goal}</td>
                            <td className="px-4 py-3 text-slate-600">{row.effect}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>

              {/* Ad 4: Post-MCL Table / Pre-Filters High-CTR Display Ad */}
              <DisplayAd className="my-8" />

              {/* Section 8: Certified Filters */}
              <section id="water-filters" className="apple-card p-6 sm:p-8 bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/80 shadow-apple-card scroll-mt-24">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-4">
                  8. Water Filters: Verified NSF Certification Standards
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { title: 'NSF/ANSI 42', subtitle: 'Aesthetic Chlorine & Odor', text: 'Certified to remove chlorine taste and sediment. Does NOT eliminate lead or PFAS unless certified under standard 53.' },
                    { title: 'NSF/ANSI 53', subtitle: 'Health Effects & Lead', text: 'Independently verified to reduce toxic heavy metals, lead, copper, and VOCs to safe human health thresholds.' },
                    { title: 'NSF/ANSI 58', subtitle: 'Reverse Osmosis Systems', text: 'Medical-grade multi-stage purification. Eliminates up to 99% of total dissolved solids, PFAS, nitrates, and lead.' },
                    { title: 'NSF/ANSI 401', subtitle: 'Emerging Compounds', text: 'Targets trace pharmaceuticals, microplastics, herbicides, and endocrine disruptors.' },
                  ].map((f, i) => (
                    <div key={i} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/60">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-slate-900 text-sm">{f.title}</h3>
                        <span className="badge text-[10px] bg-apple-blue/10 text-apple-blue font-bold">Certified</span>
                      </div>
                      <p className="text-xs font-semibold text-slate-600 mb-1">{f.subtitle}</p>
                      <p className="text-xs text-slate-500 leading-relaxed">{f.text}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Ad 5: In-Content Editorial Fluid Ad (Post-Filters) */}
              <InArticleAd className="my-8" />

              {/* Section 10: Regulatory Action */}
              <section id="take-action" className="apple-card p-6 sm:p-8 bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/80 shadow-apple-card scroll-mt-24">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-4">
                  10. Contacting EPA &amp; State Authorities
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-6 rounded-2xl bg-slate-950 text-white border border-slate-800">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                      EPA Safe Drinking Water Hotline
                    </p>
                    <p className="text-2xl font-black text-sky-400 mb-2">1-800-426-4791</p>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Monday–Friday &bull; 10 AM–4 PM Eastern &bull; Free official federal guidance service.
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/70">
                    <p className="font-bold text-slate-900 text-sm mb-3">Official Regulatory Portals</p>
                    <div className="space-y-2 text-xs">
                      <a href="https://www.epa.gov/ccr" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between text-apple-blue hover:underline">
                        <span>EPA Consumer Confidence Report (CCR)</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <a href="https://echo.epa.gov" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between text-apple-blue hover:underline">
                        <span>EPA ECHO Enforcement Records</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              </section>

              {/* Ad 7: Pre-FAQ High-Intent Display Ad */}
              <DisplayAd className="my-8" />

              {/* Section 11: FAQs */}
              <section id="faqs" className="apple-card p-6 sm:p-8 bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/80 shadow-apple-card scroll-mt-24">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-6">
                  11. Frequently Asked Questions
                </h2>
                <div className="space-y-3">
                  {[
                    {
                      q: 'How do I know if my tap water is safe to drink?',
                      a: 'Search your ZIP code at WaterSafeCheck for a free report based on EPA data. You should also request your annual Consumer Confidence Report from your water utility — it lists every contaminant tested and whether any exceeded safe limits.',
                    },
                    {
                      q: 'What does an EPA drinking water violation mean?',
                      a: 'A health-based violation means a water system exceeded the Maximum Contaminant Level (MCL) for a regulated contaminant at some point. It does not necessarily mean the water is currently unsafe, but it does mean the system has had documented compliance issues.',
                    },
                    {
                      q: 'Is lead in tap water dangerous for adults?',
                      a: 'Yes. Lead is most harmful to developing infants and children, but long-term adult exposure is linked to elevated blood pressure, cardiovascular strain, and renal dysfunction. The EPA and CDC consider zero to be the only safe exposure level.',
                    },
                    {
                      q: 'Can I rely solely on bottled water?',
                      a: 'Bottled water is regulated under FDA guidelines rather than the Safe Drinking Water Act, and some bottled products simply filter municipal tap water. Installing an NSF-certified point-of-use filter is generally more economical and produces far less plastic waste.',
                    },
                  ].map((faq, i) => (
                    <FaqItem key={i} q={faq.q} a={faq.a} open={i === 0} />
                  ))}
                </div>
              </section>

              {/* Bottom Action Card */}
              <div className="p-8 rounded-3xl bg-gradient-to-br from-blue-50/70 via-white to-sky-50/50 border border-blue-200/60 text-center shadow-apple-card">
                <h2 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">Check Your Local Tap Water Safety</h2>
                <p className="text-slate-500 text-sm mb-6 max-w-md mx-auto">
                  Get an instant EPA water compliance breakdown for your specific 5-digit ZIP code.
                </p>
                <Link href="/#search" className="btn-primary">
                  <span>Query Your ZIP Code</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </main>

            {/* ── Right Column: Sticky Sidebar (4 cols) ── */}
            <aside className="lg:col-span-4 sticky top-20 self-start space-y-6">
              {/* Ad 2: Sticky Sidebar Top Display Ad */}
              <DisplayAd className="my-2" style={{ minHeight: '250px' }} />

              {/* Sticky Table of Contents Directory */}
              <div className="apple-card p-5 sm:p-6 bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/80 shadow-apple-card">
                <div className="flex items-center gap-2 mb-4">
                  <Bookmark className="w-4 h-4 text-apple-blue" />
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                    Guide Directory
                  </h3>
                </div>
                <nav className="space-y-1 text-xs">
                  {guideSections.map((sec) => (
                    <a
                      key={sec.id}
                      href={`#${sec.id}`}
                      className="block px-3 py-2 rounded-xl text-slate-600 hover:text-apple-blue hover:bg-slate-50 transition-colors font-medium truncate"
                    >
                      {sec.title}
                    </a>
                  ))}
                </nav>
              </div>

              {/* Ad 6: Sticky Sidebar Mid Display Ad */}
              <DisplayAd className="my-2" style={{ minHeight: '250px' }} />

              {/* Hotline Callout */}
              <div className="apple-card p-5 bg-gradient-to-br from-amber-500/[0.08] to-amber-500/[0.02] border border-amber-300/40 rounded-3xl">
                <div className="flex items-center gap-2 text-amber-700 font-bold text-xs mb-2">
                  <Phone className="w-3.5 h-3.5" />
                  <span>EPA Safe Drinking Water Hotline</span>
                </div>
                <a href="tel:18004264791" className="text-xl font-extrabold text-amber-600 hover:text-amber-700 block mb-1">
                  1-800-426-4791
                </a>
                <p className="text-[11px] text-slate-500">
                  Mon–Fri, 10 AM–4 PM Eastern. Official federal advice.
                </p>
              </div>

              {/* Filter Quick Standards */}
              <div className="apple-card p-5 bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/80 shadow-apple-card text-xs">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-3">
                  Filter Standards Cheat Sheet
                </h4>
                <div className="space-y-2.5">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="font-bold text-apple-blue block">NSF 42</span>
                    <span className="text-slate-500 text-[11px]">Taste, chlorine, aesthetics only.</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="font-bold text-emerald-600 block">NSF 53</span>
                    <span className="text-slate-500 text-[11px]">Health limits: Lead, heavy metals, VOCs.</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="font-bold text-purple-600 block">NSF 58</span>
                    <span className="text-slate-500 text-[11px]">Reverse osmosis: PFAS, nitrates, 99% TDS.</span>
                  </div>
                </div>
              </div>

              {/* Instant Search Widget */}
              <div className="apple-card p-5 bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/80 shadow-apple-card text-center">
                <p className="font-bold text-slate-900 text-sm mb-1">Looking for your town?</p>
                <p className="text-xs text-slate-500 mb-4">Check lead &amp; compliance scores for your ZIP.</p>
                <Link
                  href="/#search"
                  className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-4 rounded-full bg-apple-blue hover:bg-blue-600 text-white font-semibold text-xs transition-all active:scale-[0.98]"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Search Any U.S. ZIP Code</span>
                </Link>
              </div>
            </aside>
          </div>

          {/* Ad 8: Bottom Native Multiplex Recommendations Grid */}
          <MultiplexAd className="my-10" />
        </div>
      </div>
    </>
  )
}
