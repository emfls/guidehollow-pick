import assert from 'node:assert/strict';
import { parseStaticPartnerHtml, resolvePartnerLink, verifiedCoupangUrl } from '../src/lib/partner-code.ts';

const url = 'https://link.coupang.com/a/verified-demo';
const image = 'https://static.coupangcdn.com/image/affiliate/demo.jpg';
assert.equal(verifiedCoupangUrl(url), url);
assert.equal(verifiedCoupangUrl('https://coupa.ng/verified-demo'), 'https://coupa.ng/verified-demo');
assert.equal(verifiedCoupangUrl('http://link.coupang.com/a/verified-demo'), null);
assert.equal(verifiedCoupangUrl('https://link.coupang.com.evil.example/a/a'), null);
assert.equal(verifiedCoupangUrl('https://www.coupang.com@evil.example/a/a'), null);
assert.equal(verifiedCoupangUrl('javascript:alert(1)'), null);

assert.deepEqual(parseStaticPartnerHtml('<a target="_blank" href="' + url + '">상품 보기</a>'),
  { url, source: 'html' });
assert.deepEqual(parseStaticPartnerHtml('<a href="' + url + '"><img src="' + image + '" alt="제품 이미지" /></a>'),
  { url, imageUrl: image, source: 'html' });
assert.equal(parseStaticPartnerHtml('<a href="' + url + '"><img src="https://evil.example/pixel.png"/></a>'), null);
assert.equal(parseStaticPartnerHtml('<a onclick="alert(1)" href="' + url + '">보기</a>'), null);
assert.equal(parseStaticPartnerHtml('<a href="' + url + '"><script>alert(1)</script></a>'), null);
assert.equal(parseStaticPartnerHtml('<iframe src="' + url + '"></iframe>'), null);
assert.equal(parseStaticPartnerHtml('<script src="https://ads-partners.coupang.com/g.js"></script>'), null);
assert.equal(parseStaticPartnerHtml('<a href="https://evil.example/a/">wrong host</a>'), null);
assert.equal(parseStaticPartnerHtml('<a href="' + url + '"><span>nested</span></a>'), null);
assert.equal(resolvePartnerLink({ affiliateUrl: url })?.url, url);
assert.equal(resolvePartnerLink({ partnerHtml: '<a href="' + url + '">보기</a>' })?.url, url);
assert.equal(resolvePartnerLink({ affiliateUrl: url, partnerHtml: '<a href="https://coupa.ng/different">보기</a>' }), null);
assert.equal(resolvePartnerLink({ partnerHtml: '<a href="' + url + '">보기</a>', affiliateUrl: url })?.url, url);
console.log('Verified Coupang partner HTML parsing and safe link conversion tests passed.');
