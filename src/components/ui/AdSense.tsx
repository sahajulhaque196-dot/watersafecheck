'use client'
// src/components/ui/AdSense.tsx
// High-CTR, policy-compliant AdSense components for Next.js 14 App Router.
// Configured with verified live slots:
// 1. Display Ads: 2924121704 (High CTR - auto responsive)
// 2. In-Article Ads: 1255816818 (Fluid in-content editorial)
// 3. Multiplex Ads: 6637055875 (Autorelaxed multi-grid recommendations)

import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    adsbygoogle: any[]
  }
}

export const ADSENSE_CLIENT = 'ca-pub-1708825851821862'
export const DISPLAY_SLOT = '2924121704'
export const IN_ARTICLE_SLOT = '1255816818'
export const MULTIPLEX_SLOT = '6637055875'

// Base Ad wrapper ensuring single push per mount and CLS stability
function BaseAdUnit({
  children,
  className = '',
  label = 'Advertisement',
}: {
  children: React.ReactNode
  className?: string
  label?: string
}) {
  const adRef = useRef<HTMLDivElement>(null)
  const isPushed = useRef(false)

  useEffect(() => {
    if (isPushed.current) return
    try {
      if (typeof window !== 'undefined') {
        const adsbygoogle = (window.adsbygoogle = window.adsbygoogle || [])
        adsbygoogle.push({})
        isPushed.current = true
      }
    } catch {
      // AdSense script loading or adblocker suppression — graceful fail
    }
  }, [])

  return (
    <div ref={adRef} className={`adsense-wrapper my-6 w-full text-center no-print ${className}`}>
      {label && (
        <span className="block text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-1.5 select-none">
          {label}
        </span>
      )}
      <div className="overflow-hidden rounded-2xl bg-slate-50/60 border border-slate-200/60 p-2 sm:p-3 shadow-xs">
        {children}
      </div>
    </div>
  )
}

// ─── 1. Display Ads (High CTR, Auto Responsive) ──────────────────────────────
export function DisplayAd({
  slot = DISPLAY_SLOT,
  className = '',
  style,
}: {
  slot?: string
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <BaseAdUnit className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', minHeight: '100px', ...style }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </BaseAdUnit>
  )
}

// ─── 2. In-Article Ads (Fluid Editorial Layout) ──────────────────────────────
export function InArticleAd({
  slot = IN_ARTICLE_SLOT,
  className = '',
  style,
}: {
  slot?: string
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <BaseAdUnit className={className} label="Sponsored Information">
      <ins
        className="adsbygoogle"
        style={{ display: 'block', textAlign: 'center', minHeight: '120px', ...style }}
        data-ad-layout="in-article"
        data-ad-format="fluid"
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
      />
    </BaseAdUnit>
  )
}

// ─── 3. Multiplex Ads (Autorelaxed Grid Recommendations) ─────────────────────
export function MultiplexAd({
  slot = MULTIPLEX_SLOT,
  className = '',
  style,
}: {
  slot?: string
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <BaseAdUnit className={className} label="Recommended Content & Sponsors">
      <ins
        className="adsbygoogle"
        style={{ display: 'block', minHeight: '280px', ...style }}
        data-ad-format="autorelaxed"
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
      />
    </BaseAdUnit>
  )
}

// ─── Legacy / Convenience Aliases for existing page integration ─────────────
export const AdTop = () => <DisplayAd className="my-4 max-w-7xl mx-auto" />
export const AdSidebar = () => <DisplayAd className="my-4" style={{ minHeight: '250px' }} />
export const AdInContent = () => <InArticleAd className="my-6 max-w-4xl mx-auto" />
export const AdBottom = () => <MultiplexAd className="my-8 max-w-7xl mx-auto" />


