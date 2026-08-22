'use client'
// src/components/ui/AdSense.tsx
// Safe, resilient AdSense component for Next.js 14 App Router.
// Safely suppresses rendering if AdSense ID is a placeholder or not configured.

import { useEffect } from 'react'

declare global {
  interface Window {
    adsbygoogle: any[]
  }
}

const PUBLISHER_ID = process.env.NEXT_PUBLIC_ADSENSE_ID || 'ca-pub-XXXXXXXXXXXXXXXX'
const IS_ADSENSE_ACTIVE = Boolean(
  PUBLISHER_ID &&
  !PUBLISHER_ID.includes('XXXX') &&
  !PUBLISHER_ID.includes('your-publisher-id')
)

interface AdSenseProps {
  slot: string
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical'
  className?: string
  style?: React.CSSProperties
}

function AdUnit({ slot, format = 'auto', className = '', style }: AdSenseProps) {
  useEffect(() => {
    if (!IS_ADSENSE_ACTIVE) return
    try {
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        window.adsbygoogle.push({})
      }
    } catch {
      // AdSense not loaded in development — safe to ignore
    }
  }, [])

  if (!IS_ADSENSE_ACTIVE) {
    return null
  }

  return (
    <div className={`adsense-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', ...style }}
        data-ad-client={PUBLISHER_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  )
}

// ─── Pre-configured ad positions ───────────────────────────────────────────
export function AdTop() {
  if (!IS_ADSENSE_ACTIVE) return null
  return (
    <div className="w-full my-1 empty:hidden no-print" aria-label="Advertisement">
      <AdUnit slot="1111111111" format="horizontal" />
    </div>
  )
}

export function AdSidebar() {
  if (!IS_ADSENSE_ACTIVE) return null
  return (
    <div className="sticky top-20 empty:hidden no-print" aria-label="Advertisement">
      <AdUnit slot="2222222222" format="vertical" />
    </div>
  )
}

export function AdInContent() {
  if (!IS_ADSENSE_ACTIVE) return null
  return (
    <div className="my-2 empty:hidden no-print" aria-label="Advertisement">
      <AdUnit slot="3333333333" format="rectangle" />
    </div>
  )
}

export function AdBottom() {
  if (!IS_ADSENSE_ACTIVE) return null
  return (
    <div className="w-full my-2 empty:hidden no-print" aria-label="Advertisement">
      <AdUnit slot="4444444444" format="auto" />
    </div>
  )
}

