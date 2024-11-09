/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.prismic.io',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.thesportsdb.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.sportmonks.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.api-football.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'media.api-sports.io',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    appDir: true,
  },
  async redirects() {
    return [];
  },
  async rewrites() {
    return [];
  },
};

export default nextConfig;