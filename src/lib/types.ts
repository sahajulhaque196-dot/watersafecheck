// src/lib/types.ts
export interface ZipData {
  zip: string
  city: string
  state: string
  county: string
  system_name: string
  pwsid: string
  population: number
  water_source: string
  lat: number | null
  lon: number | null
  total_violations: number
  health_violations: number
  unresolved_violations: number
  score: number | null
  grade: string
  lead_mg_l: number | null
  copper_mg_l: number | null
  radon_zone: number | null
  contaminant_count: number
  contaminants: string
  has_active_issues: boolean
  boil_water_advisories: number
  enforcement_actions: number
  lead_risk: string
  lead_prob: number | null
  compliance_risk: string
  compliance_score: number | null
  flood_cost: number | null
  energy_burden: number | null
  ccr_available: boolean
  ccr_lead_ppb: number | null
  ccr_copper_ppb: number | null
  ccr_top_contaminants: string
  ccr_source_type: string
}

export interface StateData {
  code: string
  name: string
  zip_count: number
  total_violations: number
  health_violations: number
  avg_score: number | null
  grade_dist: Record<string, number>
  high_lead_pct: number
  surface_water_pct: number
  cities: string[]
  zips: string[]
  worst_zips: Partial<ZipData>[]
  best_zips: Partial<ZipData>[]
}

export interface CityData {
  city: string
  state: string
  state_name: string
  zip_count: number
  zips: string[]
  total_violations: number
  health_violations: number
  avg_score: number | null
  best_grade: string | null
  water_source: string
  population: number
  high_lead: boolean
}

export type Grade = 'A' | 'B' | 'C' | 'D' | 'F'
export type RiskLevel = 'Low' | 'Moderate' | 'High' | 'Very High' | 'Critical'
