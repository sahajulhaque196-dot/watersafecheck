// src/lib/data.ts
import { d1Query } from './d1'
import type { ZipData, StateData, CityData } from './types'

// ─── Loaders powered by Cloudflare D1 ───────────────────────────────────────

export async function getZipData(zip: string): Promise<ZipData | null> {
  if (!zip || typeof zip !== 'string') return null
  const cleanZip = zip.trim()

  try {
    const rows = await d1Query<{ data: string }>(
      'SELECT data FROM zips WHERE zip = ? LIMIT 1',
      [cleanZip]
    )
    if (rows && rows.length > 0 && rows[0].data) {
      return JSON.parse(rows[0].data) as ZipData
    }
  } catch (e) {
    console.error('Error fetching zip data from D1:', e)
  }

  return null
}

export async function getStateData(code: string): Promise<StateData | null> {
  if (!code || typeof code !== 'string') return null
  const upper = code.trim().toUpperCase()

  try {
    const rows = await d1Query<{ data: string }>(
      'SELECT data FROM states WHERE code = ? LIMIT 1',
      [upper]
    )
    if (rows && rows.length > 0 && rows[0].data) {
      return JSON.parse(rows[0].data) as StateData
    }
  } catch (e) {
    console.error('Error fetching state data from D1:', e)
  }

  return null
}

export async function getCityData(slug: string): Promise<CityData | null> {
  if (!slug || typeof slug !== 'string') return null
  const cleanSlug = slug.trim().toLowerCase()

  try {
    const rows = await d1Query<{ data: string }>(
      'SELECT data FROM cities WHERE slug = ? LIMIT 1',
      [cleanSlug]
    )
    if (rows && rows.length > 0 && rows[0].data) {
      return JSON.parse(rows[0].data) as CityData
    }
  } catch (e) {
    console.error('Error fetching city data from D1:', e)
  }

  return null
}

export async function getStateZips(stateCode: string): Promise<ZipData[]> {
  const upper = stateCode.trim().toUpperCase()
  try {
    const rows = await d1Query<{ data: string }>(
      'SELECT data FROM zips WHERE state = ? LIMIT 3000',
      [upper]
    )
    return rows.map(r => JSON.parse(r.data) as ZipData)
  } catch (e) {
    console.error('Error fetching state zips from D1:', e)
    return []
  }
}

export async function getCityZips(zips: string[]): Promise<ZipData[]> {
  if (!zips || zips.length === 0) return []
  try {
    const placeholders = zips.map(() => '?').join(', ')
    const rows = await d1Query<{ data: string }>(
      `SELECT data FROM zips WHERE zip IN (${placeholders})`,
      zips
    )
    return rows.map(r => JSON.parse(r.data) as ZipData)
  } catch (e) {
    console.error('Error fetching city zips from D1:', e)
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
    const rows = await d1Query<{ data: string }>(
      'SELECT data FROM zips WHERE city = ? AND state = ? AND zip != ? LIMIT ?',
      [city, state.toUpperCase(), zip, limit]
    )
    const cityZips = rows.map(r => JSON.parse(r.data) as ZipData)
    if (cityZips.length >= limit) {
      return cityZips
    }

    const needed = limit - cityZips.length
    const stateRows = await d1Query<{ data: string }>(
      'SELECT data FROM zips WHERE state = ? AND zip != ? LIMIT ?',
      [state.toUpperCase(), zip, needed]
    )
    const stateZips = stateRows.map(r => JSON.parse(r.data) as ZipData)
    return [...cityZips, ...stateZips].slice(0, limit)
  } catch (e) {
    console.error('Error in getNearbyZips:', e)
    return []
  }
}

export async function getUtilityZips(pwsid: string | null, currentZip: string, limit = 6): Promise<ZipData[]> {
  if (!pwsid || pwsid.trim() === '') return []
  try {
    const rows = await d1Query<{ data: string }>(
      'SELECT data FROM zips WHERE zip != ? LIMIT 80',
      [currentZip]
    )
    return rows
      .map(r => JSON.parse(r.data) as ZipData)
      .filter(z => z.pwsid === pwsid.trim())
      .slice(0, limit)
  } catch (e) {
    console.error('Error in getUtilityZips:', e)
    return []
  }
}

export async function getNearbyCities(state: string, currentCity: string, limit = 8): Promise<{ city: string; state: string; slug: string; zip_count: number; best_grade: string }[]> {
  try {
    const rows = await d1Query<{ data: string }>(
      'SELECT data FROM cities WHERE state = ? AND city != ? LIMIT ?',
      [state.toUpperCase(), currentCity, limit]
    )
    return rows.map(r => {
      const c = JSON.parse(r.data) as CityData
      return {
        city: c.city,
        state: c.state,
        slug: c.slug || cityToSlug(c.city, c.state),
        zip_count: c.zip_count || 1,
        best_grade: c.best_grade || 'B',
      }
    })
  } catch (e) {
    console.error('Error in getNearbyCities:', e)
    return []
  }
}




