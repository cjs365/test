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
  async redirects() {
    return [
      {
        source: '/methodology',
        destination: '/academy/methodology',
        permanent: true,
      },
      {
        source: '/api/portfolios',
        destination: '/api/v1/portfolios',
        permanent: false,
      },
      {
        source: '/api/portfolios/:ticker',
        destination: '/api/v1/portfolios/:ticker',
        permanent: false,
      },
      {
        source: '/api/portfolios/:ticker/holdings',
        destination: '/api/v1/portfolios/:ticker/holdings',
        permanent: false,
      },
      {
        source: '/api/portfolios/:ticker/factors',
        destination: '/api/v1/portfolios/:ticker/factors',
        permanent: false,
      },
    ];
  },
}

module.exports = nextConfig 