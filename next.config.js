/** @type {import('next').NextConfig} */
const nextConfig = {
  // ISR is used for ZIP/City pages — no 'output: standalone' needed on Vercel
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {},
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
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

