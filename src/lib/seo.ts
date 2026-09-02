// src/lib/seo.ts
import type { ZipData, StateData, CityData } from './types'

export const SITE_URL = 'https://www.watersafecheck.com'
export const SITE_NAME = 'WaterSafeCheck'
export const SITE_TAGLINE = 'Is Your Tap Water Safe?'
export const SITE_DESCRIPTION =
  'Check the safety of your tap water by ZIP code. Free EPA-verified data on lead levels, water hardness, violations, contaminants, and safety grades for 41,000+ U.S. ZIP codes.'

// ─── Page-level metadata generators ───────────────────────────────────────

export function zipPageMeta(data: ZipData) {
  const city = data.city || 'Local Area'
  const state = data.state || ''
  const grade = data.grade || 'N/A'
  const currentYear = new Date().getFullYear()
  const ppb = data.lead_mg_l !== null ? (data.lead_mg_l * 1000).toFixed(1) : (data.ccr_lead_ppb !== null ? data.ccr_lead_ppb.toFixed(1) : '0')
  const violations = data.health_violations
  const hasBoil = data.boil_water_advisories > 0

  // High-CTR, search-intent aligned title (under 60 chars to prevent SERP truncation)
  const title = hasBoil
    ? `${data.zip} Boil Water Notice & Water Safety Report (${currentYear})`
    : `Is ${data.zip} Tap Water Safe to Drink? (${city}, ${state} ${currentYear})`
  
  const description = `Is tap water safe in ZIP ${data.zip} (${city}, ${state})? Official ${currentYear} EPA water quality report: Safety Grade ${grade} (${data.score ?? 'N/A'}/100), ${violations} violations, ${ppb} ppb lead & hardness data.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/zip/${data.zip}`,
      siteName: SITE_NAME,
      type: 'article',
      modifiedTime: new Date().toISOString(),
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
    alternates: { canonical: `${SITE_URL}/zip/${data.zip}` },
  }
}

export function statePageMeta(data: StateData) {
  const currentYear = new Date().getFullYear()
  // High-CTR 55-60 char title
  const title = `Is ${data.name} Tap Water Safe? (${currentYear} EPA Quality Report)`
  const description = `Statewide ${currentYear} EPA drinking water quality report for ${data.name}. View safety grades, lead testing, PFAS violations & city rankings across ${data.zip_count.toLocaleString()} ZIP codes.`
  return {
    title,
    description,
    openGraph: { 
      title, 
      description, 
      url: `${SITE_URL}/state/${data.code.toLowerCase()}`, 
      siteName: SITE_NAME, 
      type: 'website' 
    },
    alternates: { canonical: `${SITE_URL}/state/${data.code.toLowerCase()}` },
  }
}

export function cityPageMeta(data: CityData) {
  const currentYear = new Date().getFullYear()
  const state = data.state || ''
  const grade = data.best_grade || 'B'
  // High-CTR title targeting exact conversational questions and local testing intent
  const title = `Is ${data.city}, ${state} Tap Water Safe to Drink? (${currentYear} EPA)`
  const description = `Is tap water safe to drink in ${data.city}, ${state}? Official ${currentYear} EPA water quality report: Safety Grade ${grade}, lead & PFAS risk levels, hardness, and testing guide.`
  const slug = `${data.city.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}-${data.state.toLowerCase()}`
  return {
    title,
    description,
    openGraph: { 
      title, 
      description, 
      url: `${SITE_URL}/city/${slug}`, 
      siteName: SITE_NAME, 
      type: 'website' 
    },
    alternates: { canonical: `${SITE_URL}/city/${slug}` },
  }
}


// ─── JSON-LD structured data ───────────────────────────────────────────────

