// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

// Node.js SSR WebSocket safety check to prevent WebSocket factory error on Node < 22
if (typeof global !== 'undefined' && typeof (global as any).WebSocket === 'undefined') {
  ;(global as any).WebSocket = class DummyWebSocket {}
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qhhamaaveozfanixkkqd.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_suP6DNVdVwJfuEEwhEEM9g_zJk0779G'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
})

