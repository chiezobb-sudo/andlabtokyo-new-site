import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
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
