// scripts/compact-data.js
// Converts verbose JSON key-value datasets into compact columnar representation.
// Eliminates 24+ MB of duplicate key strings to fit within Cloudflare Pages 25MB bundle limit.

const fs = require('fs');
const path = require('path');

function compactFile(filePath) {
  console.log(`Compacting ${filePath}...`);
  const raw = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  // If already compacted, return
  if (raw.f && raw.d) {
    console.log(`Already compacted: ${filePath}`);
    return;
  }

  const keys = Object.keys(raw);
  if (keys.length === 0) return;

  const firstKey = keys[0];
  const fields = Object.keys(raw[firstKey]);

  const rows = {};
  for (const k of keys) {
    const item = raw[k];
    rows[k] = fields.map(f => item[f]);
  }

  const compacted = { f: fields, d: rows };
  const jsonStr = JSON.stringify(compacted);
  
  const originalSize = fs.statSync(filePath).size;
  fs.writeFileSync(filePath, jsonStr, 'utf8');
  const newSize = fs.statSync(filePath).size;

  console.log(`Done: ${(originalSize / 1024 / 1024).toFixed(2)} MB -> ${(newSize / 1024 / 1024).toFixed(2)} MB (${((1 - newSize / originalSize) * 100).toFixed(1)}% reduction)`);
}

function run() {
  const zipPath = path.join(__dirname, '..', 'src', 'data', 'zip_data.json');
  const cityPath = path.join(__dirname, '..', 'src', 'data', 'city_data.json');

  compactFile(zipPath);
  compactFile(cityPath);
  console.log('--- All datasets successfully compacted! ---');
}

run();
