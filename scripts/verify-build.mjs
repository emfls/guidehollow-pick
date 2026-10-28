import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const expected = [
  'index.html','CNAME','.nojekyll','robots.txt','sitemap.xml',
  'about/index.html','disclosure/index.html','privacy/index.html',
  'category/appliances/index.html','category/cleaning/index.html','category/kitchen/index.html',
];
for (const path of expected) {
  if (!existsSync(join('dist',path))) throw new Error('Missing build file: ' + path);
}
function read(path) { return readFileSync(join('dist',path),'utf8'); }
const home=read('index.html');
if (!home.includes('사기 전에') || !home.includes('구매 전 점검 항목')) throw new Error('Updated homepage missing');
if (!home.includes('noindex, follow')) throw new Error('Indexing safety guard missing');
if (!home.includes('<meta name="naver-site-verification" content="84cf9dd15c0a888f0516823fa7a1908e157c4d7f"')) throw new Error('Naver site ownership verification meta tag missing');
if (!home.includes('https://pick.guidehollow.com/')) throw new Error('Canonical host missing');
if (!home.includes('href="/category/appliances/"') || !home.includes('href="/category/cleaning/"') || !home.includes('href="/category/kitchen/"')) throw new Error('Category navigation missing');
if (!home.includes('aria-labelledby="hero-title"') || !home.includes('id="latest"') || !home.includes('id="categories"')) throw new Error('Homepage scan order and landmarks missing');
if (!home.includes('검증되지 않은 제품은 추천하지 않습니다') || !home.includes('추천에 앞서 검증합니다')) throw new Error('Evidence-first trust signals missing');
const category=read('category/appliances/index.html');
const guideDir = join('dist', 'guides');
const publishedSlugs = existsSync(guideDir) ? readdirSync(guideDir, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name) : [];
if (publishedSlugs.length === 0 && !category.includes('아직 공개된 가이드가 없습니다')) throw new Error('Empty-state guard missing');
if (publishedSlugs.length > 0 && !category.includes('href="/guides/')) throw new Error('Published category guide links missing');
for (const slug of publishedSlugs) {
  const page = read(`guides/${slug}/index.html`);
  if (!page.includes('자료 및 출처') || !page.includes('noindex, follow')) throw new Error('Published guide missing sources or indexing guard: ' + slug);
  if (/<p[^>]*>[^<]*\\*\\*[^<]*<\\/p>/.test(page)) throw new Error('Unrendered Markdown emphasis in article paragraph: ' + slug);
  if (!page.includes('href="https://') || !page.includes('제품')) throw new Error('Published guide may be incomplete: ' + slug);
  if (!page.includes('id="summary-title"') || !page.includes('class="article-layout"') || !page.includes('이 글의 목차')) throw new Error('Guide reading UI missing: ' + slug);
  if (!page.includes('id="sources"')) throw new Error('Sources landmark missing: ' + slug);
  if (!home.includes(`/guides/${slug}/`)) throw new Error('Published guide missing from homepage: ' + slug);
}
if (read('CNAME').trim()!=='pick.guidehollow.com') throw new Error('CNAME incorrect');
if (!read('robots.txt').includes('https://pick.guidehollow.com/sitemap.xml')) throw new Error('robots.txt incorrect');
const sitemap=read('sitemap.xml');
if (!sitemap.includes('https://pick.guidehollow.com/category/kitchen/')) throw new Error('Sitemap missing category');
for (const slug of publishedSlugs) {
  if (!sitemap.includes(`https://pick.guidehollow.com/guides/${slug}/`)) throw new Error('Published guide missing from sitemap: ' + slug);
}
if (sitemap.includes('sample-draft')) throw new Error('Draft leaked into sitemap');
if (existsSync(join('dist','guides','sample-draft','index.html'))) throw new Error('Draft leaked as public page');
console.log('GuideHollow Pick verified: readable homepage, 3 categories, article TOC, sources, SEO and draft isolation.');
