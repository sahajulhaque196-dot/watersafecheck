# WaterSafeCheck — Complete Deployment & Configuration Guide
**Domain:** WaterSafeCheck.com | **Stack:** Next.js 14 + Tailwind CSS | **Hosting:** Vercel (Free)

---

## ⚙️ STEP 1 — Replace These 3 Values (REQUIRED)

Open `src/app/layout.tsx` and find the CONFIGURATION block at the top:

```typescript
const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'            // ← Replace
const ADSENSE_PUBLISHER_ID = 'ca-pub-XXXXXXXXXXXXXXXX' // ← Replace
const SEARCH_CONSOLE_TOKEN = 'YOUR_GOOGLE_SEARCH_CONSOLE_TOKEN' // ← Replace
```

Also update `public/ads.txt`:
```
google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0
```
Replace `pub-XXXXXXXXXXXXXXXX` with your real AdSense Publisher ID.

Also update `src/components/ui/AdSense.tsx`:
```typescript
data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"  // ← Replace
```

Also update the ad slot IDs in `AdSense.tsx`:
- `slot="1111111111"` → Your Top Banner slot ID
- `slot="2222222222"` → Your Sidebar slot ID
- `slot="3333333333"` → Your In-Content slot ID
- `slot="4444444444"` → Your Bottom Banner slot ID

Also update the Formspree endpoint in `src/app/contact/page.tsx`:
```
action="https://formspree.io/f/YOUR_FORM_ID"
```

---

## 🚀 STEP 2 — Deploy to Vercel (FREE, ~5 minutes)

### Option A: GitHub + Vercel (Recommended)
```bash
# 1. Create GitHub repo and push code
cd watersafecheck
git init
git add .
git commit -m "Initial commit — WaterSafeCheck.com"
# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/watersafecheck.git
git push -u origin main

# 2. Go to vercel.com → Sign up with GitHub
# 3. Click "New Project" → Import your repo
# 4. Click "Deploy" — Vercel auto-detects Next.js
# 5. Done! Live at https://watersafecheck.vercel.app
```

### Option B: Vercel CLI
```bash
npm install -g vercel
cd watersafecheck
vercel --prod
```

### Connect Custom Domain (watersafecheck.com)
1. Vercel Dashboard → Settings → Domains
2. Add `watersafecheck.com` and `www.watersafecheck.com`
3. In your domain registrar:
   - CNAME: `www` → `cname.vercel-dns.com`
   - A record: `@` → `76.76.21.21`
4. Wait up to 48 hours for DNS propagation

---

## 📊 STEP 3 — Google Analytics 4 Setup

1. Go to **analytics.google.com**
2. Create account → Create Property → "Web"
3. Enter `watersafecheck.com` as website URL
4. Copy your **Measurement ID** (format: `G-XXXXXXXXXX`)
5. Paste into `src/app/layout.tsx`:
   ```typescript
   const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'  // your real ID
   ```
6. Redeploy — analytics will start tracking within 24 hours
7. Verify: GA4 → Reports → Realtime → visit your site

**What GA4 tracks automatically:**
- Pageviews per ZIP/State/City page
- ZIP search events
- Time on page (key for AdSense quality)
- Device type (mobile vs desktop)
- Geographic location of visitors

---

## 💰 STEP 4 — Google AdSense Setup

### Getting Approved (Important Steps)
1. Go to **ads.google.com** → Sign up
2. Add your site: `watersafecheck.com`
3. Google will give you your Publisher ID (`ca-pub-XXXXXXXXXXXXXXXX`)
4. Add it to 3 places (see STEP 1 above)
5. Submit for review

**AdSense Approval Requirements — All Done ✅:**
- ✅ Privacy Policy page (`/privacy`)
- ✅ Disclaimer page (`/disclaimer`)
- ✅ About page with real author (`/about`)
- ✅ Contact page with real email (`/contact`)
- ✅ Original, substantial content (800-3000 words per page)
- ✅ No thin/duplicate content — all data-driven unique pages
- ✅ ads.txt file in `/public/`
- ✅ No copyright violations
- ✅ Clean navigation, professional design

**Review timeline:** 1–14 days. Make sure to have at least 10–20 pages of content indexed in Google before applying.

### Ad Slot IDs
Create 4 ad units in your AdSense dashboard:
| Unit Name | Format | Placement |
|-----------|--------|-----------|
| Top Banner | Horizontal (728×90) | Above main content |
| Sidebar | Vertical (300×600) | Right sidebar on ZIP pages |
| In Content | Rectangle (300×250) | Middle of content |
| Bottom Banner | Auto | Below content |

Replace slot IDs in `src/components/ui/AdSense.tsx`.

---

## 🔍 STEP 5 — Google Search Console

1. Go to **search.google.com/search-console**
2. Add property → `https://www.watersafecheck.com`
3. Choose "HTML tag" verification method
4. Copy the token from the meta tag (format: `abc123xyz...`)
5. Paste into `src/app/layout.tsx`:
   ```typescript
   const SEARCH_CONSOLE_TOKEN = 'abc123xyz...'  // your real token
   ```
6. Redeploy, then verify in Search Console

**After verification:**
- Submit sitemap: `https://www.watersafecheck.com/sitemap.xml`
- Request indexing for your homepage
- Monitor crawl errors in Coverage report

---

## 📬 STEP 6 — Formspree Contact Form

1. Go to **formspree.io** → Sign up (free)
2. Click "New Form" → Name it "WaterSafeCheck Contact"
3. Copy your form endpoint (format: `https://formspree.io/f/xyzabc12`)
4. Update `src/app/contact/page.tsx`:
   ```tsx
   action="https://formspree.io/f/xyzabc12"  // your real endpoint
   ```
