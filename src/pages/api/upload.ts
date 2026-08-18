import type { APIRoute } from 'astro';
import { COOKIE_NAME, isValidSession } from '../../lib/auth';
import { slugify } from '../../lib/entry';
import { writeRepoFile } from '../../lib/store';

export const prerender = false;

const MAX_BYTES = 4 * 1024 * 1024;

const EXTENSIONS: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/svg+xml': 'svg',
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!(await isValidSession(cookies.get(COOKIE_NAME)?.value))) {
    return json({ error: 'Your session has expired. Sign in again.' }, 401);
  }

  const form = await request.formData();
  const file = form.get('file');

  if (!(file instanceof File)) {
    return json({ error: 'No image was attached.' }, 400);
  }

  const extension = EXTENSIONS[file.type];
  if (!extension) {
    return json(
      { error: 'Use a JPG, PNG, WebP, GIF or SVG image.' },
      415,
    );
  }

  if (file.size > MAX_BYTES) {
    return json({ error: 'That image is larger than 4 MB. Shrink it first.' }, 413);
  }

  const base = slugify(file.name.replace(/\.[^.]+$/, '')) || 'image';
  const name = `${base}-${Date.now().toString(36)}.${extension}`;
  const path = `public/uploads/${name}`;

  try {
    const bytes = new Uint8Array(await file.arrayBuffer());
    await writeRepoFile(path, bytes, `Add image: ${name}`);
    return json({ ok: true, url: `/uploads/${name}` });
  } catch (error) {
    return json(
      { error: error instanceof Error ? error.message : 'Upload failed.' },
      500,
    );
  }
};
