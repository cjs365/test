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
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'cloudfront-us-east-2.images.arcpublishing.com',
        pathname: '**',
      },
    ],
  },
}

module.exports = nextConfig 