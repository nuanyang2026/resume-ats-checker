/** @type {import('next').NextConfig} */
const nextConfig = {
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
