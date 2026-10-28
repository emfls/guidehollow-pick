import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const httpsUrl = z.string().url().refine((url) => new URL(url).protocol === 'https:', 'HTTPS URL이 필요합니다');
const product = z.object({
  name: z.string().min(2),
  label: z.string().min(2),
  bestFor: z.string().min(8),
  strengths: z.array(z.string().min(3)).min(1).max(5),
  limitations: z.array(z.string().min(3)).min(1).max(5),
  officialUrl: httpsUrl,
  affiliateUrl: httpsUrl.optional(),
  checkedAt: z.coerce.date(),
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
    ctx.addIssue({code: 'custom', message: '공개 원고는 출처가 필요합니다', path: ['sources']});
  }
  if (data.products.some((p) => Boolean(p.affiliateUrl)) && !data.affiliate) {
    ctx.addIssue({code: 'custom', message: '제휴 URL 사용 시 affiliate: true 필수', path: ['affiliate']});
  }
  if (data.updatedDate && data.updatedDate < data.publishedDate) {
    ctx.addIssue({code: 'custom', message: 'updatedDate는 publishedDate 이전일 수 없습니다', path: ['updatedDate']});
  }
});
const guides = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/guides' }),
  schema: guide,
});
export const collections = { guides };