export function breadcrumbJsonLd(items: { name: string; url: string }[], id?: string) {
  const schema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url.startsWith('/') ? '' : '/'}${item.url}`,
    })),
  }
  if (id) {
    schema['@id'] = id
  }
  return schema
}

export function zipJsonLd(data: ZipData, breadcrumbItems?: { name: string; url: string }[]) {
  const ppb = data.lead_mg_l !== null ? data.lead_mg_l * 1000 : (data.ccr_lead_ppb ?? 0)
  const pageUrl = `${SITE_URL}/zip/${data.zip}`
  const stateCode = (data.state || '').toLowerCase()
  const citySlug = data.city ? `${data.city.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}-${stateCode}` : null

  // Ensure default full breadcrumb chain if not passed
  const items = breadcrumbItems && breadcrumbItems.length > 0 ? breadcrumbItems : [
    { name: 'Home', url: SITE_URL },
    { name: data.state || 'State', url: `${SITE_URL}/state/${stateCode}` },
    ...(data.city && citySlug ? [{ name: data.city, url: `${SITE_URL}/city/${citySlug}` }] : []),
    { name: `ZIP ${data.zip}`, url: pageUrl }
  ]

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Dataset',
        '@id': `${pageUrl}#dataset`,
        name: `EPA Drinking Water Quality Data for ZIP Code ${data.zip}`,
        description: `Official Safe Drinking Water Act (SDWA) compliance and water quality metrics for ZIP code ${data.zip} (${data.city}, ${data.state}), supplied by ${data.system_name || 'local utility'}.`,
        url: pageUrl,
        creator: {
          '@type': 'Organization',
          name: 'WaterSafeCheck',
          url: SITE_URL,
        },
        publisher: {
          '@type': 'Organization',
          name: 'WaterSafeCheck',
          url: SITE_URL,
        },
        license: 'https://creativecommons.org/licenses/by/4.0/',
        isBasedOn: [
          'https://www.epa.gov/enviro/sdwis-search',
          'https://echo.epa.gov',
          `https://enviro.epa.gov/enviro/sdw_report_v2.first_table?pwsid=${data.pwsid || ''}`
        ],
        temporalCoverage: '2020/2026',
        spatialCoverage: {
          '@type': 'Place',
          name: `${data.city}, ${data.state} ${data.zip}`,
          address: {
            '@type': 'PostalAddress',
            postalCode: data.zip,
            addressLocality: data.city,
            addressRegion: data.state,
            addressCountry: 'US',
          },
        },
        variableMeasured: [
          { '@type': 'PropertyValue', name: 'Water Quality Score', value: data.score },
          { '@type': 'PropertyValue', name: 'Safety Grade', value: data.grade },
          { '@type': 'PropertyValue', name: 'Health-Based Violations', value: data.health_violations },
          { '@type': 'PropertyValue', name: '90th Percentile Lead (ppb)', value: ppb },
          { '@type': 'PropertyValue', name: 'Water Source Type', value: data.water_source },
        ],
      },
      {
        '@type': 'ItemPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: `${data.zip} Water Quality & Safety Report`,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        breadcrumb: { '@id': `${pageUrl}#breadcrumb` },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${pageUrl}#breadcrumb`,
        itemListElement: items.map((item, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: item.name,
          item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url.startsWith('/') ? '' : '/'}${item.url}`,
        })),
      }
    ]
  }
}

export function stateJsonLd(data: StateData, breadcrumbItems?: { name: string; url: string }[]) {
  const pageUrl = `${SITE_URL}/state/${data.code.toLowerCase()}`
  const items = breadcrumbItems && breadcrumbItems.length > 0 ? breadcrumbItems : [
    { name: 'Home', url: SITE_URL },
    { name: `${data.name} Water Quality`, url: pageUrl }
  ]

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Dataset',
        '@id': `${pageUrl}#dataset`,
        name: `Drinking Water Quality in ${data.name}`,
        description: `Comprehensive EPA drinking water quality data for ${data.zip_count.toLocaleString()} ZIP codes in ${data.name}, including safety grades, violations, lead levels, and contaminant reports.`,
        url: pageUrl,
        creator: { '@type': 'Organization', name: 'WaterSafeCheck', url: SITE_URL },
        publisher: { '@type': 'Organization', name: 'WaterSafeCheck', url: SITE_URL },
        license: 'https://creativecommons.org/licenses/by/4.0/',
        temporalCoverage: '2020/2026',
        spatialCoverage: { '@type': 'State', name: data.name, containedIn: { '@type': 'Country', name: 'United States' } },
        isBasedOn: [
          'https://www.epa.gov/enviro/sdwis-search',
          'https://echo.epa.gov',
          'https://www.epa.gov/ground-water-and-drinking-water'
        ],
        variableMeasured: [
          { '@type': 'PropertyValue', name: 'Statewide Average Score', value: data.avg_score },
          { '@type': 'PropertyValue', name: 'Monitored ZIP Codes', value: data.zip_count },
          { '@type': 'PropertyValue', name: 'Health-Based Violations', value: data.health_violations },
          { '@type': 'PropertyValue', name: 'Surface Water Ratio', value: `${data.surface_water_pct}%` },
        ],
      },
      {
        '@type': 'ItemPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: `${data.name} Drinking Water Quality & Safety Report`,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        breadcrumb: { '@id': `${pageUrl}#breadcrumb` },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${pageUrl}#breadcrumb`,
        itemListElement: items.map((item, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: item.name,
          item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url.startsWith('/') ? '' : '/'}${item.url}`,
        })),
      }
    ]
  }
}

export function homePageJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/zip/{zip_code}` },
      'query-input': 'required name=zip_code',
    },
  }
}

