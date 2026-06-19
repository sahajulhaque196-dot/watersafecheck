// src/lib/seo.ts
import type { ZipData, StateData, CityData } from './types'

export const SITE_URL = 'https://www.watersafecheck.com'
export const SITE_NAME = 'WaterSafeCheck'
export const SITE_TAGLINE = 'Is Your Tap Water Safe?'
export const SITE_DESCRIPTION =
  'Check the safety of your tap water by ZIP code. Free EPA-verified data on lead levels, violations, contaminants, and water quality grades for 41,000+ U.S. ZIP codes.'

// ─── Page-level metadata generators ───────────────────────────────────────

export function zipPageMeta(data: ZipData) {
  const city = data.city || 'this area'
  const state = data.state || ''
  const grade = data.grade || 'N/A'
  const violations = data.health_violations

  const title = `Is ${data.zip} Tap Water Safe? — ${city}, ${state} Water Quality Report`
  const description = violations === 0
    ? `ZIP code ${data.zip} (${city}, ${state}) has an excellent water quality grade of ${grade} with no health-based violations. View lead levels, contaminants, and full EPA data.`
    : `ZIP code ${data.zip} (${city}, ${state}) has grade ${grade} with ${violations} health-based violation${violations > 1 ? 's' : ''}. Check lead levels, contaminants, and safety data.`

  return {
    title,
    description,
    canonical: `${SITE_URL}/zip/${data.zip}`,
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/zip/${data.zip}`,
      siteName: SITE_NAME,
      type: 'website',
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
  const title = `Is ${data.name} Tap Water Safe? — Water Quality Report by ZIP Code`
  const description = `Is tap water safe in ${data.name}? View water quality grades, lead levels, violations, and contaminant data for all ${data.zip_count.toLocaleString()} ZIP codes across ${data.name}. Powered by EPA data.`
  return {
    title,
    description,
    canonical: `${SITE_URL}/state/${data.code.toLowerCase()}`,
    openGraph: { title, description, url: `${SITE_URL}/state/${data.code.toLowerCase()}`, siteName: SITE_NAME, type: 'website' },
    alternates: { canonical: `${SITE_URL}/state/${data.code.toLowerCase()}` },
  }
}

export function cityPageMeta(data: CityData) {
  const title = `Is ${data.city}, ${data.state} Tap Water Safe? — Water Quality Report`
  const description = `Is tap water safe in ${data.city}, ${data.state}? Check water quality grades, lead levels, and violation history for all ${data.zip_count} ZIP code${data.zip_count > 1 ? 's' : ''} in ${data.city}. Free EPA-verified data.`
  const slug = `${data.city.toLowerCase().replace(/\s+/g, '-')}-${data.state.toLowerCase()}`
  return {
    title,
    description,
    canonical: `${SITE_URL}/city/${slug}`,
    openGraph: { title, description, url: `${SITE_URL}/city/${slug}`, siteName: SITE_NAME, type: 'website' },
    alternates: { canonical: `${SITE_URL}/city/${slug}` },
  }
}

// ─── JSON-LD structured data ───────────────────────────────────────────────

export function zipJsonLd(data: ZipData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: `Water Quality Data for ZIP Code ${data.zip}`,
    description: `EPA drinking water quality data for ZIP code ${data.zip}, ${data.city}, ${data.state}. Includes safety grade, lead levels, violations, and contaminant information.`,
    url: `${SITE_URL}/zip/${data.zip}`,
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
      'https://www.epa.gov/dwucmr/fifth-unregulated-contaminant-monitoring-rule'
    ],
    temporalCoverage: '2019/2024',
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
      { '@type': 'PropertyValue', name: 'Home Safety Score', value: data.score },
      { '@type': 'PropertyValue', name: 'Health-Based Violations', value: data.health_violations },
      { '@type': 'PropertyValue', name: 'Lead Level (mg/L)', value: data.lead_mg_l },
    ],
  }
}

export function stateJsonLd(data: StateData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: `Drinking Water Quality in ${data.name}`,
    description: `Comprehensive EPA drinking water quality data for ${data.zip_count.toLocaleString()} ZIP codes in ${data.name}, including safety grades, violations, lead levels, and contaminant reports.`,
    url: `${SITE_URL}/state/${data.code.toLowerCase()}`,
    creator: { '@type': 'Organization', name: 'WaterSafeCheck', url: SITE_URL },
    spatialCoverage: { '@type': 'State', name: data.name, containedIn: { '@type': 'Country', name: 'United States' } },
    isBasedOn: [
      'https://www.epa.gov/enviro/sdwis-search',
      'https://echo.epa.gov',
      'https://www.epa.gov/dwucmr/fifth-unregulated-contaminant-monitoring-rule'
    ],
  }
}

export function homePageJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
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

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function faqJsonLd(faqs: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: { '@type': 'Answer', text: faq.a },
    })),
  }
}
