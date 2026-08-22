// src/app/api/search/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const rawQ = request.nextUrl.searchParams.get('q')?.trim()

  if (!rawQ || rawQ.length < 2) {
    return NextResponse.json({ results: [] })
  }

  // Sanitize input strictly to prevent PostgREST syntax injection / AST breaking
  const sanitized = rawQ.replace(/[^a-zA-Z0-9\s-]/g, '').trim()
  if (!sanitized) {
    return NextResponse.json({ results: [] })
  }

  try {
    const isNumeric = /^\d+$/.test(sanitized)
    let query = supabase.from('zips').select('zip, city, state, grade, score')

    if (isNumeric) {
      query = query.ilike('zip', `${sanitized}%`).limit(8)
    } else {
      query = query.ilike('city', `${sanitized}%`).limit(8)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error searching zips from Supabase:', error)
      return NextResponse.json({ results: [] })
    }

    return NextResponse.json({ results: data || [] }, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (e) {
    console.error('Search exception:', e)
    return NextResponse.json({ results: [] })
  }
}


