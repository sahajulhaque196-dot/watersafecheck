// scripts/generate-sitemaps.js
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Credentials from .env.local or defaults
const supabaseUrl = 'https://qhhamaaveozfanixkkqd.supabase.co';
const supabaseKey = 'sb_publishable_suP6DNVdVwJfuEEwhEEM9g_zJk0779G';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false }
});

// Helper to fetch all rows using pagination
async function fetchAllRows(tableName, orderColumn, selectColumns) {
  let allData = [];
  let from = 0;
  const step = 1000;
  let hasMore = true;

  while (hasMore) {
    const to = from + step - 1;
    const { data, error } = await supabase
      .from(tableName)
      .select(selectColumns)
      .order(orderColumn, { ascending: true })
      .range(from, to);

    if (error) {
      throw error;
    }

    allData = allData.concat(data);
    console.log(`Fetched ${allData.length} rows from ${tableName}...`);

    if (data.length < step) {
      hasMore = false;
    } else {
      from += step;
    }
  }

  return allData;
}

async function run() {
  console.log('--- Generating All Sitemaps ---');
  
  try {
    console.log('Fetching states...');
    const { data: states, error: statesError } = await supabase.from('states').select('code');
    if (statesError) throw statesError;

    console.log('Fetching cities...');
    const cities = await fetchAllRows('cities', 'slug', 'slug');

    console.log('Fetching ZIP codes...');
    const zips = await fetchAllRows('zips', 'zip', 'zip');

    console.log(`Successfully fetched all data from Supabase. States: ${states.length}, Cities: ${cities.length}, ZIPs: ${zips.length}`);

    const baseUrl = 'https://www.watersafecheck.com';
    const now = new Date().toISOString().split('T')[0];

    // Create public directory if it doesn't exist
    const publicDir = path.join(__dirname, '..', 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir);
    }

    // 1. Generate sitemap-main.xml
    let mainXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${baseUrl}</loc><lastmod>${now}</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>
  <url><loc>${baseUrl}/water-quality-guide</loc><lastmod>${now}</lastmod><changefreq>monthly</changefreq><priority>0.9</priority></url>
  <url><loc>${baseUrl}/about</loc><lastmod>${now}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>${baseUrl}/contact</loc><lastmod>${now}</lastmod><changefreq>yearly</changefreq><priority>0.5</priority></url>
  <url><loc>${baseUrl}/privacy</loc><lastmod>${now}</lastmod><changefreq>yearly</changefreq><priority>0.4</priority></url>
  <url><loc>${baseUrl}/disclaimer</loc><lastmod>${now}</lastmod><changefreq>yearly</changefreq><priority>0.4</priority></url>\n`;

    for (const s of states) {
      mainXml += `  <url><loc>${baseUrl}/state/${s.code.toLowerCase()}</loc><lastmod>${now}</lastmod><changefreq>monthly</changefreq><priority>0.85</priority></url>\n`;
    }
    mainXml += '</urlset>';
    fs.writeFileSync(path.join(publicDir, 'sitemap-main.xml'), mainXml);
    console.log('Saved sitemap-main.xml');

    // 2. Generate sitemap-cities.xml
    let citiesXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    for (const c of cities) {
      citiesXml += `  <url><loc>${baseUrl}/city/${c.slug}</loc><lastmod>${now}</lastmod><changefreq>monthly</changefreq><priority>0.75</priority></url>\n`;
    }
    citiesXml += '</urlset>';
    fs.writeFileSync(path.join(publicDir, 'sitemap-cities.xml'), citiesXml);
    console.log('Saved sitemap-cities.xml');

    // 3. Generate sitemap-zips-1.xml and sitemap-zips-2.xml (split into 2 files to keep size low)
    const midIndex = Math.ceil(zips.length / 2);
    const zips1 = zips.slice(0, midIndex);
    const zips2 = zips.slice(midIndex);

    let zips1Xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    for (const z of zips1) {
      zips1Xml += `  <url><loc>${baseUrl}/zip/${z.zip}</loc><lastmod>${now}</lastmod><changefreq>monthly</changefreq><priority>0.70</priority></url>\n`;
    }
    zips1Xml += '</urlset>';
    fs.writeFileSync(path.join(publicDir, 'sitemap-zips-1.xml'), zips1Xml);
    console.log(`Saved sitemap-zips-1.xml (${zips1.length} URLs)`);

    let zips2Xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    for (const z of zips2) {
      zips2Xml += `  <url><loc>${baseUrl}/zip/${z.zip}</loc><lastmod>${now}</lastmod><changefreq>monthly</changefreq><priority>0.70</priority></url>\n`;
    }
    zips2Xml += '</urlset>';
    fs.writeFileSync(path.join(publicDir, 'sitemap-zips-2.xml'), zips2Xml);
    console.log(`Saved sitemap-zips-2.xml (${zips2.length} URLs)`);

    // 4. Generate sitemap-index.xml
    const indexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemap-main.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-cities.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-zips-1.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-zips-2.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
</sitemapindex>\n`;

    fs.writeFileSync(path.join(publicDir, 'sitemap-index.xml'), indexXml);
    console.log('Saved sitemap-index.xml');
    console.log('SITEMAPS GENERATION COMPLETED SUCCESSFULLY! 🎉');

  } catch (e) {
    console.error('Error generating sitemaps:', e);
  }
}

run();
