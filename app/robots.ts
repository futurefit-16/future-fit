import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/checkout/success',
        '/login',
        '/logout',
        '/register',
      ],
    },
    sitemap: 'https://wearfuturefit.com/sitemap.xml',
  }
}
