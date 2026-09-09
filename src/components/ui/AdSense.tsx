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

function isDummySlot(slot?: string): boolean {
  if (!slot || slot.length < 8) return true
  return /^(\d)\1+$/.test(slot)
}

function AdUnit({ slot, format = 'auto', className = '', style }: AdSenseProps) {
  useEffect(() => {
    if (!IS_ADSENSE_ACTIVE) return
    try {
      if (typeof window !== 'undefined') {
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      }
    } catch {
      // AdSense not loaded in development — safe to ignore
    }
  }, [])

  if (!IS_ADSENSE_ACTIVE || isDummySlot(slot)) {
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

// ─── Zero-space ad positions: Will render pure null until active and configured ──────
export function AdTop() {
  const slot = process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP
  if (!IS_ADSENSE_ACTIVE || !slot || isDummySlot(slot)) return null
  return (
    <div className="w-full my-2 overflow-hidden no-print">
      <AdUnit slot={slot} format="horizontal" />
    </div>
  )
}

export function AdSidebar() {
  const slot = process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR
  if (!IS_ADSENSE_ACTIVE || !slot || isDummySlot(slot)) return null
  return (
    <div className="sticky top-20 overflow-hidden no-print">
      <AdUnit slot={slot} format="vertical" />
    </div>
  )
}

export function AdInContent() {
  const slot = process.env.NEXT_PUBLIC_ADSENSE_SLOT_INCONTENT
  if (!IS_ADSENSE_ACTIVE || !slot || isDummySlot(slot)) return null
  return (
    <div className="my-4 overflow-hidden no-print">
      <AdUnit slot={slot} format="rectangle" />
    </div>
  )
}

export function AdBottom() {
  const slot = process.env.NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM
  if (!IS_ADSENSE_ACTIVE || !slot || isDummySlot(slot)) return null
  return (
    <div className="w-full my-4 overflow-hidden no-print">
      <AdUnit slot={slot} format="auto" />
    </div>
  )
}

