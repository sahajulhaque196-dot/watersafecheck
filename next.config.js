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
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || []
    }
    return config
  },
}

module.exports = nextConfig
