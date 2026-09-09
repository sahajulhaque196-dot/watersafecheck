// src/lib/data.ts
import { supabase } from './supabase'
import type { ZipData, StateData, CityData } from './types'

// ─── Local Dataset Cache (Resilient Fallback to prevent 404/5xx during high crawl traffic) ─

let cachedZips: Record<string, ZipData> | null = null
function getLocalZips(): Record<string, ZipData> {
  if (!cachedZips) {
    try {
      cachedZips = require('@/data/zip_data.json')
    } catch {
      cachedZips = {}
    }
  }
  return cachedZips || {}
}

let cachedCities: Record<string, CityData> | null = null
function getLocalCities(): Record<string, CityData> {
  if (!cachedCities) {
    try {
      cachedCities = require('@/data/city_data.json')
    } catch {
      cachedCities = {}
    }
  }
  return cachedCities || {}
}

let cachedStates: Record<string, StateData> | null = null
function getLocalStates(): Record<string, StateData> {
  if (!cachedStates) {
    try {
      cachedStates = require('@/data/state_data.json')
    } catch {
      cachedStates = {}
    }
  }
  return cachedStates || {}
}

// ─── Loaders (Supabase first with 2.5s race timeout, instant local fallback) ────────

export async function getZipData(zip: string): Promise<ZipData | null> {
  if (!zip || typeof zip !== 'string') return null
  const cleanZip = zip.trim()

  try {
    const fetchPromise = supabase
      .from('zips')
      .select('*')
      .eq('zip', cleanZip)
      .maybeSingle()

    const timeoutPromise = new Promise<{ data: null; error: Error }>((resolve) =>
      setTimeout(() => resolve({ data: null, error: new Error('Timeout') }), 2500)
    )

    const res: any = await Promise.race([fetchPromise, timeoutPromise])
    if (res && res.data && !res.error) {
      return res.data as ZipData
    }
  } catch (e) {
    // Database glitch or timeout — fall through to local fallback
  }

  // Instant resilient fallback from local dataset
  const local = getLocalZips()
  if (local[cleanZip]) {
    return local[cleanZip]
  }

  return null
}

export async function getStateData(code: string): Promise<StateData | null> {
  if (!code || typeof code !== 'string') return null
  const upper = code.trim().toUpperCase()

  try {
    const fetchPromise = supabase
      .from('states')
      .select('*')
      .eq('code', upper)
      .maybeSingle()

    const timeoutPromise = new Promise<{ data: null; error: Error }>((resolve) =>
      setTimeout(() => resolve({ data: null, error: new Error('Timeout') }), 2500)
    )

    const res: any = await Promise.race([fetchPromise, timeoutPromise])
    if (res && res.data && !res.error) {
      return res.data as StateData
    }
  } catch (e) {
    // Fallback
  }

  const local = getLocalStates()
  if (local[upper]) {
    return local[upper]
  }

  return null
}

export async function getCityData(slug: string): Promise<CityData | null> {
  if (!slug || typeof slug !== 'string') return null
  const cleanSlug = slug.trim().toLowerCase()

  try {
    const fetchPromise = supabase
      .from('cities')
      .select('*')
      .eq('slug', cleanSlug)
      .maybeSingle()

    const timeoutPromise = new Promise<{ data: null; error: Error }>((resolve) =>
      setTimeout(() => resolve({ data: null, error: new Error('Timeout') }), 2500)
    )

    const res: any = await Promise.race([fetchPromise, timeoutPromise])
    if (res && res.data && !res.error) {
      return res.data as CityData
    }
  } catch (e) {
    // Fallback
  }

  const local = getLocalCities()
  if (local[cleanSlug]) {
    return local[cleanSlug]
  }

  return null
}

export async function getStateZips(stateCode: string): Promise<ZipData[]> {
  const upper = stateCode.trim().toUpperCase()
  const local = getLocalZips()
  const list = Object.values(local).filter(z => z.state === upper)
  if (list.length > 0) {
    return list
  }

  try {
    const { data } = await supabase
      .from('zips')
      .select('zip, city, state, score, grade, contaminants')
      .eq('state', upper)
      .limit(3000)
    return (data || []) as ZipData[]
  } catch {
    return []
  }
}



