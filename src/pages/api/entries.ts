import type { APIRoute } from 'astro';
import { COOKIE_NAME, isValidSession } from '../../lib/auth';
import { isDev } from '../../lib/env';
import { buildMarkdown, slugify, validate, type EntryInput } from '../../lib/entry';
import { writeRepoFile } from '../../lib/store';

export const prerender = false;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

function normalise(raw: Record<string, unknown>): EntryInput {
  const sources = Array.isArray(raw.sources) ? raw.sources : [];
  return {
    title: String(raw.title ?? ''),
    date: String(raw.date ?? ''),
    summary: String(raw.summary ?? ''),
    tags: Array.isArray(raw.tags) ? raw.tags.map(String) : [],
    sources: sources.map((source) => {
      const entry = source as Record<string, unknown>;
      return {
        label: String(entry.label ?? ''),
        url: entry.url ? String(entry.url) : undefined,
        note: entry.note ? String(entry.note) : undefined,
      };
    }),
    aiUse: String(raw.aiUse ?? ''),
    body: String(raw.body ?? ''),
    draft: Boolean(raw.draft),
  };
}

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!(await isValidSession(cookies.get(COOKIE_NAME)?.value))) {
    return json({ error: 'Your session has expired. Sign in again.' }, 401);
  }

  let input: EntryInput;
  try {
    input = normalise((await request.json()) as Record<string, unknown>);
  } catch {
    return json({ error: 'Could not read the entry.' }, 400);
  }

  const errors = validate(input);
  if (errors.length > 0) return json({ errors }, 422);

  const slug = slugify(input.title);
  const path = `src/content/entries/${slug}.md`;

  try {
    const result = await writeRepoFile(
      path,
      buildMarkdown(input),
      `Add entry: ${input.title}`,
    );

    return json({
      ok: true,
      slug,
      path: result.path,
      mode: result.mode,
      commitUrl: result.url,
      message: isDev
        ? 'Saved to your project. The dev server has already reloaded it.'
        : 'Committed to GitHub. Vercel is rebuilding — the entry will be live in about a minute.',
    });
  } catch (error) {
    return json(
      { error: error instanceof Error ? error.message : 'Saving failed.' },
      500,
    );
  }
};
