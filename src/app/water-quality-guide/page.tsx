// src/app/water-quality-guide/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import Script from 'next/script'
import { AdTop, AdInContent, AdBottom } from '@/components/ui/AdSense'

export const metadata: Metadata = {
  title: 'U.S. Tap Water Safety Guide — What EPA Data Really Means for Your Family',
  description: 'A plain-English guide to U.S. drinking water safety. Learn what EPA violations mean, how to read lead levels, what water grades tell you, filter recommendations, and when to worry about your tap water.',
  alternates: { canonical: 'https://www.watersafecheck.com/water-quality-guide' },
  openGraph: {
    title: 'U.S. Tap Water Safety Guide — What EPA Data Really Means for Your Family',
    description: 'A plain-English guide to U.S. drinking water safety written by an EPA compliance analyst with 10 years of experience.',
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
  author: {
    '@type': 'Person',
    name: 'Marcus J. Webb',
    url: 'https://www.watersafecheck.com/about',
  },
  publisher: {
    '@type': 'Organization',
    name: 'WaterSafeCheck',
    url: 'https://www.watersafecheck.com',
  },
  datePublished: '2024-01-01',
  dateModified: '2025-01-01',
  mainEntityOfPage: 'https://www.watersafecheck.com/water-quality-guide',
}

const MCL_TABLE = [
  { name: 'Lead', mcl: '15 ppb (action level)', goal: '0', effect: 'Brain damage in children; kidney problems', source: 'Corroded plumbing; lead service lines' },
  { name: 'Arsenic', mcl: '0.010 mg/L', goal: '0', effect: 'Skin damage; increased cancer risk', source: 'Natural deposits; agriculture runoff' },
  { name: 'Nitrate', mcl: '10 mg/L', goal: '10', effect: 'Blue baby syndrome in infants', source: 'Fertilizer runoff; septic systems' },
  { name: 'Total Trihalomethanes (TTHMs)', mcl: '0.080 mg/L', goal: 'n/a', effect: 'Liver/kidney problems; increased cancer risk', source: 'Disinfection byproduct (chlorine + organic matter)' },
  { name: 'Haloacetic Acids (HAA5)', mcl: '0.060 mg/L', goal: 'n/a', effect: 'Increased cancer risk', source: 'Disinfection byproduct' },
  { name: 'Copper', mcl: '1.3 mg/L (action level)', goal: '1.3', effect: 'Gastrointestinal distress; liver damage', source: 'Corrosion of plumbing' },
  { name: 'Fluoride', mcl: '4.0 mg/L', goal: '4.0', effect: 'Bone disease; dental fluorosis in children', source: 'Natural deposits; added for dental health' },
  { name: 'Chromium (total)', mcl: '0.1 mg/L', goal: '0.1', effect: 'Allergic dermatitis', source: 'Industrial discharge; natural erosion' },
  { name: 'Barium', mcl: '2 mg/L', goal: '2', effect: 'Blood pressure increase', source: 'Drilling waste; metal refineries' },
  { name: 'E. coli', mcl: 'Zero tolerance', goal: '0', effect: 'Severe gastrointestinal illness', source: 'Human and animal fecal waste' },
  { name: 'Benzene', mcl: '0.005 mg/L', goal: '0', effect: 'Anemia; increased cancer risk', source: 'Industrial discharge; fuel leaks' },
  { name: 'Uranium', mcl: '30 µg/L', goal: '0', effect: 'Increased cancer risk; kidney damage', source: 'Natural rock deposits' },
]

export default function WaterQualityGuidePage() {
  return (
    <>
      <Script id="faq-schema" type="application/ld+json" strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Script id="article-schema" type="application/ld+json" strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-gray-500" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-brand-700">Home</Link>
          <span className="mx-2" aria-hidden="true">/</span>
          <span className="text-gray-800 font-medium" aria-current="page">Water Safety Guide</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3 leading-tight">
            U.S. Tap Water Safety Guide
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed mb-4">
            What EPA data really means — and what you should actually do about it.
          </p>
          {/* Author byline — EEAT */}
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="w-10 h-10 rounded-full bg-brand-700 flex items-center justify-center text-white font-black text-base flex-shrink-0">M</div>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                Written by Marcus J. Webb
              </p>
              <p className="text-xs text-gray-500">
                Environmental Data Analyst · 10 years EPA compliance research ·
                <Link href="/about" className="text-brand-600 hover:underline ml-1">About the author →</Link>
              </p>
            </div>
            <div className="ml-auto text-xs text-gray-400 hidden sm:block">
              Updated Jan 2025
            </div>
          </div>
        </div>

        {/* Table of Contents */}
        <div className="card bg-blue-50 border-blue-100 mb-10">
          <h2 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide">In This Guide</h2>
          <ol className="space-y-1.5">
            {[
              ['How the EPA Regulates Your Drinking Water', '#epa-regulations'],
              ['Understanding Water Quality Grades (A–F)', '#water-grades'],
              ['Lead in Tap Water: The Full Picture', '#lead-water'],
              ['PFAS "Forever Chemicals" — The New Concern', '#pfas'],
              ['Disinfection Byproducts: THMs and HAA5s', '#disinfection-byproducts'],
              ['How to Read Your Consumer Confidence Report', '#ccr'],
              ['EPA Contaminant Limits — Reference Table', '#mcl-table'],
              ['Water Filters: What Actually Works', '#water-filters'],
              ['Infants, Pregnant Women & Vulnerable Populations', '#vulnerable-populations'],
              ['When to Call the EPA or Your State', '#take-action'],
              ['Frequently Asked Questions', '#faqs'],
            ].map(([label, href], i) => (
              <li key={href} className="flex gap-2">
                <span className="text-brand-400 text-sm font-bold flex-shrink-0">{i + 1}.</span>
                <a href={href} className="text-sm text-brand-700 hover:underline">{label}</a>
              </li>
            ))}
          </ol>
        </div>

        <AdTop />

        {/* ── Section 1: EPA Regulations ── */}
        <section id="epa-regulations" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">1. How the EPA Regulates Your Drinking Water</h2>

          <p className="text-gray-700 leading-relaxed mb-4">
            Most Americans get their water from a public water system — a utility that draws from a lake, river, or underground aquifer, then treats it and pipes it to homes and businesses. The U.S. Environmental Protection Agency (EPA) regulates these systems under the <strong>Safe Drinking Water Act (SDWA)</strong>, which has been federal law since 1974.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            Under the SDWA, the EPA sets legal limits — called <strong>Maximum Contaminant Levels (MCLs)</strong> — for over 90 contaminants. Every public water system serving at least 25 people must test for these contaminants on a regular schedule and report the results to the EPA. If a system exceeds an MCL, that's a <strong>health-based violation</strong> — and they're legally required to notify customers.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            Here's something important that most people don't realize: the EPA actually sets two numbers for each contaminant. The first is the <strong>Maximum Contaminant Level Goal (MCLG)</strong> — the level at which there is truly no known health risk. For carcinogens like lead, benzene, and arsenic, the MCLG is <em>zero</em>. The second is the actual enforceable MCL, which is set as close to the MCLG as "feasible" given available treatment technology and cost.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="bg-green-50 border border-green-100 rounded-xl p-5">
              <p className="font-bold text-green-800 mb-2 text-sm">MCLG — The Ideal Level</p>
              <p className="text-sm text-green-700 leading-relaxed">Non-enforceable public health goal. Zero for carcinogens. This is what the EPA would ideally like to see in your water — but achieving it isn't always technically or economically possible for every system.</p>
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
              <p className="font-bold text-blue-800 mb-2 text-sm">MCL — The Legal Limit</p>
              <p className="text-sm text-blue-700 leading-relaxed">Legally enforceable. Exceeding the MCL is a federal violation. Systems must notify customers and take corrective action. Think of it as the threshold where the law steps in — not the threshold at which water becomes safe.</p>
            </div>
          </div>

          <p className="text-gray-700 leading-relaxed">
            This distinction matters. A water system that's technically "in compliance" — no MCL violations — can still have detectable levels of contaminants that health experts consider problematic. That's why WaterSafeCheck looks at multiple factors, not just whether a system has had violations.
          </p>
        </section>

        {/* ── Section 2: Water Grades ── */}
        <section id="water-grades" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Understanding Water Quality Grades (A–F)</h2>

          <p className="text-gray-700 leading-relaxed mb-4">
            WaterSafeCheck assigns each ZIP code a letter grade from A to F based on a composite safety score (0–100). The grade is a quick summary — but it's always worth clicking through to see the specific factors behind it.
          </p>

          <div className="space-y-3 mb-5">
            {[
              { grade: 'A', score: '85–100', bg: 'bg-green-600', light: 'bg-green-50 border-green-100', text: 'text-green-800', sub: 'text-green-700', desc: 'Excellent compliance record. No or very few health-based violations in the past five years. Low lead risk. If your ZIP has an A, your water meets all EPA standards with room to spare. Standard precautions are enough for most households.' },
              { grade: 'B', score: '70–84', bg: 'bg-blue-600', light: 'bg-blue-50 border-blue-100', text: 'text-blue-800', sub: 'text-blue-700', desc: 'Good compliance with minor issues. A couple of violations on record, or moderate lead risk, but generally the system is well-managed. A carbon block filter for drinking water is a reasonable precaution for families with young children.' },
              { grade: 'C', score: '55–69', bg: 'bg-yellow-500', light: 'bg-yellow-50 border-yellow-100', text: 'text-yellow-800', sub: 'text-yellow-700', desc: 'Some compliance concerns. Multiple violations or elevated lead risk. This doesn\'t mean the water is currently unsafe, but it means the system has had real documented problems. I\'d recommend a certified NSF/ANSI 53 filter for drinking water in homes with children.' },
              { grade: 'D', score: '40–54', bg: 'bg-orange-500', light: 'bg-orange-50 border-orange-100', text: 'text-orange-800', sub: 'text-orange-700', desc: 'Poor compliance. Multiple health violations, elevated lead risk, or unresolved violations. Use a certified water filter for all drinking and cooking water. Request the most recent Consumer Confidence Report and contact your utility to ask what corrective actions have been taken.' },
              { grade: 'F', score: 'Below 40', bg: 'bg-red-600', light: 'bg-red-50 border-red-100', text: 'text-red-800', sub: 'text-red-700', desc: 'Serious and recurring compliance failures. Failing systems typically have multiple unresolved violations and/or enforcement actions. Install a certified reverse osmosis filter immediately. Do not give unfiltered water to children or pregnant women. Contact the EPA hotline.' },
            ].map(({ grade, score, bg, light, text, sub, desc }) => (
              <div key={grade} className={`flex gap-4 items-start p-4 rounded-xl border ${light}`}>
                <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${bg} text-white font-black text-xl flex items-center justify-center shadow-sm`}>
                  {grade}
                </div>
                <div>
                  <p className={`font-bold ${text} mb-1`}>Grade {grade} — Score {score}</p>
                  <p className={`text-sm ${sub} leading-relaxed`}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <AdInContent />

        {/* ── Section 3: Lead ── */}
        <section id="lead-water" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Lead in Tap Water: The Full Picture</h2>

          <p className="text-gray-700 leading-relaxed mb-4">
            Of all the contaminants I've tracked over the years, lead is the one that worries me most — not because it's the most common, but because of what it does at very low levels and how easy it is to miss.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            Unlike most contaminants, lead in drinking water usually doesn't come from the source — it comes from your own home's plumbing. Lead service lines (the pipes that connect the main water line to your house), lead solder used to join copper pipes, and older brass fixtures can all leach lead into water, especially when the water sits in the pipes for several hours.
          </p>

          <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-5">
            <h3 className="font-bold text-red-900 mb-3">What the Numbers Mean</h3>
            <div className="space-y-2 text-sm text-red-800">
              <div className="flex justify-between border-b border-red-100 pb-2">
                <span className="font-medium">EPA action level</span>
                <span className="font-bold">15 ppb</span>
              </div>
              <div className="flex justify-between border-b border-red-100 pb-2">
                <span className="font-medium">EPA public health goal (MCLG)</span>
                <span className="font-bold">0 ppb</span>
              </div>
              <div className="flex justify-between border-b border-red-100 pb-2">
                <span className="font-medium">AAP / pediatric guidance</span>
                <span className="font-bold">&lt; 1 ppb for infant formula</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">CDC safe level for children</span>
                <span className="font-bold">None — no safe level</span>
              </div>
            </div>
            <p className="text-xs text-red-700 mt-3">
              The EPA "action level" of 15 ppb is not a safety threshold — it's the trigger level at which utilities must take action. The public health goal has always been zero.
            </p>
          </div>

          <h3 className="text-lg font-bold text-gray-900 mb-3">Five Things You Can Do Right Now</h3>
          <ol className="space-y-3 text-sm text-gray-700">
            {[
              { n: '1', title: 'Flush your tap in the morning', body: 'Run cold water for 30–60 seconds before using it for drinking or cooking — especially after it\'s been sitting overnight. This flushes lead-contaminated water that sat in your pipes out of the system.' },
              { n: '2', title: 'Use cold water only for drinking and cooking', body: 'Hot water dissolves lead from pipes much faster than cold. Never use hot tap water to make formula, cook pasta, or fill a kettle for drinking.' },
              { n: '3', title: 'Get a certified filter', body: 'NSF/ANSI Standard 53 certified filters are independently tested to remove lead. Look for the NSF mark on the packaging — don\'t trust marketing claims alone. Reverse osmosis systems (NSF/ANSI 58) also remove lead.' },
              { n: '4', title: 'Test your specific tap', body: 'Utility-wide lead data doesn\'t tell you what\'s coming out of your faucet. Your own plumbing matters more. Many state health departments offer free or low-cost lead testing kits. It\'s the only way to know for sure.' },
              { n: '5', title: 'Check if your home has lead service lines', body: 'Homes built before 1986 are most at risk. Contact your water utility — they are now required to identify and inventory lead service lines. If you have one, ask about replacement programs; many utilities offer them for free.' },
            ].map(({ n, title, body }) => (
              <li key={n} className="flex gap-3 p-4 bg-gray-50 rounded-xl">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-brand-700 text-white text-sm font-black flex items-center justify-center">{n}</span>
                <div>
                  <p className="font-semibold text-gray-800 mb-1">{title}</p>
                  <p className="text-gray-600 leading-relaxed">{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* ── Section 4: PFAS ── */}
        <section id="pfas" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">4. PFAS "Forever Chemicals" — The New Concern</h2>

          <p className="text-gray-700 leading-relaxed mb-4">
            PFAS (per- and polyfluoroalkyl substances) are a group of over 12,000 synthetic chemicals that have been used in manufacturing since the 1940s. They're in nonstick cookware, water-resistant clothing, food packaging, stain-resistant carpet treatments, and — crucially for water quality — in the firefighting foam used at airports and military bases for decades.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            They're called "forever chemicals" because the carbon-fluorine bond they're built on is one of the strongest in all of chemistry. These compounds don't break down in the environment, and they accumulate in the human body over time — a process called bioaccumulation.
          </p>

          <div className="bg-purple-50 border border-purple-200 rounded-xl p-5 mb-5">
            <h3 className="font-bold text-purple-900 mb-2">The 2024 EPA Rule — A Historic Change</h3>
            <p className="text-sm text-purple-800 leading-relaxed mb-3">
              In April 2024, the EPA finalized the first-ever federal drinking water standards for PFAS. The new MCLs for PFOA and PFOS are set at <strong>4 parts per trillion (ppt)</strong> — among the lowest regulatory limits ever set for any contaminant. Water systems have until 2029 to comply.
            </p>
            <p className="text-sm text-purple-800 leading-relaxed">
              The EPA's own analysis estimates this rule will prevent tens of thousands of serious illnesses, including bladder cancer, kidney cancer, testicular cancer, thyroid disease, and immune system disorders linked to long-term PFAS exposure.
            </p>
          </div>

          <p className="text-gray-700 leading-relaxed mb-4">
            Standard water filters — including most pitcher-style filters like Brita — do not reliably remove PFAS. The technologies that work are <strong>granular activated carbon (GAC)</strong>, <strong>reverse osmosis</strong>, and <strong>high-pressure membrane filtration (nanofiltration)</strong>. Look for filters specifically certified by NSF International for PFAS removal.
          </p>
        </section>

        {/* ── Section 5: DBPs ── */}
        <section id="disinfection-byproducts" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Disinfection Byproducts: THMs and HAA5s</h2>

          <p className="text-gray-700 leading-relaxed mb-4">
            Here's the water quality paradox that most people don't know about: the chlorine utilities add to kill dangerous bacteria can itself create new contaminants. When chlorine reacts with naturally occurring organic matter in source water — decaying leaves, algae, soil runoff — it forms compounds called <strong>disinfection byproducts (DBPs)</strong>.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            The two groups regulated by the EPA are <strong>Total Trihalomethanes (TTHMs)</strong> and <strong>Haloacetic Acids (HAA5s)</strong>. These are most common in surface water systems that treat water from rivers and lakes, where there's more organic material to react with. DBP violations are among the most common health-based violations in the EPA database — which is one reason they show up so often in C and D-graded systems.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <div className="card border-yellow-100">
              <p className="font-bold text-gray-900 mb-1 text-sm">Total Trihalomethanes (TTHMs)</p>
              <p className="text-xs text-gray-500 mb-2">EPA limit: 0.080 mg/L</p>
              <p className="text-sm text-gray-700">Includes chloroform and three related compounds. Long-term exposure above EPA limits is linked to bladder cancer and adverse pregnancy outcomes. Most common in surface water systems with high organic content.</p>
            </div>
            <div className="card border-orange-100">
              <p className="font-bold text-gray-900 mb-1 text-sm">Haloacetic Acids (HAA5s)</p>
              <p className="text-xs text-gray-500 mb-2">EPA limit: 0.060 mg/L</p>
              <p className="text-sm text-gray-700">Five chlorinated and brominated acetic acids that form alongside THMs. Also linked to increased cancer risk with long-term exposure above MCLs. Often exceed limits in the same systems as TTHMs.</p>
            </div>
          </div>

          <p className="text-gray-700 leading-relaxed text-sm">
            <strong>Practical tip:</strong> Letting tap water sit uncovered in a pitcher or open container for 30–60 minutes allows some volatile THMs to evaporate. This helps with taste and reduces some exposure — but it doesn't remove HAA5s or most other contaminants. A carbon block filter certified to NSF/ANSI 42 or 53 is more reliable.
          </p>
        </section>

        <AdInContent />

        {/* ── Section 6: CCR ── */}
        <section id="ccr" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">6. How to Read Your Consumer Confidence Report</h2>

          <p className="text-gray-700 leading-relaxed mb-4">
            Every public water utility in the United States is required by law to send customers an annual <strong>Consumer Confidence Report (CCR)</strong> — sometimes called a Water Quality Report or Annual Drinking Water Quality Report — by July 1 each year. If you're a renter, your landlord is required to give it to you.
          </p>

          <p className="text-gray-700 leading-relaxed mb-4">
            The CCR is the most detailed source of water quality information available for your specific water system. It contains measured contaminant levels, not just whether violations occurred. Here's what to look for when you receive one:
          </p>

          <div className="space-y-3 mb-5">
            {[
              { label: 'Contaminant column', detail: 'Lists every regulated contaminant tested. A long list doesn\'t mean bad water — it means thorough testing.' },
              { label: 'MCLG column', detail: 'The public health goal (zero for carcinogens). This tells you the ideal level, not the legal limit.' },
              { label: 'MCL or TT column', detail: 'The legally enforceable limit. Compare to the "Level Detected" column. If detected is higher, that\'s a violation — and should be noted elsewhere in the report.' },
              { label: 'Level Detected column', detail: 'The actual measured amount in your water during the testing period. This is what matters for your health assessment.' },
              { label: 'Range of Detections', detail: 'Shows the lowest and highest levels measured across multiple test samples. A wide range can indicate inconsistency in the system.' },
              { label: 'Violation column', detail: 'Usually a "Yes/No" field. If "Yes," the report must include an explanation of health effects and what the utility is doing about it.' },
            ].map((item, i) => (
              <div key={i} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-brand-600 flex-shrink-0 mt-0.5">→</span>
                <div>
                  <span className="font-semibold text-gray-800 text-sm">{item.label}: </span>
                  <span className="text-sm text-gray-600">{item.detail}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="alert-info">
            <strong>How to get your CCR:</strong> Contact your water utility directly, check their website, or search the EPA's CCR database at{' '}
            <a href="https://www.epa.gov/ccr" target="_blank" rel="noopener noreferrer" className="underline font-medium">epa.gov/ccr</a>.
            If you can't find it, call the EPA Safe Drinking Water Hotline at 1-800-426-4791.
          </div>
        </section>

        {/* ── Section 7: MCL Table ── */}
        <section id="mcl-table" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">7. EPA Contaminant Limits — Reference Table</h2>

          <p className="text-gray-700 leading-relaxed mb-5 text-sm">
            Key regulated contaminants, their EPA MCLs, public health goals, health effects, and common sources. This covers the contaminants most commonly found in violation records. The EPA regulates over 90 contaminants in total.
          </p>

          <div className="table-scroll rounded-xl border border-gray-100 overflow-hidden">
            <table className="w-full text-xs sm:text-sm border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-brand-800 text-white text-xs uppercase tracking-wide">
                  <th className="text-left px-3 py-3">Contaminant</th>
                  <th className="text-left px-3 py-3">EPA MCL</th>
                  <th className="text-left px-3 py-3 hidden sm:table-cell">Health Goal</th>
                  <th className="text-left px-3 py-3">Health Effects</th>
                  <th className="text-left px-3 py-3 hidden md:table-cell">Common Sources</th>
                </tr>
              </thead>
              <tbody>
                {MCL_TABLE.map((row, i) => (
                  <tr key={i} className={`border-b border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <td className="px-3 py-3 font-semibold text-gray-900 whitespace-nowrap">{row.name}</td>
                    <td className="px-3 py-3 font-mono text-xs text-brand-700 whitespace-nowrap">{row.mcl}</td>
                    <td className="px-3 py-3 text-xs text-gray-500 hidden sm:table-cell">{row.goal}</td>
                    <td className="px-3 py-3 text-gray-600 text-xs">{row.effect}</td>
                    <td className="px-3 py-3 text-gray-400 text-xs hidden md:table-cell">{row.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-3">
            Source: EPA National Primary Drinking Water Regulations. MCLs in mg/L unless noted. See{' '}
            <a href="https://www.epa.gov/ground-water-and-drinking-water/national-primary-drinking-water-regulations" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-600">epa.gov</a>{' '}
            for the complete list of 90+ regulated contaminants.
          </p>
        </section>

        {/* ── Section 8: Filters ── */}
        <section id="water-filters" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Water Filters: What Actually Works</h2>

          <p className="text-gray-700 leading-relaxed mb-5">
            The most important thing I can tell you about water filters: the marketing is often misleading. A filter that "improves taste" is not the same as one that removes lead. The only way to know if a filter does what it claims is to look for certification from <strong>NSF International</strong> or the <strong>Water Quality Association (WQA)</strong> — independent organizations that actually test filters in labs.
          </p>

          <div className="space-y-4 mb-5">
            {[
              {
                type: 'Pitcher Filters (Brita, PUR, ZeroWater)',
                std: 'NSF/ANSI 42 or 53',
                color: 'border-blue-100',
                removes: 'Chlorine taste & odor, some metals — BUT only removes lead if specifically NSF/ANSI 53 certified. Most standard Brita filters are 42 only.',
                doesnt: 'PFAS, nitrates, bacteria, most heavy metals (without 53 certification)',
                best: 'Improving taste in good-quality water. Not reliable for serious contamination concerns.',
              },
              {
                type: 'Under-Sink Carbon Block Filters',
                std: 'NSF/ANSI 53',
                color: 'border-green-100',
                removes: 'Chlorine, THMs, VOCs, and lead (when NSF/ANSI 53 certified). More effective than pitcher filters due to longer contact time.',
                doesnt: 'PFAS (unless specifically certified), nitrates, arsenic, fluoride',
                best: 'Families with moderate contamination concerns. Good middle-ground option.',
              },
              {
                type: 'Reverse Osmosis (RO) Systems',
                std: 'NSF/ANSI 58',
                color: 'border-brand-100',
                removes: 'Lead, arsenic, nitrates, PFAS, fluoride, most dissolved solids, and more. The most comprehensive residential option available.',
                doesnt: 'Some VOCs without a carbon post-filter. Also wastes 3–4 gallons of water for every 1 gallon filtered.',
                best: 'Anyone in a D or F graded area, or with specific contaminant concerns. Install under the sink for drinking and cooking water.',
              },
              {
                type: 'Whole-House Filters',
                std: 'NSF/ANSI 42, 53, or 61',
                color: 'border-gray-200',
                removes: 'Sediment, chlorine, and some heavy metals — depends heavily on the specific filter type.',
                doesnt: 'Not a substitute for point-of-use filtration for serious contaminant concerns. Effectiveness varies widely.',
                best: 'Protecting appliances and reducing chlorine throughout the house. Use alongside an under-sink filter for drinking water.',
              },
            ].map((f, i) => (
              <div key={i} className={`card border ${f.color}`}>
                <div className="flex flex-wrap items-start gap-2 mb-3">
                  <h3 className="font-bold text-gray-900 flex-1 text-sm sm:text-base">{f.type}</h3>
                  <span className="badge bg-brand-50 text-brand-700 border-brand-100 text-xs flex-shrink-0">{f.std}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-3">
                  <div>
                    <p className="text-green-700 font-semibold mb-1">✓ Removes:</p>
                    <p className="text-gray-600 leading-relaxed text-xs">{f.removes}</p>
                  </div>
                  <div>
                    <p className="text-red-600 font-semibold mb-1">✕ Does NOT remove:</p>
                    <p className="text-gray-600 leading-relaxed text-xs">{f.doesnt}</p>
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-50">
                  <p className="text-xs text-gray-500"><strong>Best for:</strong> {f.best}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Section 9: Vulnerable ── */}
        <section id="vulnerable-populations" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Infants, Pregnant Women & Vulnerable Populations</h2>

          <p className="text-gray-700 leading-relaxed mb-5">
            The same water that's safe for a healthy adult can pose real risks for certain populations. When I worked in compliance, the questions that kept me up at night were never about the average healthy adult — they were about the families who had no idea their water system had a lead problem.
          </p>

          <div className="space-y-4">
            {[
              {
                icon: '👶',
                title: 'Infants and Babies Fed Formula',
                color: 'bg-red-50 border-red-100',
                titleColor: 'text-red-900',
                bodyColor: 'text-red-800',
                body: "Infants' brains develop at a rate that makes lead exposure especially dangerous. Formula-fed babies are at higher risk than breastfed babies because they consume so much water relative to their body weight. If your ZIP code shows any lead detection — even below the action level — use water certified for infant use or a certified NSF/ANSI 53 or 58 filtered water for mixing formula. Never use hot tap water. If there's a boil water advisory, boil and cool water before use.",
              },
              {
                icon: '🤰',
                title: 'Pregnant Women',
                color: 'bg-purple-50 border-purple-100',
                titleColor: 'text-purple-900',
                bodyColor: 'text-purple-800',
                body: 'Lead crosses the placental barrier and can affect fetal brain development. Nitrates at high levels can interfere with oxygen transport. PFAS exposure during pregnancy is linked to reduced fetal growth and altered immune development in the child. Women who are pregnant or planning to become pregnant should check their ZIP code report carefully and consider using filtered water if lead risk is elevated.',
              },
              {
                icon: '🏥',
                title: 'Immunocompromised Individuals',
                color: 'bg-orange-50 border-orange-100',
                titleColor: 'text-orange-900',
                bodyColor: 'text-orange-800',
                body: 'People undergoing chemotherapy, organ transplant recipients, those living with HIV/AIDS, and elderly individuals with weakened immune systems face heightened risk from microbial contaminants. During or after any boil water advisory, or if your system has had recent E. coli or Giardia violations, use boiled or filtered water exclusively. Talk to your healthcare provider about specific precautions for your situation.',
              },
              {
                icon: '👴',
                title: 'Elderly Adults',
                color: 'bg-yellow-50 border-yellow-100',
                titleColor: 'text-yellow-900',
                bodyColor: 'text-yellow-800',
                body: 'Kidney function declines with age, which affects the body\'s ability to process and eliminate some contaminants. Elderly adults are also at higher risk from microbial contamination. If you\'re caring for an elderly parent or relative, check their water report — especially if they\'re in an area with aging infrastructure.',
              },
            ].map((item, i) => (
              <div key={i} className={`rounded-xl border p-5 ${item.color}`}>
                <h3 className={`font-bold ${item.titleColor} mb-2 flex items-center gap-2`}>
                  <span>{item.icon}</span> {item.title}
                </h3>
                <p className={`text-sm ${item.bodyColor} leading-relaxed`}>{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Section 10: Take Action ── */}
        <section id="take-action" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">10. When to Call the EPA or Your State</h2>

          <p className="text-gray-700 leading-relaxed mb-5">
            Most water quality issues are handled by your local utility without any need to escalate. But there are situations where you should go directly to regulators.
          </p>

          <div className="space-y-4 mb-6">
            {[
              { when: 'Your utility hasn\'t sent a required violation notice', action: 'Contact your state drinking water agency. Utilities are legally required to notify customers within 24 hours (acute health risks) or 30 days (other violations).' },
              { when: 'You\'ve reported a problem and your utility isn\'t responding', action: 'File a complaint with your state primacy agency. If that doesn\'t help, contact the EPA regional office for your area.' },
              { when: 'Your water looks, smells, or tastes unusual', action: 'Stop drinking it and contact your utility immediately. Unusual color (brown, yellow, blue-green) or odor can indicate treatment failures or contamination.' },
              { when: 'There\'s a boil water advisory in your area', action: 'Follow the advisory strictly. Boil water for at least 1 minute (3 minutes at elevations over 6,500 feet) before drinking, brushing teeth, or preparing food. Don\'t shower in water with a boil advisory if you have open wounds.' },
              { when: 'You\'re on a private well', action: 'The EPA and Safe Drinking Water Act don\'t cover private wells. You\'re responsible for testing your own water. Test annually for coliform bacteria and nitrates at minimum, more if you have specific concerns.' },
            ].map((item, i) => (
              <div key={i} className="flex gap-3 p-4 border border-gray-100 rounded-xl">
                <span className="flex-shrink-0 text-brand-600 font-bold text-sm mt-0.5">→</span>
                <div>
                  <p className="font-semibold text-gray-800 text-sm mb-1">{item.when}</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.action}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-brand-50 border border-brand-100 rounded-xl p-5">
              <p className="font-bold text-brand-900 mb-1">📞 EPA Safe Drinking Water Hotline</p>
              <p className="text-2xl font-black text-brand-700 mb-1">1-800-426-4791</p>
              <p className="text-xs text-brand-600">Monday–Friday · 10 AM–4 PM Eastern · Free service</p>
            </div>
            <div className="card border-gray-100">
              <p className="font-bold text-gray-900 mb-2 text-sm">Useful Links</p>
              <ul className="space-y-1.5 text-sm">
                {[
                  ['EPA CCR Database', 'https://www.epa.gov/ccr'],
                  ['EPA ECHO (Violations)', 'https://echo.epa.gov'],
                  ['Find Your State Agency', 'https://www.epa.gov/drink/contact'],
                  ['Private Well Guide', 'https://www.epa.gov/privatewells'],
                ].map(([label, href]) => (
                  <li key={href}>
                    <a href={href} target="_blank" rel="noopener noreferrer"
                      className="text-brand-700 hover:underline flex items-center gap-1">
                      {label} <span className="text-xs">↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ── FAQs ── */}
        <section id="faqs" className="mb-12 scroll-mt-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">11. Frequently Asked Questions</h2>
          <div className="space-y-2">
            {[
              {
                q: 'How do I know if my tap water is safe?',
                a: 'Search your ZIP code at WaterSafeCheck for a free report based on EPA data. You should also request your annual Consumer Confidence Report from your water utility — it\'s the most detailed source of information specific to your system. If you have specific health concerns, consider having your tap water independently tested by a certified lab.',
              },
              {
                q: 'What does an EPA water violation actually mean?',
                a: 'A health-based violation means your water system exceeded the Maximum Contaminant Level for a regulated contaminant at some point. It doesn\'t automatically mean the water is currently unsafe — systems often resolve violations quickly. But repeated or unresolved violations are a serious warning sign. Administrative violations (late reports, missing paperwork) don\'t indicate a health risk directly but suggest management problems.',
              },
              {
                q: 'Is lead in my water dangerous if I\'m an adult?',
                a: 'Lead is most harmful to children, but it\'s not harmless for adults. Long-term lead exposure in adults is linked to increased blood pressure, kidney damage, and cognitive effects. The EPA and CDC consider zero to be the safe level for all ages. If your area has elevated lead levels, a certified NSF/ANSI 53 filter is a good investment for the whole family.',
              },
              {
                q: 'Can I just drink bottled water instead?',
                a: 'Bottled water is regulated by the FDA, not the EPA — and FDA standards are generally less stringent than EPA tap water standards. Some bottled water is simply filtered municipal tap water. A quality in-home filter is usually cheaper, produces less plastic waste, and is at least as safe. That said, certified bottled water is a reasonable short-term solution during an active contamination event or boil water advisory.',
              },
              {
                q: 'How often is this data updated?',
                a: 'We update our database when the EPA releases new SDWIS and ECHO data, typically on a quarterly basis. Consumer Confidence Report data is updated annually. Our most recent data snapshot is from 2024. Water quality can change between updates — always check your utility\'s current website for active advisories.',
              },
              {
                q: 'My water tastes or smells weird. Should I be worried?',
                a: 'Unusual taste or odor doesn\'t always indicate a health problem — chlorine taste is normal and harmless. But if you notice a sudden change in color (brown, yellow, blue-green), a sharp chemical smell, or a rotten egg odor that\'s new, stop using the water and contact your utility immediately. Some dangerous contaminants have no taste or odor at all, so don\'t rely on your senses as the only indicator of safety.',
              },
            ].map((faq, i) => (
              <details key={i} className="border border-gray-100 rounded-xl overflow-hidden">
                <summary className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors select-none">
                  <span className="font-semibold text-gray-800 text-sm sm:text-base pr-4">{faq.q}</span>
                  <span className="flex-shrink-0 text-brand-600 text-xl font-light" aria-hidden="true">+</span>
                </summary>
                <div className="px-5 pb-5 pt-2 text-sm text-gray-700 leading-relaxed border-t border-gray-50">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gradient-to-br from-brand-800 to-brand-700 text-white rounded-2xl p-8 text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Check Your ZIP Code Now</h2>
          <p className="text-blue-100 mb-5 text-sm">
            Get a full water quality report — grade, lead levels, violations, contaminants — for your specific ZIP code. Free, no sign-up required.
          </p>
          <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-brand-800 font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-md">
            🔍 Check My Water Quality
          </Link>
        </div>

        <AdBottom />
      </div>
    </>
  )
}
