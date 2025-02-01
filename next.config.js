/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
  {
        protocol: 'https', 
        hostname: '**', 
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ]
  },
  transpilePackages: ['geist'],
  output:'standalone',
};

module.exports = nextConfig;
