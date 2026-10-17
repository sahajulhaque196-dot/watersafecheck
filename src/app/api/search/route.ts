// src/app/api/search/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { searchZips } from '@/lib/data'

export async function GET(request: NextRequest) {
  const rawQ = request.nextUrl.searchParams.get('q')?.trim()

  if (!rawQ || rawQ.length < 2 || rawQ.length > 50) {
    return NextResponse.json({ results: [] })
  }

  // Sanitize input strictly
  const sanitized = rawQ.replace(/[^a-zA-Z0-9\s-]/g, '').trim()
  if (!sanitized || sanitized.length > 50) {
    return NextResponse.json({ results: [] })
  }

  try {
    const results = searchZips(sanitized, 8)
    return NextResponse.json({ results }, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (e) {
    console.error('Search exception:', e)
    return NextResponse.json({ results: [] })
  }
}
