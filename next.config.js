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
  experimental: {
    optimizeCss: false,
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          "style-loader",
          "css-loader",
          "sass-loader"
        ]
      }
    ]
  },
   serverComponentsExternalPackages: ["shiki"],
    transpilePackages: ['shiki']
};

module.exports = nextConfig;
