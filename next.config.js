/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cloudflare Pages deployment
  output: 'standalone',
  experimental: {
    serverComponentsExternalPackages: ['mammoth'],
  },
}

module.exports = nextConfig
