import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const expected = [
  'index.html',
  'CNAME',
  '.nojekyll',
  'robots.txt',
  'sitemap.xml',
  'about/index.html',
  'disclosure/index.html',
  'privacy/index.html',
  'category/appliances/index.html',
  'category/cleaning/index.html',
  'category/kitchen/index.html',
];
for (const path of expected) {
  if (!existsSync(join('dist', path))) throw new Error(`Build missing ${path}`);
}
const home = readFileSync(join('dist','index.html'), 'utf8');
if (!home.includes('사기 전에') || !home.includes('noindex, follow')) throw new Error('Starter homepage or safe indexing guard missing');
if (!home.includes('https://pick.guidehollow.com/')) throw new Error('Canonical domain missing');
const cname = readFileSync(join('dist','CNAME'), 'utf8').trim();
if (cname !== 'pick.guidehollow.com') throw new Error('Incorrect CNAME');
const robots = readFileSync(join('dist', 'robots.txt'), 'utf8');
if (!robots.includes('https://pick.guidehollow.com/sitemap.xml')) throw new Error('Incorrect robots sitemap');
console.log('GuideHollow Pick build smoke test passed (' + expected.length + ' required assets).');
