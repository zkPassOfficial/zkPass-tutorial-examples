/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['backend.zkpass.org'],
    formats: ['image/avif', 'image/webp'],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  trailingSlash: true,
}

module.exports = nextConfig