// ─── Constants ─────────────────────────────────────────────────────────────

export const STATE_NAMES: Record<string, string> = {
  AL:'Alabama', AK:'Alaska', AZ:'Arizona', AR:'Arkansas', CA:'California',
  CO:'Colorado', CT:'Connecticut', DE:'Delaware', FL:'Florida', GA:'Georgia',
  HI:'Hawaii', ID:'Idaho', IL:'Illinois', IN:'Indiana', IA:'Iowa', KS:'Kansas',
  KY:'Kentucky', LA:'Louisiana', ME:'Maine', MD:'Maryland', MA:'Massachusetts',
  MI:'Michigan', MN:'Minnesota', MS:'Mississippi', MO:'Missouri', MT:'Montana',
  NE:'Nebraska', NV:'Nevada', NH:'New Hampshire', NJ:'New Jersey', NM:'New Mexico',
  NY:'New York', NC:'North Carolina', ND:'North Dakota', OH:'Ohio', OK:'Oklahoma',
  OR:'Oregon', PA:'Pennsylvania', RI:'Rhode Island', SC:'South Carolina',
  SD:'South Dakota', TN:'Tennessee', TX:'Texas', UT:'Utah', VT:'Vermont',
  VA:'Virginia', WA:'Washington', WV:'West Virginia', WI:'Wisconsin', WY:'Wyoming',
  DC:'District of Columbia', PR:'Puerto Rico', GU:'Guam', VI:'Virgin Islands',
}

export const STATE_AGENCIES: Record<string, string> = {
  AL:'Alabama Department of Environmental Management', AK:'Alaska Department of Environmental Conservation', 
  AZ:'Arizona Department of Environmental Quality', AR:'Arkansas Department of Health', 
  CA:'California State Water Resources Control Board', CO:'Colorado Department of Public Health and Environment', 
  CT:'Connecticut Department of Public Health', DE:'Delaware Division of Public Health', 
  FL:'Florida Department of Environmental Protection', GA:'Georgia Environmental Protection Division',
  HI:'Hawaii Department of Health', ID:'Idaho Department of Environmental Quality', 
  IL:'Illinois Environmental Protection Agency', IN:'Indiana Department of Environmental Management', 
  IA:'Iowa Department of Natural Resources', KS:'Kansas Department of Health and Environment',
  KY:'Kentucky Department for Environmental Protection', LA:'Louisiana Department of Health', 
  ME:'Maine Center for Disease Control and Prevention', MD:'Maryland Department of the Environment', 
  MA:'Massachusetts Department of Environmental Protection', MI:'Michigan Department of Environment, Great Lakes, and Energy', 
  MN:'Minnesota Department of Health', MS:'Mississippi State Department of Health', 
  MO:'Missouri Department of Natural Resources', MT:'Montana Department of Environmental Quality',
  NE:'Nebraska Department of Environment and Energy', NV:'Nevada Division of Environmental Protection', 
  NH:'New Hampshire Department of Environmental Services', NJ:'New Jersey Department of Environmental Protection', 
  NM:'New Mexico Environment Department', NY:'New York State Department of Health', 
  NC:'North Carolina Department of Environmental Quality', ND:'North Dakota Department of Environmental Quality', 
  OH:'Ohio Environmental Protection Agency', OK:'Oklahoma Department of Environmental Quality',
  OR:'Oregon Health Authority', PA:'Pennsylvania Department of Environmental Protection', 
  RI:'Rhode Island Department of Health', SC:'South Carolina Department of Health and Environmental Control',
  SD:'South Dakota Department of Agriculture and Natural Resources', TN:'Tennessee Department of Environment and Conservation', 
  TX:'Texas Commission on Environmental Quality (TCEQ)', UT:'Utah Department of Environmental Quality', 
  VT:'Vermont Department of Environmental Conservation', VA:'Virginia Department of Health', 
  WA:'Washington State Department of Health', WV:'West Virginia Department of Health and Human Resources', 
  WI:'Wisconsin Department of Natural Resources', WY:'U.S. EPA Region 8 (Direct Implementation)',
  DC:'District of Columbia Water and Sewer Authority', PR:'Puerto Rico Department of Health',
}