export function cityJsonLd(data: CityData, breadcrumbItems?: { name: string; url: string }[]) {
  const slug = `${data.city.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}-${data.state.toLowerCase()}`
  const pageUrl = `${SITE_URL}/city/${slug}`
  const items = breadcrumbItems && breadcrumbItems.length > 0 ? breadcrumbItems : [
    { name: 'Home', url: SITE_URL },
    { name: data.state_name || data.state, url: `${SITE_URL}/state/${data.state.toLowerCase()}` },
    { name: `${data.city} Water Quality`, url: pageUrl }
  ]

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Dataset',
        '@id': `${pageUrl}#dataset`,
        name: `${data.city}, ${data.state} Drinking Water Quality & Safety Data`,
        description: `Official EPA Safe Drinking Water Act (SDWA) water quality metrics, lead levels, water hardness, and compliance reports for ${data.city}, ${data.state} across ${data.zip_count} ZIP codes.`,
        url: pageUrl,
        creator: {
          '@type': 'Organization',
          name: 'WaterSafeCheck',
          url: SITE_URL,
        },
        publisher: {
          '@type': 'Organization',
          name: 'WaterSafeCheck',
          url: SITE_URL,
        },
        license: 'https://creativecommons.org/licenses/by/4.0/',
        temporalCoverage: '2020/2026',
        isBasedOn: [
          'https://www.epa.gov/enviro/sdwis-search',
          'https://echo.epa.gov',
          'https://www.epa.gov/ground-water-and-drinking-water'
        ],
        spatialCoverage: {
          '@type': 'City',
          name: data.city,
          containedIn: {
            '@type': 'State',
            name: data.state_name || data.state,
          },
        },
        variableMeasured: [
          { '@type': 'PropertyValue', name: 'Composite Safety Grade', value: data.best_grade },
          { '@type': 'PropertyValue', name: 'Monitored ZIP Codes', value: data.zip_count },
          { '@type': 'PropertyValue', name: 'Primary Water Source', value: data.water_source },
        ],
      },
      {
        '@type': 'ItemPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: `${data.city}, ${data.state} Water Quality & Testing Report`,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        breadcrumb: { '@id': `${pageUrl}#breadcrumb` },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${pageUrl}#breadcrumb`,
        itemListElement: items.map((item, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: item.name,
          item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url.startsWith('/') ? '' : '/'}${item.url}`,
        })),
      }
    ]
  }
}

export function faqJsonLd(faqs: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { 
        '@type': 'Answer', 
        text: faq.a.replace(/<[^>]*>?/gm, '') // Strip HTML for rich snippets compliance
      },
    })),
  }
}

