/**
 * Accepts a single static product-level Coupang Partners <a> HTML snippet.
 * Does NOT execute or render third-party HTML. Dynamic JS/iframe banners are
 * deliberately unsupported: they cannot guarantee a verified model match.
 */
export interface PartnerInput {
  affiliateUrl?: string;
  partnerHtml?: string;
}
export interface PartnerPresentation {
  url: string;
  imageUrl?: string;
  source: 'url' | 'html';
}
const ALLOWED_LINK_HOSTS = new Set([
  'link.coupang.com',
  'coupa.ng',
  'coupang.com',
  'www.coupang.com',
]);
const CDN_HOST = /(?:^|\.)coupangcdn\.com$/i;

function decodeAmpersands(value: string): string {
  return value.replace(/&amp;/gi, '&');
}
function validHttpsUrl(raw: string, hosts: Set<string> | RegExp): string | null {
  try {
    const url = new URL(decodeAmpersands(raw));
    if (url.protocol !== 'https:' || url.username || url.password ||
        url.port || !url.pathname || url.pathname === '/' ||
        url.hash || url.hostname.includes('..')) return null;
    const hostname = url.hostname.toLowerCase();
    if (hosts instanceof Set ? !hosts.has(hostname) : !hosts.test(hostname)) return null;
    return url.toString();
  } catch {
    return null;
  }
}
function attribute(attrs: string, key: string): string | null {
  const rx = new RegExp('(?:^|\\s)' + key + '\\s*=\\s*(["\\\'])(.*?)\\1', 'i');
  return attrs.match(rx)?.[2] ?? null;
}
export function verifiedCoupangUrl(raw: string): string | null {
  return validHttpsUrl(raw, ALLOWED_LINK_HOSTS);
}
export function parseStaticPartnerHtml(raw: string): PartnerPresentation | null {
  if (!raw || raw.length > 12000) return null;
  const html = raw.trim();
  // Never evaluate third-party scripts, event handlers, styles, or iframes.
  if (/<\s*\/?(?:script|iframe|style|svg|object|embed|form|meta|link)\b/i.test(html) ||
      /\son[a-z]+\s*=/i.test(html) ||
      /javascript\s*:|data\s*:/i.test(html)) return null;
  const anchor = /^<a\b([^>]*)>([\s\S]*?)<\/a>$/i.exec(html);
  if (!anchor) return null;
  const rawHref = attribute(anchor[1], 'href');
  if (!rawHref) return null;
  const url = verifiedCoupangUrl(rawHref);
  if (!url) return null;
  const inner = anchor[2];
  const imgs = [...inner.matchAll(/<img\b([^>]*)\/?\s*>/gi)];
  if (imgs.length > 1) return null;
  const rest = inner.replace(/<img\b[^>]*\/?\s*>/gi, '');
  // Accept only plain text plus one official image; no nested/raw HTML.
  if (/[<>]/.test(rest)) return null;
  let imageUrl: string | undefined;
  if (imgs.length === 1) {
    const rawSrc = attribute(imgs[0][1], 'src');
    if (!rawSrc) return null;
    const image = validHttpsUrl(rawSrc, CDN_HOST);
    if (!image) return null;
    imageUrl = image;
  }
  return { url, ...(imageUrl ? { imageUrl } : {}), source: 'html' };
}
export function resolvePartnerLink(input: PartnerInput): PartnerPresentation | null {
  const direct = input.affiliateUrl ? verifiedCoupangUrl(input.affiliateUrl) : null;
  const snippet = input.partnerHtml ? parseStaticPartnerHtml(input.partnerHtml) : null;
  if ((input.affiliateUrl && !direct) || (input.partnerHtml && !snippet)) return null;
  if (direct && snippet && direct !== snippet.url) return null;
  if (snippet) return snippet;
  return direct ? { url: direct, source: 'url' } : null;
}
