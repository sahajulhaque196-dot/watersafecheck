// scripts/generate-sitemaps.js
// High-performance sitemap generator reading directly from local JSON datasets.
// Produces 100% unified non-www sitemaps adhering to Google Search Console specs.

const fs = require('fs');
const path = require('path');

function run() {
  console.log('--- Generating All Sitemaps from Local Datasets ---');
  
  try {
    const statesPath = path.join(__dirname, '..', 'src', 'data', 'state_data.json');
    const citiesPath = path.join(__dirname, '..', 'src', 'data', 'city_data.json');
    const zipsPath = path.join(__dirname, '..', 'src', 'data', 'zip_data.json');

    console.log('Loading states...');
    const statesData = JSON.parse(fs.readFileSync(statesPath, 'utf8'));
    const stateCodes = Object.keys(statesData);

    console.log('Loading cities...');
    const citiesData = JSON.parse(fs.readFileSync(citiesPath, 'utf8'));
    const citySlugs = citiesData.d ? Object.keys(citiesData.d) : Object.keys(citiesData);

    console.log('Loading ZIP codes...');
    const zipsData = JSON.parse(fs.readFileSync(zipsPath, 'utf8'));
    const zipKeys = zipsData.d ? Object.keys(zipsData.d) : Object.keys(zipsData);

    console.log(`Loaded: ${stateCodes.length} States, ${citySlugs.length} Cities, ${zipKeys.length} ZIPs.`);

    // Strict non-www canonical base URL sitewide
    const baseUrl = 'https://watersafecheck.com';
    const now = new Date().toISOString().split('T')[0];

    const publicDir = path.join(__dirname, '..', 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    // 1. Generate sitemap-main.xml
    const blogSlugs = [
      'lead-in-tap-water-what-parents-need-to-know',
      'how-to-read-your-water-quality-report',
      'pfas-forever-chemicals-in-drinking-water',
      'best-water-filters-for-home-complete-guide',
      'private-well-water-safety-testing-guide',
      'hard-water-vs-soft-water-complete-guide',
      'nitrates-in-drinking-water-health-risks-and-solutions',
      'arsenic-in-drinking-water-what-you-need-to-know',
      'chlorine-in-tap-water-disinfection-byproducts-guide',
      'new-home-water-quality-checklist',
      'fluoride-in-drinking-water-facts-vs-fears',
      'drinking-water-safety-during-pregnancy',
      'renters-guide-to-tap-water-quality-and-rights',
      'microplastics-in-drinking-water-what-we-know',
      'boil-water-advisory-complete-guide-what-to-do',
      'how-to-test-your-home-water-quality-complete-guide',
      'legionella-in-water-systems-what-you-need-to-know',
      'tap-water-vs-filtered-vs-bottled-water-comparison',
      'water-quality-and-childrens-health-parents-guide',
      'water-quality-in-rural-america-unique-challenges'
    ];

    let mainXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${baseUrl}</loc><lastmod>${now}</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>
  <url><loc>${baseUrl}/water-quality-guide</loc><lastmod>${now}</lastmod><changefreq>monthly</changefreq><priority>0.9</priority></url>
  <url><loc>${baseUrl}/blog</loc><lastmod>${now}</lastmod><changefreq>weekly</changefreq><priority>0.85</priority></url>
  <url><loc>${baseUrl}/about</loc><lastmod>${now}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>${baseUrl}/contact</loc><lastmod>${now}</lastmod><changefreq>yearly</changefreq><priority>0.5</priority></url>
  <url><loc>${baseUrl}/terms</loc><lastmod>${now}</lastmod><changefreq>yearly</changefreq><priority>0.4</priority></url>
  <url><loc>${baseUrl}/privacy</loc><lastmod>${now}</lastmod><changefreq>yearly</changefreq><priority>0.4</priority></url>
  <url><loc>${baseUrl}/disclaimer</loc><lastmod>${now}</lastmod><changefreq>yearly</changefreq><priority>0.4</priority></url>\n`;

    for (const slug of blogSlugs) {
      mainXml += `  <url><loc>${baseUrl}/blog/${slug}</loc><lastmod>${now}</lastmod><changefreq>monthly</changefreq><priority>0.80</priority></url>\n`;
    }

    for (const code of stateCodes) {
      mainXml += `  <url><loc>${baseUrl}/state/${code.toLowerCase()}</loc><lastmod>${now}</lastmod><changefreq>monthly</changefreq><priority>0.85</priority></url>\n`;
    }
    mainXml += '</urlset>';
    fs.writeFileSync(path.join(publicDir, 'sitemap-main.xml'), mainXml, 'utf8');
    console.log('Saved sitemap-main.xml');

    // 2. Generate sitemap-cities.xml
    let citiesXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    for (const slug of citySlugs) {
      citiesXml += `  <url><loc>${baseUrl}/city/${slug}</loc><lastmod>${now}</lastmod><changefreq>monthly</changefreq><priority>0.75</priority></url>\n`;
    }
    citiesXml += '</urlset>';
    fs.writeFileSync(path.join(publicDir, 'sitemap-cities.xml'), citiesXml, 'utf8');
    console.log(`Saved sitemap-cities.xml (${citySlugs.length} URLs)`);

    // 3. Generate sitemap-zips-1.xml and sitemap-zips-2.xml
    const midIndex = Math.ceil(zipKeys.length / 2);
    const zips1 = zipKeys.slice(0, midIndex);
    const zips2 = zipKeys.slice(midIndex);

    let zips1Xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    for (const zip of zips1) {
      zips1Xml += `  <url><loc>${baseUrl}/zip/${zip}</loc><lastmod>${now}</lastmod><changefreq>monthly</changefreq><priority>0.70</priority></url>\n`;
    }
    zips1Xml += '</urlset>';
    fs.writeFileSync(path.join(publicDir, 'sitemap-zips-1.xml'), zips1Xml, 'utf8');
    console.log(`Saved sitemap-zips-1.xml (${zips1.length} URLs)`);

    let zips2Xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    for (const zip of zips2) {
      zips2Xml += `  <url><loc>${baseUrl}/zip/${zip}</loc><lastmod>${now}</lastmod><changefreq>monthly</changefreq><priority>0.70</priority></url>\n`;
    }
    zips2Xml += '</urlset>';
    fs.writeFileSync(path.join(publicDir, 'sitemap-zips-2.xml'), zips2Xml, 'utf8');
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

    fs.writeFileSync(path.join(publicDir, 'sitemap-index.xml'), indexXml, 'utf8');
    console.log('Saved sitemap-index.xml');
    console.log('SITEMAPS GENERATION COMPLETED SUCCESSFULLY! 🎉');

  } catch (e) {
    console.error('Error generating sitemaps:', e);
  }
}

run();
