// src/app/api/search/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getAllZipData } from '@/lib/data'

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q')?.trim().toLowerCase()

  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] })
  }

  const all = getAllZipData()

  const results = Object.values(all)
    .filter(z => {
      const zipMatch = z.zip.startsWith(q)
      const cityMatch = z.city?.toLowerCase().startsWith(q)
      return zipMatch || cityMatch
    })
    .slice(0, 10)
    .map(z => ({
      zip: z.zip,
      city: z.city,
      state: z.state,
      grade: z.grade,
      score: z.score,
    }))

  return NextResponse.json({ results }, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600',
    },
  })
}
