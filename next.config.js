/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['flipeffective.com', 'wp-content', 'images.unsplash.com'],
    unoptimized: true,
  },
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig
