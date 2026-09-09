/** @type {import('next').NextConfig} */
const nextConfig = {
  // ISR is used for ZIP/City pages — no 'output: standalone' needed on Vercel
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  poweredByHeader: false,
  async redirects() {
    return [
      // 1. Enforce www subdomain sitewide (Permanent 308 redirect) — fixes 9 duplicate canonical errors
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'watersafecheck.com',
          },
        ],
        destination: 'https://www.watersafecheck.com/:path*',
        permanent: true,
      },
      // 2. Base directory redirects (fixes orphan 4xx / 404 errors when bots crawl root paths)
      {
        source: '/zip',
        destination: '/',
        permanent: true,
      },
      {
        source: '/city',
        destination: '/',
        permanent: true,
      },
      {
        source: '/state',
        destination: '/',
        permanent: true,
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
      {
        source: '/sitemap(.*).xml',
        headers: [
          { key: 'Content-Type', value: 'application/xml; charset=utf-8' },
          { key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' },
        ],
      },
    ]
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || []
    }
    return config
  },
}

module.exports = nextConfig

