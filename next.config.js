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
  reactStrictMode: false,
  transpilePackages: ['geist'],
  output: process.env.NODE_ENV !== 'production' ? undefined : 'standalone',
  experimental: {
    optimizeCss: false,
    // Reduce memory usage during build
    workerThreads: false,
    cpus: 1,
  },
  // Optimize bundle size
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  // Reduce memory usage
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  // module: {
  //   rules: [
  //     {
  //       test: /\.scss$/,
  //       use: [
  //         "style-loader",
  //         "css-loader",
  //         "sass-loader"
  //       ]
  //     }
  //   ]
  // },
  //  serverComponentsExternalPackages: ["shiki"],
    transpilePackages: ['shiki'],
    
    ...(process.env.NODE_ENV === 'production' && {
      compiler: {
        removeConsole: true
      }
    })
};

module.exports = nextConfig;
