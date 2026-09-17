// src/app/api/search/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { d1Query } from '@/lib/d1'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const rawQ = request.nextUrl.searchParams.get('q')?.trim()

  if (!rawQ || rawQ.length < 2) {
    return NextResponse.json({ results: [] })
  }

  // Sanitize input strictly to prevent SQL injection / invalid characters
  const sanitized = rawQ.replace(/[^a-zA-Z0-9\s-]/g, '').trim()
  if (!sanitized) {
    return NextResponse.json({ results: [] })
  }

  try {
    const isNumeric = /^\d+$/.test(sanitized)
    let rows: { data: string }[] = []

    if (isNumeric) {
      rows = await d1Query<{ data: string }>(
        'SELECT data FROM zips WHERE zip LIKE ? LIMIT 8',
        [`${sanitized}%`]
      )
    } else {
      rows = await d1Query<{ data: string }>(
        'SELECT data FROM zips WHERE city LIKE ? LIMIT 8',
        [`${sanitized}%`]
      )
    }

    const results = rows.map(r => {
      const d = JSON.parse(r.data)
      return {
        zip: d.zip,
        city: d.city,
        state: d.state,
        grade: d.grade,
        score: d.score,
      }
    })

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


