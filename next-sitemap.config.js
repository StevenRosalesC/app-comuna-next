/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: `https://${process.env.NEXT_PUBLIC_APP_URL || 'www.steven-dev-apps.me'
    }`,
  generateRobotsTxt: true, // (optional)
  exclude: [
    '/api/*',
    '/auth/forgot-password',
    '/sitemap.xml',
    ,], // <= exclude here
  robotsTxtOptions: {
    additionalSitemaps: [
    ]
  }
};
