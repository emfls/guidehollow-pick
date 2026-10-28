import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const guides = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/guides' }),
  schema: z.object({
    title: z.string().min(8),
    description: z.string().min(20),
    category: z.enum(['appliances', 'cleaning', 'kitchen']),
    publishedDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    draft: z.boolean().default(true),
    affiliate: z.boolean().default(false),
    sources: z.array(z.string().url()).default([]),
  }),
});

export const collections = { guides };
