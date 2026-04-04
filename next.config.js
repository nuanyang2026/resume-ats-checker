/** @type {import('next').NextConfig} */
const nextConfig = {
  // For Cloudflare Pages, use 'export' for static or leave default for Node runtime
  // Switch to 'standalone' only when deploying to Node-based infra
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ['mammoth'],
  },
  webpack: (config) => {
    // Required for pdf.js to work in webpack
    config.resolve.alias.canvas = false
    return config
  },
}

module.exports = nextConfig
