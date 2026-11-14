// src/app/blog/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { blogArticles } from '@/data/blog-articles'
import { DisplayAd, InArticleAd, MultiplexAd } from '@/components/ui/AdSense'
import { Breadcrumb } from '@/components/ui'
import { HomeSearch } from '@/components/sections/HomeSearch'
import { SITE_URL } from '@/lib/seo'
import { Sparkles, ArrowRight, BookOpen, Clock, Search, Phone, ShieldCheck, Tag } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Drinking Water Safety Blog — Tips, Guides & Research',
  description: 'Expert articles on tap water safety, lead contamination, PFAS chemicals, water filters, well water testing, and understanding your EPA water quality data. Researched and compiled by Sahajul Haque, founder of WaterSafeCheck.',
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: {
    title: 'Drinking Water Safety Blog | WaterSafeCheck',
    description: 'Expert articles on tap water safety, lead, PFAS, water filters, and EPA water quality data.',
    type: 'website',
  },
}

const CATEGORY_COLORS: Record<string, string> = {
  'Water Safety': 'bg-sky-50 text-apple-blue border border-sky-100',
  'Water Quality': 'bg-emerald-50 text-emerald-700 border border-emerald-100',
  'Contaminants': 'bg-rose-50 text-rose-700 border border-rose-100',
  'Water Filters': 'bg-indigo-50 text-indigo-700 border border-indigo-100',
  'Well Water': 'bg-amber-50 text-amber-700 border border-amber-100',
}

