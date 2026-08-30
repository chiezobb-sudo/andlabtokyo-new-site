import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/blog',
    // Wix 時代の記事URL（/post/<ファイル名>）をそのまま維持する。
    // 既定の generateId は「（）～！、・」などの記号を落とすため、
    // 何もしないと /post/rawラーメン（ベジとんこつラーメン） が 404 になる。
    generateId: ({ entry }) => entry.replace(/\.md$/, ''),
  }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.string(),
    image: z.string().optional(),
    category: z.string().default('レシピ'),
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = { blog };