5. Set reply-to email in Formspree dashboard: `watersafecheck@gmail.com`
6. Free tier: 50 submissions/month

---

## 📁 Project Structure

```
watersafecheck/
├── src/
│   ├── app/
│   │   ├── page.tsx                    ← Homepage
│   │   ├── layout.tsx                  ← Root layout (GA4 + AdSense + schemas)
│   │   ├── globals.css                 ← Global styles
│   │   ├── sitemap.ts                  ← Auto sitemap generation
│   │   ├── robots.ts                   ← robots.txt generation
│   │   ├── not-found.tsx               ← 404 page
│   │   ├── zip/[slug]/page.tsx         ← 41,344 ZIP code pages (ISR)
│   │   ├── state/[slug]/page.tsx       ← 51 state pages (static)
│   │   ├── city/[slug]/page.tsx        ← 29,555 city pages (ISR)
│   │   ├── water-quality-guide/        ← Comprehensive educational guide
│   │   ├── about/                      ← About + author EEAT + methodology
│   │   ├── privacy/                    ← Privacy policy (AdSense req.)
│   │   ├── disclaimer/                 ← Disclaimer (AdSense req.)
│   │   ├── contact/                    ← Contact form → Formspree → Gmail
│   │   └── api/
│   │       ├── zip/route.ts            ← ZIP data API with caching
│   │       └── search/route.ts         ← Search autocomplete API
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx              ← Sticky header, mobile-responsive
│   │   │   └── Footer.tsx              ← Footer with state links
│   │   ├── ui/
│   │   │   ├── index.tsx               ← All UI components
│   │   │   └── AdSense.tsx             ← AdSense client component
│   │   └── sections/
│   │       └── HomeSearch.tsx          ← Homepage ZIP search widget
│   ├── lib/
│   │   ├── types.ts                    ← TypeScript interfaces
│   │   ├── data.ts                     ← Data loading + helper functions
│   │   ├── seo.ts                      ← SEO metadata + JSON-LD generators
│   │   └── content.ts                  ← 50+ conditional content blocks
│   └── data/
│       ├── zip_data.json               ← 41,344 ZIP records (30MB)
│       ├── state_data.json             ← 51 state summaries
│       └── city_data.json              ← 29,555 city summaries
├── public/
│   ├── ads.txt                         ← AdSense verification (REQUIRED)
│   ├── robots.txt                      ← Search engine crawl rules
│   └── favicon.svg                     ← Site icon
├── package.json                        ← Dependencies + build scripts
├── next.config.js                      ← Next.js configuration
├── tailwind.config.js                  ← Tailwind + safelist
├── tsconfig.json                       ← TypeScript config
├── vercel.json                         ← Vercel deployment config
└── .eslintrc.json                      ← ESLint rules
```

---

## 🔧 Common Issues & Fixes

### Build fails with memory error
Already handled: `NODE_OPTIONS=--max-old-space-size=4096` in `package.json` and `vercel.json`.

### "Module not found" errors
```bash
npm install
npm run build
```
Check that all imports in `src/app/page.tsx` match exact file paths.

### Ads not showing
- AdSense review takes 1–14 days after code is added
- Make sure Publisher ID is correct in all 3 places
- Check `ads.txt` is accessible at `watersafecheck.com/ads.txt`
- AdSense requires the site to be publicly accessible (not localhost)

### ZIP page shows "not found"
The ZIP must exist in `src/data/zip_data.json`. Check with:
```bash
node -e "const d=require('./src/data/zip_data.json'); console.log(d['90210']?.city)"
```

### Sitemap not showing all pages
Submit `https://www.watersafecheck.com/sitemap.xml` to Google Search Console. The sitemap generates dynamically — it doesn't need to list all 41K ZIPs since Google will find them through internal links.

---

## ✅ Pre-Launch Checklist

**Required (site won't work without these):**
- [ ] Replace `GA_MEASUREMENT_ID` with real GA4 ID
- [ ] Replace `ADSENSE_PUBLISHER_ID` with real Publisher ID
- [ ] Update `public/ads.txt` with real Publisher ID
- [ ] Update `src/components/ui/AdSense.tsx` with real Publisher ID + slot IDs
- [ ] Replace Formspree URL with real endpoint
- [ ] Add `SEARCH_CONSOLE_TOKEN` from Google Search Console

**Recommended before AdSense:**
- [ ] Submit sitemap.xml to Google Search Console
- [ ] Wait for 20+ pages to be indexed
- [ ] Set up GA4 and verify traffic is tracking
- [ ] Test mobile layout on real phone
- [ ] Test ZIP search with 10001, 90210, 60601
- [ ] Test state page: /state/ca, /state/tx
- [ ] Verify ads.txt accessible: watersafecheck.com/ads.txt
- [ ] Set up domain email forwarding to Gmail

**Optional but good:**
- [ ] Add real author photo to About page (replace the "M" initial box)
- [ ] Create og-image.png (1200×630) for social sharing
- [ ] Create proper PNG favicons from favicon.svg
- [ ] Connect Google Search Console to GA4

---

## 💰 Revenue Projection

| Monthly Traffic | Est. RPM | Est. Revenue |
|----------------|----------|-------------|
| 10,000 pageviews | $3–5 | $30–50/mo |
| 50,000 pageviews | $5–8 | $250–400/mo |
| 200,000 pageviews | $6–10 | $1,200–2,000/mo |
| 500,000 pageviews | $8–12 | $4,000–6,000/mo |

Water/health is a high-CPC niche. Expect above-average RPM once established.
