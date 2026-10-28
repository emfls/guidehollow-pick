import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { parseStaticPartnerHtml, resolvePartnerLink, verifiedCoupangUrl } from './lib/partner-code';

const httpsUrl = z.string().url().refine((url) => new URL(url).protocol === 'https:', 'HTTPS URL이 필요합니다');

const product = z.object({
  name: z.string().min(2),
  modelNumber: z.string().min(2).optional(),
  label: z.string().min(2),
  bestFor: z.string().min(8),
  strengths: z.array(z.string().min(3)).min(1).max(5),
  limitations: z.array(z.string().min(3)).min(1).max(5),
  officialUrl: httpsUrl,
  // Credible testing or review by a party other than the manufacturer / seller.
  independentSources: z.array(httpsUrl).max(6).default([]),
  verificationNotes: z.string().min(40).optional(),
  verified: z.boolean().default(false),
  // Confirm the linked SKU/option, not merely a similar listing or keyword.
  partnerProductMatched: z.boolean().default(false),
  affiliateUrl: httpsUrl.optional(),
  // Pasted static <a href="..."><img src="..." /></a> or <a href="...">text</a>
  // is parsed as data, never injected into the page as executable HTML.
  partnerHtml: z.string().max(12000).optional(),
  checkedAt: z.coerce.date(),
}).superRefine((data, ctx) => {
  const linked = Boolean(data.affiliateUrl || data.partnerHtml);
  const partner = resolvePartnerLink(data);
  if (linked && !partner) {
    ctx.addIssue({ code: 'custom', path: ['partnerHtml'],
      message: '쿠팡 개별 상품 링크/정적 HTML a 태그만 허용합니다. iframe·스크립트·동적배너·타사이트 URL은 거절합니다.' });
  }
  if (data.affiliateUrl && !verifiedCoupangUrl(data.affiliateUrl)) {
    ctx.addIssue({ code: 'custom', path: ['affiliateUrl'],
      message: '쿠팡파트너스에서 생성한 HTTPS 쿠팡 링크인지 확인하세요.' });
  }
  if (data.partnerHtml && !parseStaticPartnerHtml(data.partnerHtml)) {
    ctx.addIssue({ code: 'custom', path: ['partnerHtml'],
      message: 'HTML은 제품 단일 링크 a 태그와 선택적 Coupang CDN 이미지 한 개만 지원합니다.' });
  }
  if (linked && (!data.verified || !data.partnerProductMatched ||
      !data.modelNumber || !data.verificationNotes || data.independentSources.length === 0)) {
    ctx.addIssue({ code: 'custom', path: ['verified'],
      message: '제휴 링크 전 모델번호·독립 검증자료·장단점 평가·링크 SKU 일치·검증 승인이 모두 필수입니다.' });
  }
  if (data.independentSources.some((url) =>
    new URL(url).hostname === new URL(data.officialUrl).hostname)) {
    ctx.addIssue({ code: 'custom', path: ['independentSources'],
      message: '제조사 공식 출처와 독립 출처는 다른 도메인이어야 합니다.' });
  }
});
const guide = z.object({
  title: z.string().min(8),
  description: z.string().min(20),
  category: z.enum(['appliances', 'cleaning', 'kitchen']),
  publishedDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  draft: z.boolean().default(true),
  affiliate: z.boolean().default(false),
  sources: z.array(httpsUrl).default([]),
  keyTakeaways: z.array(z.string().min(5)).max(5).default([]),
  products: z.array(product).max(6).default([]),
}).superRefine((data, ctx) => {
  if (!data.draft && data.sources.length === 0) {
    ctx.addIssue({ code: 'custom', message: '공개 원고는 검증 출처가 필요합니다', path: ['sources'] });
  }
  const hasAffiliateLink = data.products.some((p) => Boolean(p.affiliateUrl || p.partnerHtml));
  if (hasAffiliateLink !== data.affiliate && !data.draft) {
    ctx.addIssue({ code: 'custom',
      message: 'affiliate는 실제 쿠팡파트너스 링크 포함 여부와 일치해야 합니다', path: ['affiliate'] });
  }
  if (!data.draft && data.products.some((p) =>
    !p.verified || !p.modelNumber || !p.verificationNotes || p.independentSources.length === 0)) {
    ctx.addIssue({ code: 'custom', path: ['products'],
      message: '공개 제품 비교표에는 모델번호·독립 근거·검증 기록이 없는 후보를 포함하지 않습니다.' });
  }
  if (data.updatedDate && data.updatedDate < data.publishedDate) {
    ctx.addIssue({ code: 'custom', message: 'updatedDate는 publishedDate 이전일 수 없습니다', path: ['updatedDate'] });
  }
});
const guides = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/guides' }),
  schema: guide,
});
export const collections = { guides };
