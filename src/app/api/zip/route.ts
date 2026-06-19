// src/app/api/zip/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getZipData } from '@/lib/data'

export async function GET(request: NextRequest) {
  const zip = request.nextUrl.searchParams.get('zip')

  if (!zip || !/^\d{5}$/.test(zip)) {
    return NextResponse.json({ error: 'Invalid ZIP code' }, { status: 400 })
  }

  const data = getZipData(zip)

  if (!data) {
    return NextResponse.json({ error: 'ZIP code not found in database' }, { status: 404 })
  }

  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
    },
  })
}
