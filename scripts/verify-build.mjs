import { existsSync, readFileSync } from 'node:fs';
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
const category=read('category/appliances/index.html');
if (!category.includes('아직 공개된 가이드가 없습니다')) throw new Error('Empty-state guard missing');
if (read('CNAME').trim()!=='pick.guidehollow.com') throw new Error('CNAME incorrect');
if (!read('robots.txt').includes('https://pick.guidehollow.com/sitemap.xml')) throw new Error('robots.txt incorrect');
const sitemap=read('sitemap.xml');
if (!sitemap.includes('https://pick.guidehollow.com/category/kitchen/')) throw new Error('Sitemap missing category');
if (sitemap.includes('sample-draft')) throw new Error('Draft leaked into sitemap');
if (existsSync(join('dist','guides','sample-draft','index.html'))) throw new Error('Draft leaked as public page');
console.log('GuideHollow Pick verified: homepage, 3 categories, SEO, disclosure routes, draft isolation.');
