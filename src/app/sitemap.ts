// src/app/sitemap.ts
// Note: Next.js supports multiple sitemaps via sitemap/[id]/route.ts
// For large sites, this generates the main sitemap index
// ZIP sitemaps are split to avoid memory issues

import type { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'
import { blogArticles } from '@/data/blog-articles'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.watersafecheck.com'
  const now = new Date()

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/water-quality-guide`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${baseUrl}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${baseUrl}/disclaimer`, lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
  ]

  // State pages (51 — small, safe to include)
  const { data: states } = await supabase.from('states').select('code')
  const statePages: MetadataRoute.Sitemap = (states || []).map(s => ({
    url: `${baseUrl}/state/${s.code.toLowerCase()}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.85,
  }))

  // City pages — top 3000 by zip_count (avoid loading all 29K at build)
  const { data: cities } = await supabase
    .from('cities')
    .select('slug')
    .order('zip_count', { ascending: false })
    .limit(3000)

  const cityPages: MetadataRoute.Sitemap = (cities || []).map(c => ({
    url: `${baseUrl}/city/${c.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }))

  // ZIP pages — top 5000 most important (ISR handles the rest on-demand)
  // Full ZIP sitemap is in /sitemap-zips.xml (see public/sitemap-zips.xml)
  const priorityZips = [
    '10001','10002','10003','10004','10005',
    '90001','90002','90210','90291','90025',
    '60601','60602','60603','60604','60605',
    '77001','77002','77003','77004','77005',
    '85001','85002','85003','85004','85005',
    '19101','19102','19103','19104','19106',
    '78201','78202','78203','78204','78205',
    '92101','92102','92103','92104','92105',
    '75201','75202','75203','75204','75205',
    '78701','78702','78703','78704','78705',
  ]

  const zipPages: MetadataRoute.Sitemap = priorityZips.map(zip => ({
    url: `${baseUrl}/zip/${zip}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Blog pages
  const blogPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    ...blogArticles.map(a => ({
      url: `${baseUrl}/blog/${a.slug}`,
      lastModified: new Date(a.updateDate),
      changeFrequency: 'monthly' as const,
      priority: 0.80,
    })),
  ]

  return [...staticPages, ...statePages, ...cityPages, ...zipPages, ...blogPages]
}
