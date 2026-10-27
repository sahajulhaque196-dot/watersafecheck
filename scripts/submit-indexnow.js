// scripts/submit-indexnow.js
// Submits priority URLs to IndexNow API (Bing, Yandex, Seznam, Naver) for instant crawl acceleration
const https = require('https');

const host = 'watersafecheck.com';
const key = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
const keyLocation = `https://${host}/${key}.txt`;

// Priority URLs: Core site pages, trending states and high-demand cities/ZIPs
const urlList = [
  `https://${host}/`,
  `https://${host}/about`,
  `https://${host}/water-quality-guide`,
  `https://${host}/blog`,
  `https://${host}/blog/moving-to-a-new-city-water-quality-guide`,
  `https://${host}/state/il`,
  `https://${host}/state/ca`,
  `https://${host}/state/tx`,
  `https://${host}/state/fl`,
  `https://${host}/state/ny`,
  `https://${host}/city/maize-ks`,
  `https://${host}/city/franklinton-nc`,
  `https://${host}/city/chesterton-in`,
  `https://${host}/city/rockledge-fl`,
  `https://${host}/zip/65041`,
  `https://${host}/zip/04064`,
  `https://${host}/zip/90210`,
  `https://${host}/zip/10001`
];

const postData = JSON.stringify({
  host,
  key,
  keyLocation,
  urlList
});

const options = {
  hostname: 'api.indexnow.org',
  port: 443,
  path: '/IndexNow',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = https.request(options, (res) => {
  console.log('IndexNow Response Status:', res.statusCode);
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    if (res.statusCode === 200 || res.statusCode === 202) {
      console.log('IndexNow submission successful! Crawlers notified.');
    } else {
      console.log('IndexNow response:', data);
    }
  });
});

req.on('error', (e) => {
  console.error('IndexNow error:', e.message);
});

req.write(postData);
req.end();