export default function BlogPage() {
  const featured = blogArticles[0]
  const rest = blogArticles.slice(1)

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Blog & Research' },
  ]

  const allTags = Array.from(new Set(blogArticles.flatMap(a => a.tags))).slice(0, 16)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={breadcrumbs} />

      <div className="mb-8 max-w-3xl">
        <span className="badge bg-apple-blue/10 text-apple-blue mb-3">
          <BookOpen className="w-3.5 h-3.5 mr-1" />
          Editorial &amp; Research
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-3">
          Drinking Water Intelligence
        </h1>
        <p className="text-base sm:text-lg text-slate-500 font-normal leading-relaxed">
          Plain-English investigations into municipal compliance logs, filtration technology, and water safety science — researched by Sahajul Haque.
        </p>
      </div>

      {/* Ad 1: Top Hero High-Visibility Display Ad */}
      <DisplayAd className="my-6" />

      {/* 2-Column Responsive Layout with Sticky Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ── Left Column: Articles Stream (8 cols) ── */}
        <main className="lg:col-span-8 space-y-10">
          {/* Featured Article — Apple News Magazine Card */}
          <Link href={`/blog/${featured.slug}`} className="block group">
            <article className="card p-7 sm:p-9 bg-gradient-to-br from-blue-50/50 via-white to-sky-50/30 border border-blue-200/60 hover:shadow-apple-card-hover transition-all duration-300">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="badge bg-apple-blue text-white shadow-xs">
                  Featured Analysis
                </span>
                <span className={`badge ${CATEGORY_COLORS[featured.category] ?? 'bg-slate-100 text-slate-700'}`}>
                  {featured.category}
                </span>
                <span className="text-xs text-slate-400 font-medium flex items-center gap-1 ml-auto">
                  <Clock className="w-3.5 h-3.5" />
                  {featured.readTime}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3 group-hover:text-apple-blue transition-colors leading-[1.22] tracking-tight">
                {featured.title}
              </h2>

              <p className="text-slate-600 leading-relaxed mb-6 text-sm sm:text-base line-clamp-3">
                {featured.intro.slice(0, 260)}...
              </p>

              <div className="flex items-center justify-between pt-5 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-2.5">
                  <Image
                    src="/images/sahajul-haque.jpg"
                    alt={featured.author}
                    width={28}
                    height={28}
                    className="w-7 h-7 rounded-full object-cover border border-slate-200"
                  />
                  <span className="font-semibold text-slate-800">{featured.author}</span>
                  <span className="text-slate-400">&bull;</span>
                  <time dateTime={featured.publishDate} className="text-slate-400">
                    {new Date(featured.publishDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </time>
                </div>

                <span className="font-bold text-apple-blue flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Read Article</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </article>
          </Link>

          {/* Ad 2: Mid-Feed In-Article Ad */}
          <InArticleAd className="my-6" />

          {/* Article Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {rest.map((article) => (
              <Link key={article.slug} href={`/blog/${article.slug}`} className="block group">
                <article className="card p-5 h-full hover:shadow-apple-card-hover transition-all duration-200 flex flex-col active:scale-[0.98]">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`badge ${CATEGORY_COLORS[article.category] ?? 'bg-slate-100 text-slate-700'}`}>
                      {article.category}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">{article.readTime}</span>
                  </div>

                  <h2 className="text-base sm:text-lg font-bold text-slate-900 mb-2 group-hover:text-apple-blue transition-colors leading-snug line-clamp-2">
                    {article.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-4 line-clamp-3 flex-1">
                    {article.intro.slice(0, 150)}...
                  </p>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-slate-400 font-medium">
                      <time dateTime={article.publishDate}>
                        {new Date(article.publishDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </time>
                      <span>&bull;</span>
                      <span>Sahajul Haque</span>
                    </div>
                    <span className="text-apple-blue font-semibold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                      Read &rarr;
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {/* Bottom CTA to ZIP search */}
          <div className="card p-8 bg-gradient-to-br from-blue-50/70 via-white to-sky-50/40 border border-blue-200/60 text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">Check Your Tap Water Safety</h2>
            <p className="text-slate-500 text-sm mb-6 max-w-md mx-auto">
              All the research above applies to your local water authority. Check your 5-digit ZIP code for an instant report.
            </p>
            <Link href="/#search" className="btn-primary">
              <span>Search Your ZIP Code</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Ad 5: Bottom Native Multiplex Recommendations Grid */}
          <MultiplexAd className="my-8" />
        </main>

        {/* ── Right Column: Sticky Sidebar (4 cols) ── */}
        <aside className="lg:col-span-4 sticky top-20 self-start space-y-6">
          {/* Ad 3: Sticky Sidebar Top Display Ad */}
          <DisplayAd className="my-2" style={{ minHeight: '250px' }} />

          {/* Search by ZIP Code */}
          <div className="apple-card p-5 bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/80 shadow-apple-card">
            <div className="flex items-center gap-2 mb-3">
              <Search className="w-4 h-4 text-apple-blue" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">Check Your ZIP Code</h3>
            </div>
            <p className="text-xs text-slate-600 mb-3">
              Enter your 5-digit ZIP code for an instant EPA water compliance score.
            </p>
            <HomeSearch />
          </div>

          {/* Explore Topics Bento */}
          <div className="apple-card p-5 bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/80 shadow-apple-card">
            <div className="flex items-center gap-2 mb-3">
              <Tag className="w-3.5 h-3.5 text-apple-blue" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">Research Topics</h3>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {allTags.map(tag => (
                <span key={tag} className="badge bg-slate-50 text-slate-600 border border-slate-200/60 text-xs">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Safe Drinking Water Hotline */}
          <div className="apple-card p-5 bg-gradient-to-br from-amber-500/[0.06] to-amber-500/[0.02] backdrop-blur-xl border border-amber-300/40 rounded-3xl shadow-apple-card">
            <div className="flex items-center gap-2 mb-2">
              <Phone className="w-4 h-4 text-amber-600" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-amber-700">EPA Water Hotline</h3>
            </div>
            <p className="text-xs text-slate-600 mb-3">
              Speak directly with an EPA water quality specialist for official guidance.
            </p>
            <a
              href="tel:18004264791"
              className="inline-flex items-center gap-1.5 text-base font-extrabold text-amber-600 hover:text-amber-700 transition-colors"
            >
              1-800-426-4791 &rarr;
            </a>
          </div>

          {/* Founder Transparency Box */}
          <div className="apple-card p-5 bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/80 shadow-apple-card">
            <div className="flex items-center gap-3 mb-3">
              <Image
                src="/images/sahajul-haque.jpg"
                alt="Sahajul Haque"
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover border border-slate-200"
              />
              <div>
                <p className="font-bold text-slate-900 text-sm">Sahajul Haque</p>
                <p className="text-[11px] text-slate-400">Founder &amp; Water Data Analyst</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every guide and article is verified against EPA SDWIS and CDC environmental health benchmarks.
            </p>
          </div>

          {/* Ad 4: Sticky Sidebar Bottom Display Ad */}
          <DisplayAd className="my-2" style={{ minHeight: '250px' }} />
        </aside>
      </div>
    </div>
  )
}
