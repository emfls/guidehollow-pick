import type { APIRoute } from 'astro';
import { categories } from '../data/categories';
import { getPublishedGuides } from '../lib/guides';
import { site } from '../config';

export const GET: APIRoute = async () => {
  const guides = await getPublishedGuides();
  const paths = [
    '/',
    '/about/',
    '/disclosure/',
    '/privacy/',
    ...categories.map((category) => `/category/${category.id}/`),
    ...guides.map((guide) => `/guides/${guide.id}/`),
  ];
  const urls = paths
    .map((path) => `  <url><loc>${new URL(path, site.url).toString()}</loc></url>`)
    .join('\n');
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
};
