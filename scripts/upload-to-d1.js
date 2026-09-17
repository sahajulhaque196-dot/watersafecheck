// scripts/upload-to-d1.js
const fs = require('fs');
const path = require('path');

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID || '2315d8150d6cf9140fb99f826d85eb21';
const dbId = process.env.CLOUDFLARE_DATABASE_ID || '2e8eed70-7477-4da0-a2bf-63e927bd5873';
const token = process.env.CLOUDFLARE_API_TOKEN;

const API_URL = `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${dbId}/query`;

async function executeQuery(sql, params = []) {
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sql, params }),
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(JSON.stringify(data.errors));
      }
      return data;
    } catch (err) {
      if (attempt === 4) throw err;
      await new Promise((r) => setTimeout(r, 800 * attempt));
    }
  }
}

async function runBatchesConcurrently(items, batchSize, concurrency, fn) {
  const batches = [];
  for (let i = 0; i < items.length; i += batchSize) {
    batches.push(items.slice(i, i + batchSize));
  }

  let completed = 0;
  let index = 0;

  async function worker() {
    while (index < batches.length) {
      const currentIdx = index++;
      const batch = batches[currentIdx];
      await fn(batch);
      completed += batch.length;
      if (completed % 5000 < batchSize || completed >= items.length) {
        process.stdout.write(`Progress: ${completed} / ${items.length}\r`);
      }
    }
  }

  const workers = Array(concurrency).fill(0).map(() => worker());
  await Promise.all(workers);
  console.log(`\nCompleted ${items.length} items.`);
}

async function uploadCities() {
  console.log('\n--- Uploading Cities (29,555) ---');
  const citiesPath = path.join(__dirname, '..', 'src', 'data', 'city_data.json');
  const cities = JSON.parse(fs.readFileSync(citiesPath, 'utf8'));
  const entries = Object.entries(cities);

  await runBatchesConcurrently(entries, 20, 10, async (batch) => {
    const placeholders = batch.map(() => '(?, ?, ?, ?)').join(', ');
    const sql = `INSERT OR REPLACE INTO cities (slug, city, state, data) VALUES ${placeholders};`;
    const params = [];
    for (const [slug, data] of batch) {
      params.push(slug.toLowerCase(), data.city || '', data.state || '', JSON.stringify(data));
    }
    await executeQuery(sql, params);
  });
}

async function uploadZips() {
  console.log('\n--- Uploading Zips (41,344) ---');
  const zipsPath = path.join(__dirname, '..', 'src', 'data', 'zip_data.json');
  const zips = JSON.parse(fs.readFileSync(zipsPath, 'utf8'));
  const entries = Object.entries(zips);

  await runBatchesConcurrently(entries, 20, 10, async (batch) => {
    const placeholders = batch.map(() => '(?, ?, ?, ?)').join(', ');
    const sql = `INSERT OR REPLACE INTO zips (zip, city, state, data) VALUES ${placeholders};`;
    const params = [];
    for (const [zip, data] of batch) {
      params.push(String(zip).trim(), data.city || '', data.state || '', JSON.stringify(data));
    }
    await executeQuery(sql, params);
  });
}

async function main() {
  const t0 = Date.now();
  console.log('Starting Cloudflare D1 Data Migration...');
  await uploadCities();
  await uploadZips();
  console.log(`\n🎉 All data successfully migrated to Cloudflare D1 in ${((Date.now() - t0) / 1000).toFixed(1)}s!`);
}

main().catch(err => {
  console.error('\nMigration failed:', err);
  process.exit(1);
});
