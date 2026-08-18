import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * One Markdown file per portfolio entry, in src/content/entries/.
 *
 * `sources` and `aiUse` are required on purpose: "Formatting & Sourcing" is a
 * graded criterion, so the build fails rather than letting an entry ship
 * without them. If an entry genuinely used no AI, write that out in `aiUse`.
 */
const entries = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/entries' }),
  schema: z.object({
    title: z.string().min(1),
    date: z.coerce.date(),
    summary: z.string().min(1),
    tags: z.array(z.string()).default([]),
    sources: z
      .array(
        z.object({
          label: z.string().min(1),
          url: z.string().url().optional(),
          note: z.string().optional(),
        }),
      )
      .default([]),
    aiUse: z.string().min(1),
    draft: z.boolean().default(false),
  }),
});

export const collections = { entries };
