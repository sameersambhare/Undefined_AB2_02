import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/'],
    },
    sitemap: 'https://snapuiux.vercel.app/sitemap.xml',
    host: 'https://snapuiux.vercel.app',
  };
} 