// ─── Color/Style Helpers ────────────────────────────────────────────────────

export function gradeColor(grade: string): string {
  switch (grade) {
    case 'A': return 'text-green-700 bg-green-50 border-green-200'
    case 'B': return 'text-blue-700 bg-blue-50 border-blue-200'
    case 'C': return 'text-yellow-700 bg-yellow-50 border-yellow-200'
    case 'D': return 'text-orange-700 bg-orange-50 border-orange-200'
    case 'F': return 'text-red-700 bg-red-50 border-red-200'
    default:  return 'text-gray-600 bg-gray-50 border-gray-200'
  }
}

export function gradeBgClass(grade: string): string {
  switch (grade) {
    case 'A': return 'bg-green-600'
    case 'B': return 'bg-blue-600'
    case 'C': return 'bg-yellow-500'
    case 'D': return 'bg-orange-500'
    case 'F': return 'bg-red-600'
    default:  return 'bg-gray-400'
  }
}

export function riskBadgeClass(risk: string): string {
  switch (risk) {
    case 'Low':       return 'bg-green-50 text-green-700 border-green-200'
    case 'Moderate':  return 'bg-yellow-50 text-yellow-700 border-yellow-200'
    case 'High':      return 'bg-orange-50 text-orange-700 border-orange-200'
    case 'Very High': return 'bg-red-50 text-red-700 border-red-200'
    case 'Critical':  return 'bg-red-100 text-red-800 border-red-300'
    default:          return 'bg-gray-50 text-gray-600 border-gray-200'
  }
}

// ─── Format Helpers ─────────────────────────────────────────────────────────

export function formatPopulation(n: number): string {
  if (!n || n <= 0) return 'N/A'
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)     return `${(n / 1_000).toFixed(0)}K`
  return n.toLocaleString()
}

export function formatLeadPpb(mg_l: number | null): string {
  if (mg_l === null) return 'No data'
  const ppb = mg_l * 1000
  return `${ppb.toFixed(1)} ppb`
}

export function getContaminantList(raw: string): string[] {
  if (!raw) return []
  return raw.split(';').map(s => s.trim()).filter(Boolean)
}

export function getWaterSourceDescription(source: string): string {
  switch (source) {
    case 'Surface Water':
      return 'This system draws water from lakes, rivers, or reservoirs. Surface water is treated to remove sediment, microorganisms, and chemical contaminants before reaching taps.'
    case 'Ground Water':
      return 'This system draws water from underground aquifers. Groundwater is naturally filtered through soil and rock, but can still contain naturally occurring minerals like arsenic, radium, or nitrates.'
    case 'Ground Water Under Surface Influence':
      return 'This system uses groundwater that is hydraulically connected to surface water, requiring additional treatment for microorganism control.'
    case 'Surface Water (Purchased)':
      return 'This system purchases treated surface water from another utility, then distributes it through its own pipeline network.'
    case 'Ground Water (Purchased)':
      return 'This system purchases treated groundwater from another utility for distribution.'
    default:
      return "Water source information is available through your local water utility's Consumer Confidence Report."
  }
}

export function getRadonZoneDescription(zone: number | null): string {
  if (zone === null) return 'Radon zone data not available for this area.'
  if (zone === 1) return 'EPA Radon Zone 1 — highest potential for radon in indoor air. Homeowners should test their home for radon and consider mitigation if levels exceed 4 pCi/L.'
  if (zone === 2) return 'EPA Radon Zone 2 — moderate radon potential. The EPA recommends testing your home regardless of zone designation.'
  return 'EPA Radon Zone 3 — lower radon potential, though the EPA still recommends testing all homes.'
}

export function getViolationSeverityText(health_violations: number, total_violations: number): string {
  if (health_violations === 0 && total_violations === 0)
    return 'No violations recorded in the past 5 years — an excellent compliance record.'
  if (health_violations === 0)
    return `${total_violations} administrative violation${total_violations > 1 ? 's' : ''} recorded, but no health-based violations. The water meets all health standards.`
  if (health_violations <= 2)
    return `${health_violations} health-based violation${health_violations > 1 ? 's' : ''} recorded in the past 5 years.`
  return `${health_violations} health-based violations recorded — significantly above average. Residents should consider additional filtration.`
}

