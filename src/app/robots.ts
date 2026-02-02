import { MetadataRoute } from 'next';

/**
 * Robots.txt configuration for search engine crawling
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://hyunjoong.com/sitemap.xml',
  };
}
