// scripts/upload.js
// Standing script to upload local JSON databases to Supabase.
// Run this locally via: node scripts/upload.js

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// 1. Manually parse .env.local to get Supabase credentials
let supabaseUrl = '';
let supabaseKey = '';

try {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const parts = trimmed.split('=');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const val = parts.slice(1).join('=').trim();
        if (key === 'NEXT_PUBLIC_SUPABASE_URL') supabaseUrl = val;
        if (key === 'NEXT_PUBLIC_SUPABASE_ANON_KEY') supabaseKey = val;
      }
    }
  }
} catch (e) {
  console.error('Failed to parse .env.local:', e);
}

if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your-project-id')) {
  console.error('ERROR: Please set your valid Supabase credentials in .env.local first!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false }
});

const BATCH_SIZE = 500;

async function uploadStates() {
  console.log('--- Uploading States ---');
  const filePath = path.join(__dirname, '..', 'src/data/state_data.json');
  if (!fs.existsSync(filePath)) {
    console.log('state_data.json not found, skipping...');
    return;
  }
  const raw = fs.readFileSync(filePath, 'utf8');
  const statesObj = JSON.parse(raw);
  
  // Format to array
  const statesArray = Object.entries(statesObj).map(([code, data]) => ({
    code,
    name: data.name,
    zip_count: data.zip_count,
    total_violations: data.total_violations,
    health_violations: data.health_violations,
    avg_score: data.avg_score,
    grade_dist: data.grade_dist,
    high_lead_pct: data.high_lead_pct,
    surface_water_pct: data.surface_water_pct,
    cities: data.cities,
    zips: data.zips,
    worst_zips: data.worst_zips,
    best_zips: data.best_zips
  }));

  console.log(`Found ${statesArray.length} states. Uploading...`);
  const { error } = await supabase.from('states').upsert(statesArray);
  if (error) {
    console.error('Failed to upload states:', error);
    throw error;
  }
  console.log('States uploaded successfully!');
}

async function uploadCities() {
  console.log('--- Uploading Cities ---');
  const filePath = path.join(__dirname, '..', 'src/data/city_data.json');
  if (!fs.existsSync(filePath)) {
    console.log('city_data.json not found, skipping...');
    return;
  }
  const raw = fs.readFileSync(filePath, 'utf8');
  const citiesObj = JSON.parse(raw);
  
  const citiesArray = Object.entries(citiesObj).map(([slug, data]) => ({
    slug,
    city: data.city,
    state: data.state,
    state_name: data.state_name,
    zip_count: data.zip_count,
    zips: data.zips,
    total_violations: data.total_violations,
    health_violations: data.health_violations,
    avg_score: data.avg_score,
    best_grade: data.best_grade,
    water_source: data.water_source,
    population: data.population,
    high_lead: data.high_lead
  }));

  console.log(`Found ${citiesArray.length} cities. Uploading in batches of ${BATCH_SIZE}...`);
  for (let i = 0; i < citiesArray.length; i += BATCH_SIZE) {
    const batch = citiesArray.slice(i, i + BATCH_SIZE);
    const { error } = await supabase.from('cities').upsert(batch);
    if (error) {
      console.error(`Failed to upload cities batch starting at index ${i}:`, error);
      throw error;
    }
    console.log(`Uploaded cities: ${i + batch.length}/${citiesArray.length}`);
  }
  console.log('Cities uploaded successfully!');
}

async function uploadZips() {
  console.log('--- Uploading Zips (This may take a moment) ---');
  const filePath = path.join(__dirname, '..', 'src/data/zip_data.json');
  if (!fs.existsSync(filePath)) {
    console.log('zip_data.json not found, skipping...');
    return;
  }
  const raw = fs.readFileSync(filePath, 'utf8');
  const zipsObj = JSON.parse(raw);
  
  const zipsArray = Object.values(zipsObj).map(data => ({
    zip: data.zip,
    city: data.city,
    state: data.state,
    county: data.county,
    system_name: data.system_name,
    pwsid: data.pwsid,
    population: data.population,
    water_source: data.water_source,
    lat: data.lat,
    lon: data.lon,
    total_violations: data.total_violations,
    health_violations: data.health_violations,
    unresolved_violations: data.unresolved_violations,
    score: data.score,
    grade: data.grade,
    lead_mg_l: data.lead_mg_l,
    copper_mg_l: data.copper_mg_l,
    radon_zone: data.radon_zone,
    contaminant_count: data.contaminant_count,
    contaminants: data.contaminants,
    has_active_issues: data.has_active_issues,
    boil_water_advisories: data.boil_water_advisories,
    enforcement_actions: data.enforcement_actions,
    lead_risk: data.lead_risk,
    lead_prob: data.lead_prob,
    compliance_risk: data.compliance_risk,
    compliance_score: data.compliance_score,
    flood_cost: data.flood_cost,
    energy_burden: data.energy_burden,
    ccr_available: data.ccr_available,
    ccr_lead_ppb: data.ccr_lead_ppb,
    ccr_copper_ppb: data.ccr_copper_ppb,
    ccr_top_contaminants: data.ccr_top_contaminants,
    ccr_source_type: data.ccr_source_type
  }));

  console.log(`Found ${zipsArray.length} ZIP codes. Uploading in batches of ${BATCH_SIZE}...`);
  for (let i = 0; i < zipsArray.length; i += BATCH_SIZE) {
    const batch = zipsArray.slice(i, i + BATCH_SIZE);
    const { error } = await supabase.from('zips').upsert(batch);
    if (error) {
      console.error(`Failed to upload ZIPs batch starting at index ${i}:`, error);
      throw error;
    }
    console.log(`Uploaded ZIPs: ${i + batch.length}/${zipsArray.length}`);
  }
  console.log('ZIP codes uploaded successfully!');
}

async function run() {
  try {
    await uploadStates();
    await uploadCities();
    await uploadZips();
    console.log('ALL DATA MIGRATED TO SUPABASE SUCCESSFULLY! 🎉');
  } catch (e) {
    console.error('Migration failed:', e);
  }
}

run();
