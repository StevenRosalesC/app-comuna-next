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
