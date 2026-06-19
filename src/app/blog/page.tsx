// src/app/blog/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { blogArticles } from '@/data/blog-articles'
import { AdTop, AdBottom } from '@/components/ui/AdSense'

export const metadata: Metadata = {
  title: 'Drinking Water Safety Blog — Tips, Guides & Research | WaterSafeCheck',
  description: 'Expert articles on tap water safety, lead contamination, PFAS chemicals, water filters, well water testing, and understanding your EPA water quality data. Written by an environmental data analyst with 10 years of experience.',
  alternates: { canonical: 'https://www.watersafecheck.com/blog' },
  openGraph: {
    title: 'Drinking Water Safety Blog | WaterSafeCheck',
    description: 'Expert articles on tap water safety, lead, PFAS, water filters, and EPA water quality data.',
    type: 'website',
  },
}

const CATEGORY_COLORS: Record<string, string> = {
  'Water Safety': 'bg-blue-50 text-blue-700 border-blue-200',
  'Water Quality': 'bg-green-50 text-green-700 border-green-200',
  'Contaminants': 'bg-red-50 text-red-700 border-red-200',
  'Water Filters': 'bg-purple-50 text-purple-700 border-purple-200',
  'Well Water': 'bg-yellow-50 text-yellow-700 border-yellow-200',
}

export default function BlogPage() {
  const featured = blogArticles[0]
  const rest = blogArticles.slice(1)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-gray-500" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-brand-700">Home</Link>
        <span className="mx-2" aria-hidden="true">/</span>
        <span className="text-gray-800 font-medium" aria-current="page">Blog</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-2">
          Drinking Water Safety Blog
        </h1>
        <p className="text-lg text-gray-500 leading-relaxed max-w-2xl">
          Plain-English guides on tap water safety, water quality data, and protecting your family — written by Marcus J. Webb, environmental data analyst with 10 years of EPA compliance research. New articles published regularly.
        </p>
      </div>

      <AdTop />

      {/* Featured Article */}
      <div className="mb-10">
        <Link href={`/blog/${featured.slug}`} className="block group">
          <article className="bg-gradient-to-br from-brand-50 to-blue-50 border border-brand-100 rounded-2xl p-6 sm:p-8 hover:border-brand-300 transition-all duration-200">
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="badge bg-brand-100 text-brand-700 border-brand-200 text-xs">
                Featured
              </span>
              <span className={`badge text-xs ${CATEGORY_COLORS[featured.category] ?? 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                {featured.category}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 group-hover:text-brand-700 transition-colors leading-snug">
              {featured.title}
            </h2>
            <p className="text-gray-600 leading-relaxed mb-5 text-sm sm:text-base line-clamp-3">
              {featured.intro.slice(0, 280)}...
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1.5">
                <span className="w-6 h-6 rounded-full bg-brand-700 flex items-center justify-center text-white font-black text-xs">M</span>
                {featured.author}
              </span>
              <span>·</span>
              <time dateTime={featured.publishDate}>
                {new Date(featured.publishDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </time>
              <span>·</span>
              <span>{featured.readTime}</span>
            </div>
            <div className="mt-4">
              <span className="text-brand-700 font-semibold text-sm group-hover:underline">
                Read article →
              </span>
            </div>
          </article>
        </Link>
      </div>

      {/* Article Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
        {rest.map((article) => (
          <Link key={article.slug} href={`/blog/${article.slug}`} className="block group">
            <article className="card border-gray-100 h-full hover:border-brand-200 transition-all duration-200">
              <div className="flex flex-wrap gap-2 mb-3">
                <span className={`badge text-xs ${CATEGORY_COLORS[article.category] ?? 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                  {article.category}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-2 group-hover:text-brand-700 transition-colors leading-snug line-clamp-2">
                {article.title}
              </h2>
              <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-3">
                {article.intro.slice(0, 180)}...
              </p>
              <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <time dateTime={article.publishDate}>
                    {new Date(article.publishDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </time>
                  <span>·</span>
                  <span>{article.readTime}</span>
                </div>
                <span className="text-xs text-brand-600 font-semibold group-hover:underline">Read →</span>
              </div>
            </article>
          </Link>
        ))}
      </div>

      {/* Topics section for internal linking + SEO */}
      <div className="bg-gray-50 rounded-2xl p-6 mb-8">
        <h2 className="font-bold text-gray-900 mb-4">Browse by Topic</h2>
        <div className="flex flex-wrap gap-2">
          {Array.from(new Set(blogArticles.flatMap(a => a.tags))).slice(0, 20).map(tag => (
            <span key={tag} className="badge bg-white text-gray-600 border-gray-200 text-xs">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* CTA to ZIP search */}
      <div className="bg-gradient-to-br from-brand-800 to-brand-700 text-white rounded-2xl p-6 text-center mb-8">
        <h2 className="text-xl font-bold mb-2">Check Your Local Water Quality</h2>
        <p className="text-blue-100 text-sm mb-4 max-w-md mx-auto">
          All the articles above apply to your specific local water. Search your ZIP code for a personalized EPA-based water quality report.
        </p>
        <Link href="/" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-brand-800 font-bold rounded-xl hover:bg-blue-50 transition-colors text-sm shadow-md">
          🔍 Check My Water Quality
        </Link>
      </div>

      <AdBottom />
    </div>
  )
}