// ─── SEO slug helpers ───────────────────────────────────────────────────────

export function cityToSlug(city: string, state: string): string {
  return `${city.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}-${state.toLowerCase()}`
}

export function stateToSlug(state: string): string {
  return state.toLowerCase()
}

// ─── Related content helpers ────────────────────────────────────────────────

export async function getNearbyZips(zip: string, city: string, state: string, limit = 6): Promise<ZipData[]> {
  try {
    const { data, error } = await supabase
      .from('zips')
      .select('*')
      .eq('city', city)
      .eq('state', state.toUpperCase())
      .neq('zip', zip)
      .order('score', { ascending: false })
      .limit(limit)

    const cityZips = (!error && data) ? (data as ZipData[]) : []
    if (cityZips.length >= limit) {
      return cityZips
    }

    // Fallback: fetch state-level zips to guarantee at least 'limit' contextual internal links
    const needed = limit - cityZips.length
    const excludeZips = [zip, ...cityZips.map(z => z.zip)]
    const { data: stateZips, error: stateErr } = await supabase
      .from('zips')
      .select('*')
      .eq('state', state.toUpperCase())
      .not('zip', 'in', `(${excludeZips.join(',')})`)
      .order('score', { ascending: false })
      .limit(needed)

    if (!stateErr && stateZips && stateZips.length > 0) {
      return [...cityZips, ...(stateZips as ZipData[])]
    }

    if (cityZips.length > 0) return cityZips
  } catch (e) {
    // Fallthrough to local
  }

  // Fast local dataset fallback
  try {
    const local = getLocalZips()
    const all = Object.values(local)
    const sameCity = all.filter(z => z.city === city && z.state === state.toUpperCase() && z.zip !== zip)
    if (sameCity.length >= limit) return sameCity.slice(0, limit)
    const sameState = all.filter(z => z.state === state.toUpperCase() && z.zip !== zip)
    return [...sameCity, ...sameState].slice(0, limit)
  } catch {
    return []
  }
}

export async function getUtilityZips(pwsid: string | null, currentZip: string, limit = 6): Promise<ZipData[]> {
  if (!pwsid || pwsid.trim() === '') return []
  try {
    const { data, error } = await supabase
      .from('zips')
      .select('zip, city, state, score, grade, health_violations, system_name')
      .eq('pwsid', pwsid.trim())
      .neq('zip', currentZip)
      .limit(limit)

    if (!error && data && data.length > 0) return data as ZipData[]
  } catch (e) {
    // Fallthrough
  }

  try {
    const local = getLocalZips()
    return Object.values(local)
      .filter(z => z.pwsid === pwsid.trim() && z.zip !== currentZip)
      .slice(0, limit)
  } catch {
    return []
  }
}

export async function getNearbyCities(state: string, currentCity: string, limit = 8): Promise<{ city: string; state: string; slug: string; zip_count: number; best_grade: string }[]> {
  try {
    const { data, error } = await supabase
      .from('cities')
      .select('city, state, slug, zip_count, best_grade')
      .eq('state', state.toUpperCase())
      .neq('city', currentCity)
      .order('zip_count', { ascending: false })
      .limit(limit)

    if (!error && data && data.length > 0) {
      return data as { city: string; state: string; slug: string; zip_count: number; best_grade: string }[]
    }
  } catch (e) {
    // Fallthrough
  }

  try {
    const local = getLocalCities()
    return Object.values(local)
      .filter(c => c.state === state.toUpperCase() && c.city !== currentCity)
      .sort((a, b) => b.zip_count - a.zip_count)
      .slice(0, limit)
      .map(c => ({
        city: c.city,
        state: c.state,
        slug: c.slug || cityToSlug(c.city, c.state),
        zip_count: c.zip_count,
        best_grade: c.best_grade || 'B',
      }))
  } catch {
    return []
  }
}




