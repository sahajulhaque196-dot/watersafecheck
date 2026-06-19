// src/app/blog/[slug]/page.tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Script from 'next/script'
import { getBlogArticle, getAllBlogSlugs, blogArticles } from '@/data/blog-articles'
import { SITE_URL } from '@/lib/seo'
import { AdTop, AdInContent, AdBottom } from '@/components/ui/AdSense'

interface Props { params: { slug: string } }

export const revalidate = 2592000 // 30 days

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

  // Article JSON-LD
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.metaDescription,
    author: {
      '@type': 'Person',
      name: article.author,
      jobTitle: article.authorTitle,
      url: `${SITE_URL}/about`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'WaterSafeCheck',
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/favicon.svg` },
    },
    datePublished: article.publishDate,
    dateModified: article.updateDate,
    mainEntityOfPage: `${SITE_URL}/blog/${article.slug}`,
    url: `${SITE_URL}/blog/${article.slug}`,
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
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  } : null

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
      <Script id="article-schema" type="application/ld+json" strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      {faqSchema && (
        <Script id="faq-schema" type="application/ld+json" strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}
      <Script id="breadcrumb-schema" type="application/ld+json" strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-gray-500" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-brand-700">Home</Link>
          <span className="mx-2" aria-hidden="true">/</span>
          <Link href="/blog" className="hover:text-brand-700">Blog</Link>
          <span className="mx-2" aria-hidden="true">/</span>
          <span className="text-gray-800 font-medium line-clamp-1" aria-current="page">
            {article.title}
          </span>
        </nav>

        {/* Article Header */}
        <header className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="badge bg-brand-50 text-brand-700 border-brand-100 text-xs">
              {article.category}
            </span>
            <span className="badge bg-gray-100 text-gray-600 border-gray-200 text-xs">
              {article.readTime}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-5 leading-tight">
            {article.title}
          </h1>

          {/* Author byline — EEAT */}
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="w-10 h-10 rounded-full bg-brand-700 flex items-center justify-center text-white font-black text-base flex-shrink-0" aria-hidden="true">
              W
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900">WaterSafeCheck Editorial Team</p>
              <p className="text-xs text-gray-500 leading-snug">Drinking Water Data & Public Health Analysts</p>
            </div>
            <div className="text-right flex-shrink-0 hidden sm:block">
              <p className="text-xs text-gray-400">
                Published <time dateTime={article.publishDate}>
                  {new Date(article.publishDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </time>
              </p>
              {article.updateDate !== article.publishDate && (
                <p className="text-xs text-gray-400 mt-0.5">
                  Updated <time dateTime={article.updateDate}>
                    {new Date(article.updateDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </time>
                </p>
              )}
            </div>
          </div>
        </header>

        <AdTop />

        {/* Article Body */}
        <article className="max-w-none">

          {/* Intro */}
          <div className="text-lg text-gray-700 leading-relaxed mb-8 font-normal">
            {article.intro.split('\n\n').map((para, i) => (
              <p key={i} className="mb-5 last:mb-0">{para}</p>
            ))}
          </div>

          {/* Sections */}
          {article.sections.map((section, idx) => (
            <section key={idx} className="mb-10">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 leading-snug">
                {section.heading}
              </h2>
              <div className="text-gray-700 leading-relaxed text-base">
                {section.body.split('\n\n').map((para, pIdx) => {
                  // Handle bold markdown **text**
                  const parts = para.split(/(\*\*[^*]+\*\*)/)
                  return (
                    <p key={pIdx} className="mb-4 last:mb-0">
                      {parts.map((part, partIdx) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                          return (
                            <strong key={partIdx} className="font-semibold text-gray-900">
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
              {/* Insert ad after section 3 */}
              {idx === 2 && <AdInContent />}
            </section>
          ))}

          {/* Conclusion */}
          <section className="mb-10 bg-blue-50 border border-blue-100 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">The Bottom Line</h2>
            <div className="text-gray-700 leading-relaxed text-base">
              {article.conclusion.split('\n\n').map((para, i) => (
                <p key={i} className="mb-4 last:mb-0">{para}</p>
              ))}
            </div>
            <div className="mt-5 pt-4 border-t border-blue-200">
              <p className="text-sm text-blue-800 font-medium mb-2">
                📍 Check your local water quality:
              </p>
              <div className="flex flex-wrap gap-2 text-sm">
                {['10001','90210','60601','77001','85001'].map(zip => (
                  <Link key={zip} href={`/zip/${zip}`} className="inline-flex items-center px-3 py-1 bg-white border border-blue-200 rounded-full text-brand-700 hover:bg-brand-50 transition-colors font-mono text-xs font-semibold">
                    ZIP {zip} →
                  </Link>
                ))}
                <Link href="/" className="inline-flex items-center px-3 py-1 bg-brand-700 text-white rounded-full hover:bg-brand-800 transition-colors text-xs font-semibold">
                  Search your ZIP →
                </Link>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          {article.faqs.length > 0 && (
            <section className="mb-10" aria-labelledby="faq-heading">
              <h2 id="faq-heading" className="text-xl sm:text-2xl font-bold text-gray-900 mb-5">
                Frequently Asked Questions
              </h2>
              <div className="space-y-2">
                {article.faqs.map((faq, i) => (
                  <details key={i} className="border border-gray-100 rounded-xl overflow-hidden">
                    <summary className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors select-none list-none">
                      <span className="font-semibold text-gray-800 text-sm sm:text-base pr-4 leading-snug">
                        {faq.q}
                      </span>
                      <span className="flex-shrink-0 text-brand-600 text-xl font-light" aria-hidden="true">+</span>
                    </summary>
                    <div className="px-5 pb-5 pt-2 text-sm text-gray-700 leading-relaxed border-t border-gray-50">
                      {faq.a}
                    </div>
                  </details>
                ))}
              </div>
            </section>
          )}

          {/* Tags */}
          <div className="mb-8 pb-8 border-b border-gray-100">
            <p className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wide">Topics</p>
            <div className="flex flex-wrap gap-2">
              {article.tags.map(tag => (
                <span key={tag} className="badge bg-gray-100 text-gray-600 border-gray-200 text-xs">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Author Box — EEAT */}
          <div className="mb-8 p-5 bg-gradient-to-br from-brand-50 to-blue-50 border border-brand-100 rounded-2xl">
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <div className="w-14 h-14 rounded-xl bg-brand-700 flex items-center justify-center text-white font-black text-2xl flex-shrink-0" aria-hidden="true">
                W
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-0.5">
                  WaterSafeCheck Editorial Team
                </h3>
                <p className="text-sm text-brand-700 font-medium mb-3">Drinking Water Data & Public Health Analysts</p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Our team compiles and analyzes public EPA SDWIS, ECHO, and UCMR5 datasets to simplify water safety information for American households. We believe that public health transparency is a baseline right for every family. All recommendations are cross-referenced with NSF and CDC safety limits.
                </p>
                <Link href="/about" className="mt-3 inline-block text-sm text-brand-700 hover:underline font-medium">
                  Read our full methodology →
                </Link>
              </div>
            </div>
          </div>
        </article>

        {/* Related Articles */}
        {related.length > 0 && (
          <section className="mb-10" aria-labelledby="related-heading">
            <h2 id="related-heading" className="text-xl font-bold text-gray-900 mb-5">
              More Water Safety Articles
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map(rel => (
                <Link key={rel.slug} href={`/blog/${rel.slug}`} className="card-hover group block">
                  <p className="text-xs text-brand-600 font-semibold mb-1">{rel.category}</p>
                  <h3 className="text-sm font-bold text-gray-800 group-hover:text-brand-700 transition-colors leading-snug line-clamp-2 mb-2">
                    {rel.title}
                  </h3>
                  <p className="text-xs text-gray-400">{rel.readTime}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ZIP Search CTA */}
        <div className="bg-gradient-to-br from-brand-800 to-brand-700 text-white rounded-2xl p-6 text-center mb-8">
          <h2 className="text-xl font-bold mb-2">Check Your Own Water Quality</h2>
          <p className="text-blue-100 text-sm mb-4 max-w-md mx-auto">
            Search your ZIP code for a free EPA-based water quality report — grade, lead levels, violations, contaminants.
          </p>
          <Link href="/" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-brand-800 font-bold rounded-xl hover:bg-blue-50 transition-colors text-sm shadow-md">
            🔍 Check My Water Quality
          </Link>
        </div>

        <AdBottom />
      </div>
    </>
  )
}
