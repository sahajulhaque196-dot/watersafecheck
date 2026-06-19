'use client'
// src/components/ui/AdSense.tsx
// Client component — safe to import from any server page in Next.js 14 App Router
// Replace ca-pub-XXXXXXXXXXXXXXXX with your actual AdSense Publisher ID
// Replace slot IDs (1234567890 etc.) with actual slot IDs from your AdSense dashboard

import { useEffect } from 'react'

declare global {
  interface Window {
    adsbygoogle: any[]
  }
}

interface AdSenseProps {
  slot: string
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical'
  className?: string
  style?: React.CSSProperties
}

function AdUnit({ slot, format = 'auto', className = '', style }: AdSenseProps) {
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        window.adsbygoogle.push({})
      }
    } catch {
      // AdSense not loaded in development — safe to ignore
    }
  }, [])

  return (
    <div className={`adsense-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', ...style }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  )
}

// ─── Pre-configured ad positions ───────────────────────────────────────────
// IMPORTANT: Replace slot IDs with your actual slot IDs from AdSense dashboard
// Create 4 ad units in AdSense: Top Banner, Sidebar, In-Content, Bottom Banner

export function AdTop() {
  return (
    <div className="w-full my-1 empty:hidden no-print" aria-label="Advertisement">
      <AdUnit slot="1111111111" format="horizontal" />
    </div>
  )
}

export function AdSidebar() {
  return (
    <div className="sticky top-20 empty:hidden no-print" aria-label="Advertisement">
      <AdUnit slot="2222222222" format="vertical" />
    </div>
  )
}

export function AdInContent() {
  return (
    <div className="my-2 empty:hidden no-print" aria-label="Advertisement">
      <AdUnit slot="3333333333" format="rectangle" />
    </div>
  )
}

export function AdBottom() {
  return (
    <div className="w-full my-2 empty:hidden no-print" aria-label="Advertisement">
      <AdUnit slot="4444444444" format="auto" />
    </div>
  )
}
