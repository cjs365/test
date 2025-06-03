/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.reuters.com',
        pathname: '/resizer/**',
      },
    ],
    domains: ['images.unsplash.com'],
  },
}

module.exports = nextConfig 