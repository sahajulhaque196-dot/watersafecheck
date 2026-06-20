// src/lib/data.ts
import { supabase } from './supabase'
import type { ZipData, StateData, CityData } from './types'

// ─── Loaders (server-side only, now querying Supabase asynchronously) ────────

export async function getZipData(zip: string): Promise<ZipData | null> {
  try {
    const { data, error } = await supabase
      .from('zips')
      .select('*')
      .eq('zip', zip)
      .maybeSingle()
    if (error) {
      console.error(`Error fetching ZIP ${zip}:`, error)
      return null
    }
    return data as ZipData | null
  } catch (e) {
    console.error(`Exception fetching ZIP ${zip}:`, e)
    return null
  }
}

export async function getStateData(code: string): Promise<StateData | null> {
  try {
    const { data, error } = await supabase
      .from('states')
      .select('*')
      .eq('code', code.toUpperCase())
      .maybeSingle()
    if (error) {
      console.error(`Error fetching state ${code}:`, error)
      return null
    }
    return data as StateData | null
  } catch (e) {
    console.error(`Exception fetching state ${code}:`, e)
    return null
  }
}

export async function getCityData(slug: string): Promise<CityData | null> {
  try {
    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .eq('slug', slug.toLowerCase())
      .maybeSingle()
    if (error) {
      console.error(`Error fetching city slug ${slug}:`, error)
      return null
    }
    return data as CityData | null
  } catch (e) {
    console.error(`Exception fetching city slug ${slug}:`, e)
    return null
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

export function getNearbyZips(zip: ZipData, all: Record<string, ZipData>, limit = 6): ZipData[] {
  return Object.values(all)
    .filter(z =>
      z.zip !== zip.zip &&
      z.city === zip.city &&
      z.state === zip.state &&
      z.score !== null
    )
    .slice(0, limit)
}
