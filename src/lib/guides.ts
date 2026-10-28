import { getCollection } from 'astro:content';

export async function getPublishedGuides() {
  const now = new Date();
  const guides = await getCollection('guides', ({ data }) =>
    data.draft === false && data.publishedDate.getTime() <= now.getTime(),
  );
  return guides.sort((a, b) => b.data.publishedDate.getTime() - a.data.publishedDate.getTime());
}
