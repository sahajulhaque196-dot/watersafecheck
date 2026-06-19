// src/app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from '@/lib/seo'
import Script from 'next/script'

// ─────────────────────────────────────────────────────────
// CONFIGURATION — Replace these 3 values before deploying
// ─────────────────────────────────────────────────────────
const GA_MEASUREMENT_ID = 'G-WN6QCSJNY3'          // Google Analytics 4 ID
const ADSENSE_PUBLISHER_ID = 'ca-pub-XXXXXXXXXXXXXXXX' // AdSense Publisher ID
const SEARCH_CONSOLE_TOKEN = '4rwnkoJKqRTw6f1ePOF3zd-m7qzxtOCTh0t80dymWR8' // GSC verification
// ─────────────────────────────────────────────────────────

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Is Your Tap Water Safe?`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    'tap water safety', 'water quality by zip code', 'drinking water quality',
    'EPA water violations', 'lead in water', 'water contaminants', 'safe drinking water',
    'water quality report', 'water quality check', 'is my water safe',
  ],
  authors: [{ name: 'Marcus J. Webb', url: `${SITE_URL}/about` }],
  creator: 'WaterSafeCheck',
  publisher: 'WaterSafeCheck',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    locale: 'en_US',
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'WaterSafeCheck — Is Your Tap Water Safe?',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@watersafecheck',
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  verification: {
    google: SEARCH_CONSOLE_TOKEN,
  },
}

import { Inter } from 'next/font/google'

// ... existing code ...

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} font-sans`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#0d4a94" />
        {/* Preconnect to Google services for faster loading */}
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        {/* Favicon variants */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.svg" />
      </head>
      <body>
        {/* Accessibility: skip navigation link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-white focus:text-brand-700 focus:font-semibold focus:rounded-lg focus:shadow-lg focus:border focus:border-brand-200"
        >
          Skip to main content
        </a>

        <Header />
        <main id="main-content">{children}</main>
        <Footer />

        {/* ── Google Analytics 4 ── */}
        {/* Step 1: Load the gtag.js library */}
        <Script
          id="ga-script"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        {/* Step 2: Initialize GA4 with your Measurement ID */}
        <Script
          id="ga-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}', {
                page_path: window.location.pathname,
                anonymize_ip: true,
                cookie_flags: 'SameSite=None;Secure'
              });
            `,
          }}
        />

        {/* ── Google AdSense ── */}
        {/* Replace ca-pub-XXXXXXXXXXXXXXXX with your actual Publisher ID */}
        <Script
          id="adsense"
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_PUBLISHER_ID}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        {/* ── Structured Data: WebSite + SearchAction ── */}
        <Script
          id="website-schema"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
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
            }),
          }}
        />

        {/* ── Structured Data: Organization (EEAT) ── */}
        <Script
          id="org-schema"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: SITE_NAME,
              url: SITE_URL,
              logo: `${SITE_URL}/favicon.svg`,
              email: 'contact@watersafecheck.com',
              contactPoint: {
                '@type': 'ContactPoint',
                email: 'contact@watersafecheck.com',
                contactType: 'customer support',
                availableLanguage: 'English',
              },
              sameAs: [],
            }),
          }}
        />
      </body>
    </html>
  )
}
