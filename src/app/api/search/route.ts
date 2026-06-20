// src/app/api/search/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q')?.trim()

  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] })
  }

  try {
    const { data, error } = await supabase
      .from('zips')
      .select('zip, city, state, grade, score')
      .or(`zip.ilike.${q}%,city.ilike.${q}%`)
      .limit(10)

    if (error) {
      console.error('Error searching zips from Supabase:', error)
      return NextResponse.json({ results: [] })
    }

    return NextResponse.json({ results: data || [] }, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600',
      },
    })
  } catch (e) {
    console.error('Search exception:', e)
    return NextResponse.json({ results: [] })
  }
}

