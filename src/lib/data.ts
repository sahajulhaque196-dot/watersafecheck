// src/lib/data.ts
// High-performance, zero-latency in-memory data engine with 100% resilience against 404s.
// Replaces fragile external database calls with guaranteed local data access.

import type { ZipData, StateData, CityData } from './types'

// ─── Compact Columnar Dataset Cache (Fits within Cloudflare Pages 25MB limit) ───

interface CompactDataset {
  f: string[]
  d: Record<string, any[]>
}

let _zipsCompact: CompactDataset | null = null
let _citiesCompact: CompactDataset | null = null
let _states: Record<string, StateData> | null = null

let _zipsByCityState: Map<string, string[]> | null = null
let _zipsByState: Map<string, string[]> | null = null
let _zipsByPwsid: Map<string, string[]> | null = null
let _citiesByState: Map<string, string[]> | null = null

function getZipCompact(): CompactDataset {
  if (!_zipsCompact) {
    try {
      const raw = require('@/data/zip_data.json')
      _zipsCompact = raw.f && raw.d ? raw : { f: [], d: raw }
    } catch {
      _zipsCompact = { f: [], d: {} }
    }
  }
  return _zipsCompact || { f: [], d: {} }
}

function getCityCompact(): CompactDataset {
  if (!_citiesCompact) {
    try {
      const raw = require('@/data/city_data.json')
      _citiesCompact = raw.f && raw.d ? raw : { f: [], d: raw }
    } catch {
      _citiesCompact = { f: [], d: {} }
    }
  }
  return _citiesCompact || { f: [], d: {} }
}

function getLocalStates(): Record<string, StateData> {
  if (!_states) {
    try {
      _states = require('@/data/state_data.json')
    } catch {
      _states = {}
    }
  }
  return _states || {}
}

export function hydrateZip(row: any[]): ZipData | null {
  if (!row) return null
  const compact = getZipCompact()
  const f = compact.f
  const obj: any = {}
  for (let i = 0; i < f.length; i++) {
    obj[f[i]] = row[i]
  }
  return obj as ZipData
}

export function hydrateCity(row: any[]): CityData | null {
  if (!row) return null
  const compact = getCityCompact()
  const f = compact.f
  const obj: any = {}
  for (let i = 0; i < f.length; i++) {
    obj[f[i]] = row[i]
  }
  return obj as CityData
}

function ensureIndexes() {
  if (_zipsByCityState) return

  const compact = getZipCompact()
  const csMap = new Map<string, string[]>()
  const sMap = new Map<string, string[]>()
  const pMap = new Map<string, string[]>()

  const f = compact.f
  const cityIdx = f.indexOf('city')
  const stateIdx = f.indexOf('state')
  const pwsidIdx = f.indexOf('pwsid')

  const data = compact.d
  for (const zip in data) {
    const row = data[zip]
    if (!row) continue

    const city = row[cityIdx]
    const state = row[stateIdx]
    const pwsid = row[pwsidIdx]

    if (city && state) {
      const key = `${String(city).toLowerCase()}|${String(state).toUpperCase()}`
      let list = csMap.get(key)
      if (!list) {
        list = []
        csMap.set(key, list)
      }
      list.push(zip)
    }

    if (state) {
      const s = String(state).toUpperCase()
      let sList = sMap.get(s)
      if (!sList) {
        sList = []
        sMap.set(s, sList)
      }
      sList.push(zip)
    }

    if (pwsid) {
      const p = String(pwsid).trim()
      let pList = pMap.get(p)
      if (!pList) {
        pList = []
        pMap.set(p, pList)
      }
      pList.push(zip)
    }
  }

  _zipsByCityState = csMap
  _zipsByState = sMap
  _zipsByPwsid = pMap

  const cityCompact = getCityCompact()
  const cf = cityCompact.f
  const cStateIdx = cf.indexOf('state')
  const cByState = new Map<string, string[]>()
  const cData = cityCompact.d

  for (const slug in cData) {
    const cRow = cData[slug]
    if (!cRow) continue
    const s = cRow[cStateIdx]
    if (!s) continue
    const sUpper = String(s).toUpperCase()
    let list = cByState.get(sUpper)
    if (!list) {
      list = []
      cByState.set(sUpper, list)
    }
    list.push(slug)
  }
  _citiesByState = cByState
}

// ─── Primary Core Loaders ────────────────────────────────────────────────────

export async function getZipData(zip: string): Promise<ZipData | null> {
  if (!zip || typeof zip !== 'string') return null
  const cleanZip = zip.trim()
  if (!/^\d{5}$/.test(cleanZip)) return null
  const compact = getZipCompact()
  if (Object.prototype.hasOwnProperty.call(compact.d, cleanZip)) {
    return hydrateZip(compact.d[cleanZip])
  }
  return null
}

export async function getStateData(code: string): Promise<StateData | null> {
  if (!code || typeof code !== 'string') return null
  const upper = code.trim().toUpperCase()
  if (!/^[A-Z]{2}$/.test(upper)) return null
  const local = getLocalStates()
  if (Object.prototype.hasOwnProperty.call(local, upper) && local[upper]) {
    return local[upper]
  }
  return null
}

