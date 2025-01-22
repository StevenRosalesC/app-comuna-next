/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // {
      //   protocol: 'https',
      //   hostname: 'utfs.io',
      //   port: ''
      // },
      // {
      //   protocol: 'https',
      //   hostname: 'api.slingacademy.com',
      //   port: ''
      // },
      // {
      //   protocol: 'https',
      //   hostname: 'secure.gravatar.com',
      //   port: ''
      // },
      // {
      //   protocol: 'https',
      //   hostname: 'avatar-management--avatars.us-west-2.prod.public.atl-paas.net',
      //   port: ''
      // },
      // {
      //   protocol: 'https',
      //   hostname: 'ik.imagekit.io',
      //   port: ''
      // },
      // {
      //   protocol: 'https',
      //   hostname: 'flowbite.s3.amazonaws.com',
      //   port: ''
      // },
      // {
      //   protocol: 'https',
      //   hostname: 'i.ibb.co',
      //   port: ''
      // },
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
};

module.exports = nextConfig;
