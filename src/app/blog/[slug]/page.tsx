// src/app/blog/[slug]/page.tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getBlogArticle, getAllBlogSlugs, blogArticles } from '@/data/blog-articles'
import { SITE_URL, safeJsonLd } from '@/lib/seo'
import { DisplayAd, InArticleAd, MultiplexAd } from '@/components/ui/AdSense'
import { Breadcrumb, FaqItem } from '@/components/ui'
import { ArrowRight, Clock, ShieldCheck, Sparkles, Phone, Bookmark, Search, CheckCircle2 } from 'lucide-react'

interface Props { params: { slug: string } }

export const revalidate = 2592000

export async function generateStaticParams() {
  return getAllBlogSlugs().map(slug => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = getBlogArticle(params.slug)
  if (!article) return { title: 'Article Not Found | WaterSafeCheck' }

  return {
    title: article.metaTitle,
    description: article.metaDescription,
    authors: [{ name: article.author, url: `${SITE_URL}/about` }],
    alternates: { canonical: `${SITE_URL}/blog/${article.slug}` },
    openGraph: {
      title: article.metaTitle,
      description: article.metaDescription,
      type: 'article',
      url: `${SITE_URL}/blog/${article.slug}`,
      siteName: 'WaterSafeCheck',
      publishedTime: article.publishDate,
      modifiedTime: article.updateDate,
      authors: [article.author],
      tags: article.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.metaTitle,
      description: article.metaDescription,
    },
  }
}

export default function BlogArticlePage({ params }: Props) {
  const article = getBlogArticle(params.slug)
  if (!article) notFound()

  const related = blogArticles
    .filter(a => a.slug !== article.slug)
    .slice(0, 3)

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.metaDescription,
    image: [`${SITE_URL}/images/water-hero.jpg`],
    author: {
      '@type': 'Person',
      name: article.author,
      jobTitle: article.authorTitle,
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
    datePublished: article.publishDate,
    dateModified: article.updateDate,
    mainEntityOfPage: `${SITE_URL}/blog/${article.slug}`,
    url: `${SITE_URL}/blog/${article.slug}`,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    articleSection: article.category,
    keywords: article.tags.join(', '),
    about: { '@type': 'Thing', name: 'Drinking Water Safety' },
  }

  const faqSchema = article.faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: article.faqs.map(faq => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { 
        '@type': 'Answer', 
        text: faq.a.replace(/<[^>]*>?/gm, '').replace(/\*\*/g, '') 
      },
    })),
  } : null

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blog' },
    { label: article.title },
  ]

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
      { '@type': 'ListItem', position: 3, name: article.title, item: `${SITE_URL}/blog/${article.slug}` },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(articleSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(faqSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbSchema) }}
      />

      <div className="min-h-screen bg-[#F5F5F7] text-slate-900 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <Breadcrumb items={breadcrumbs} />

          {/* Article Header Banner */}
          <header className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-white to-sky-50/50 p-6 sm:p-10 border border-slate-200/80 shadow-apple-card mb-8">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-apple-blue/10 text-apple-blue text-xs font-semibold tracking-wide">
                <Sparkles className="w-3.5 h-3.5" />
                {article.category}
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
                <Clock className="w-3 h-3 text-slate-500" />
                {article.readTime}
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                EPA SDWIS Evidence Based
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 mb-6 leading-[1.14] tracking-tight">
              {article.title}
            </h1>

            {/* Author byline */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 border border-slate-200/70 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <Image
                  src="/images/sahajul-haque.jpg"
                  alt={article.author}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shadow-sm"
                />
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900">{article.author}</p>
                  <p className="text-xs text-slate-500 truncate">{article.authorTitle}</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0 text-xs text-slate-400">
                <time dateTime={article.publishDate}>
                  {new Date(article.publishDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </time>
                {article.updateDate !== article.publishDate && (
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Updated {new Date(article.updateDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </p>
                )}
              </div>
            </div>
          </header>

          {/* Ad 1: Top Hero High-Visibility Display Ad */}
          <DisplayAd className="my-6" />

          {/* ── 2-Column Responsive Layout with Sticky Sidebar ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* ── Left Column: Main Article Body (8 cols) ── */}
            <main className="lg:col-span-8 space-y-10">
              <article className="space-y-10">
                {/* Intro Card */}
                <div className="apple-card p-6 sm:p-8 bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/80 shadow-apple-card text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
                  {article.intro.split('\n\n').map((para, i) => (
                    <p key={i} className="mb-4 last:mb-0 leading-relaxed">{para}</p>
                  ))}
                </div>

                {/* Sections with in-content ads */}
                {article.sections.map((section, idx) => (
                  <div key={idx} className="space-y-6">
                    <section id={`section-${idx}`} className="apple-card p-6 sm:p-8 bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/80 shadow-apple-card scroll-mt-24">
                      <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4 tracking-tight">
                        {section.heading}
                      </h2>
                      <div className="prose-custom text-slate-600">
                        {section.body.split('\n\n').map((para, pIdx) => {
                          const parts = para.split(/(\*\*[^*]+\*\*)/)
                          return (
                            <p key={pIdx} className="mb-4 last:mb-0 leading-relaxed text-sm sm:text-base">
                              {parts.map((part, partIdx) => {
                                if (part.startsWith('**') && part.endsWith('**')) {
                                  return (
                                    <strong key={partIdx} className="font-semibold text-slate-900">
                                      {part.slice(2, -2)}
                                    </strong>
                                  )
                                }
                                return <span key={partIdx}>{part}</span>
                              })}
                            </p>
                          )
                        })}
                      </div>
                    </section>

                    {/* Ad 3: Early In-Content Fluid Ad (after section 1) */}
                    {idx === 1 && <InArticleAd className="my-8" />}

                    {/* Ad 4: Mid-Article High-CTR Display Ad (after section 3) */}
                    {idx === 3 && <DisplayAd className="my-8" />}
                  </div>
                ))}

                {/* Conclusion Box */}
                <section className="card p-6 sm:p-8 bg-gradient-to-br from-blue-50/70 via-white to-sky-50/40 border border-blue-200/70 shadow-apple-card">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 tracking-tight">The Bottom Line</h2>
                  <div className="text-slate-600 text-sm sm:text-base leading-relaxed space-y-3">
                    {article.conclusion.split('\n\n').map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>

                  <div className="mt-6 pt-5 border-t border-blue-200/60">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                      Check Your Local Water Quality:
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      {['10001','90210','60601','77001','85001'].map(zip => (
                        <Link
                          key={zip}
                          href={`/zip/${zip}`}
                          className="inline-flex items-center px-3 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded-full text-slate-800 font-mono text-xs font-semibold shadow-xs transition-colors"
                        >
                          ZIP {zip} &rarr;
                        </Link>
                      ))}
                      <Link
                        href="/#search"
                        className="inline-flex items-center px-4 py-1.5 bg-apple-blue hover:bg-blue-600 text-white rounded-full text-xs font-bold transition-all shadow-xs"
                      >
                        Search Your ZIP
                      </Link>
                    </div>
                  </div>
                </section>

                {/* Ad 6: Pre-FAQ High-Intent Display Ad */}
                {article.faqs.length > 0 && <DisplayAd className="my-8" />}

                {/* FAQ Accordions */}
                {article.faqs.length > 0 && (
                  <section className="apple-card p-6 sm:p-8 bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/80 shadow-apple-card">
                    <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-6">Frequently Asked Questions</h2>
                    <div className="space-y-3">
                      {article.faqs.map((faq, i) => (
                        <FaqItem key={i} q={faq.q} a={faq.a} open={i === 0} />
                      ))}
                    </div>
                  </section>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {article.tags.map(tag => (
                    <span key={tag} className="badge bg-white border border-slate-200 text-slate-600 text-xs px-3 py-1 rounded-full shadow-xs">
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Author Bio Box */}
                <div className="apple-card p-6 sm:p-8 bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/80 shadow-apple-card">
                  <div className="flex flex-col sm:flex-row gap-4 items-start">
                    <Image
                      src="/images/sahajul-haque.jpg"
                      alt={article.author}
                      width={64}
                      height={64}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-slate-900 text-base">{article.author}</h3>
                        <span className="badge text-[10px] bg-sky-100 text-apple-blue font-bold">Author</span>
                      </div>
                      <p className="text-xs text-apple-blue font-semibold mb-2">{article.authorTitle}</p>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                        Sahajul is an independent data systems engineer based in Assam, India, and the founder of WaterSafeCheck. He specializes in parsing and organizing large-scale U.S. EPA compliance databases (SDWIS, ECHO, UCMR5) into actionable drinking water reports.
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
                        <a
                          href="https://x.com/saddamh58509953"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-apple-blue hover:underline"
                        >
                          Follow on X (@saddamh58509953) &rarr;
                        </a>
                        <Link href="/about" className="text-slate-600 hover:text-slate-900 underline">
                          Read founder story
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </main>

            {/* ── Right Column: Sticky Sidebar (4 cols) ── */}
            <aside className="lg:col-span-4 sticky top-20 self-start space-y-6">
              {/* Ad 2: Sticky Sidebar Top Display Ad */}
              <DisplayAd className="my-2" style={{ minHeight: '250px' }} />

              {/* Table of Contents */}
              <div className="apple-card p-5 sm:p-6 bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/80 shadow-apple-card">
                <div className="flex items-center gap-2 mb-3">
                  <Bookmark className="w-4 h-4 text-apple-blue" />
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                    In This Article
                  </h3>
                </div>
                <nav className="space-y-1 text-xs">
                  {article.sections.map((sec, idx) => (
                    <a
                      key={idx}
                      href={`#section-${idx}`}
                      className="block px-3 py-2 rounded-xl text-slate-600 hover:text-apple-blue hover:bg-slate-50 transition-colors font-medium truncate"
                    >
                      {idx + 1}. {sec.heading}
                    </a>
                  ))}
                </nav>
              </div>

              {/* Ad 5: Sticky Sidebar Mid Display Ad */}
              <DisplayAd className="my-2" style={{ minHeight: '250px' }} />

              {/* Safe Drinking Water Hotline */}
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

              {/* Quick ZIP Search Widget */}
              <div className="apple-card p-5 bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/80 shadow-apple-card text-center">
                <p className="font-bold text-slate-900 text-sm mb-1">Check Your Tap Water</p>
                <p className="text-xs text-slate-500 mb-4">Instant EPA compliance report for your street address.</p>
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

          {/* Related Articles */}
          {related.length > 0 && (
            <section className="mt-14 mb-10">
              <h2 className="text-2xl font-bold text-slate-900 mb-5 tracking-tight">More Water Safety Research</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {related.map(rel => (
                  <Link key={rel.slug} href={`/blog/${rel.slug}`} className="apple-card p-6 bg-white/95 backdrop-blur-2xl rounded-3xl border border-slate-200/80 hover:border-apple-blue/40 shadow-apple-card active:scale-[0.98] transition-all group block">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-apple-blue block mb-1.5">
                      {rel.category}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-apple-blue transition-colors line-clamp-2 mb-2 leading-snug">
                      {rel.title}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium">{rel.readTime}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Ad 7: Bottom Native Multiplex Recommendations Grid */}
          <MultiplexAd className="my-12" />
        </div>
      </div>
    </>
  )
}