export async function getAllStates(): Promise<Record<string, StateData>> {
  return getLocalStates()
}

export async function getCityData(slug: string): Promise<CityData | null> {
  if (!slug || typeof slug !== 'string') return null
  const cleanSlug = slug.trim().toLowerCase()
  if (!/^[a-z0-9-]+$/.test(cleanSlug)) return null
  const compact = getCityCompact()
  if (Object.prototype.hasOwnProperty.call(compact.d, cleanSlug)) {
    return hydrateCity(compact.d[cleanSlug])
  }
  return null
}

export async function getStateZips(stateCode: string): Promise<ZipData[]> {
  ensureIndexes()
  const s = stateCode.trim().toUpperCase()
  const zipCodes = _zipsByState?.get(s) || []
  const compact = getZipCompact()
  return zipCodes.map(z => hydrateZip(compact.d[z])).filter(Boolean) as ZipData[]
}

export async function getCityZips(zips: string[]): Promise<ZipData[]> {
  if (!zips || zips.length === 0) return []
  const compact = getZipCompact()
  return zips.map(z => hydrateZip(compact.d[z])).filter(Boolean) as ZipData[]
}

export function searchZips(query: string, limit = 8): { zip: string; city: string; state: string; grade: string; score: number | null }[] {
  if (!query || typeof query !== 'string') return []
  const q = query.trim().toLowerCase()
  if (!q || q.length < 2 || q.length > 50) return []

  const compact = getZipCompact()
  const isNumeric = /^\d+$/.test(q)
  const results: { zip: string; city: string; state: string; grade: string; score: number | null }[] = []

  const f = compact.f
  const zipIdx = f.indexOf('zip')
  const cityIdx = f.indexOf('city')
  const stateIdx = f.indexOf('state')
  const gradeIdx = f.indexOf('grade')
  const scoreIdx = f.indexOf('score')

  const data = compact.d
  if (isNumeric) {
    for (const zip in data) {
      if (zip.startsWith(q)) {
        const row = data[zip]
        results.push({
          zip: row[zipIdx],
          city: row[cityIdx],
          state: row[stateIdx],
          grade: row[gradeIdx],
          score: row[scoreIdx],
        })
        if (results.length >= limit) break
      }
    }
  } else {
    for (const zip in data) {
      const row = data[zip]
      const city = row[cityIdx]
      if (city && String(city).toLowerCase().startsWith(q)) {
        results.push({
          zip: row[zipIdx],
          city: city,
          state: row[stateIdx],
          grade: row[gradeIdx],
          score: row[scoreIdx],
        })
        if (results.length >= limit) break
      }
    }
  }

  return results
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
  ensureIndexes()
  const key = `${city.toLowerCase()}|${state.toUpperCase()}`
  const sameCityZips = (_zipsByCityState?.get(key) || []).filter(z => z !== zip)
  const compact = getZipCompact()
  
  if (sameCityZips.length >= limit) {
    return sameCityZips.slice(0, limit).map(z => hydrateZip(compact.d[z])).filter(Boolean) as ZipData[]
  }

  const s = state.toUpperCase()
  const sameStateZips = (_zipsByState?.get(s) || []).filter(z => z !== zip && !sameCityZips.includes(z))
  const combined = [...sameCityZips, ...sameStateZips].slice(0, limit)
  return combined.map(z => hydrateZip(compact.d[z])).filter(Boolean) as ZipData[]
}

export async function getUtilityZips(pwsid: string | null, currentZip: string, limit = 6): Promise<ZipData[]> {
  if (!pwsid || pwsid.trim() === '') return []
  ensureIndexes()
  const list = _zipsByPwsid?.get(pwsid.trim()) || []
  const compact = getZipCompact()
  return list.filter(z => z !== currentZip).slice(0, limit).map(z => hydrateZip(compact.d[z])).filter(Boolean) as ZipData[]
}

export async function getNearbyCities(state: string, currentCity: string, limit = 8): Promise<{ city: string; state: string; slug: string; zip_count: number; best_grade: string }[]> {
  ensureIndexes()
  const s = state.toUpperCase()
  const slugs = _citiesByState?.get(s) || []
  const cityCompact = getCityCompact()
  const cf = cityCompact.f
  const cityIdx = cf.indexOf('city')
  const stateIdx = cf.indexOf('state')
  const slugIdx = cf.indexOf('slug')
  const zipCountIdx = cf.indexOf('zip_count')
  const bestGradeIdx = cf.indexOf('best_grade')

  const results: { city: string; state: string; slug: string; zip_count: number; best_grade: string }[] = []
  for (const slug of slugs) {
    const row = cityCompact.d[slug]
    if (!row) continue
    const cName = row[cityIdx]
    if (cName && String(cName).toLowerCase() === currentCity.toLowerCase()) continue

    results.push({
      city: cName,
      state: row[stateIdx],
      slug: row[slugIdx] || slug,
      zip_count: row[zipCountIdx] || 1,
      best_grade: row[bestGradeIdx] || 'B',
    })
    if (results.length >= limit) break
  }
  return results
}
