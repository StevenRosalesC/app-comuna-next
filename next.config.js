/** @type {import('next').NextConfig} */
const parseImageRemotePatterns = () => {
  const raw = process.env.NEXT_IMAGE_REMOTE_HOSTS || '';
  const items = raw
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean);

  if (items.length === 0) return [];

  const patterns = [];

  for (const item of items) {
    try {
      const asUrl =
        item.startsWith('http://') || item.startsWith('https://')
          ? new URL(item)
          : new URL(`https://${item}`);

      patterns.push({
        protocol: asUrl.protocol.replace(':', ''),
        hostname: asUrl.hostname,
        ...(asUrl.port ? { port: asUrl.port } : {})
      });
    } catch {}
  }

  return patterns;
};

const nextConfig = {
  images: {
    remotePatterns:
      parseImageRemotePatterns()
  },
  reactStrictMode: false,
  transpilePackages: ['shiki'],
  output: process.env.NODE_ENV !== 'production' ? undefined : 'standalone',
  experimental: {
    optimizeCss: false,
    cpus: 1
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
  ...(process.env.NODE_ENV === 'production' && {
    compiler: {
      removeConsole: true
    }
  })
};

module.exports = nextConfig;
