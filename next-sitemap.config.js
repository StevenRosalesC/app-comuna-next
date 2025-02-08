/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: `https://${
    process.env.NEXT_PUBLIC_APP_URL || 'ww.steven-dev-apps.me'
  }`,
  generateRobotsTxt: true, // (optional)
  exclude: ['/api/*', '/auth/forgot-password', ,], // <= exclude here
  robotsTxtOptions: {
    additionalSitemaps: [
      `https://${
        process.env.NEXT_PUBLIC_APP_URL || 'ww.steven-dev-apps.me'
      }/sitemap.xml`
    ]
  }
};
