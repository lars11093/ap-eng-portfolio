import type { APIRoute } from 'astro';
import {
  COOKIE_NAME,
  checkPassword,
  cookieOptions,
  createSession,
  isConfigured,
} from '../../lib/auth';

export const prerender = false;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!isConfigured()) {
    return json(
      {
        error:
          'The editor is not set up yet. Add ADMIN_PASSWORD and ADMIN_SECRET to your environment variables.',
      },
      503,
    );
  }

  let password = '';
  try {
    const body = (await request.json()) as { password?: string };
    password = String(body.password ?? '');
  } catch {
    return json({ error: 'Could not read the request.' }, 400);
  }

  if (!checkPassword(password)) {
    // Slows down repeated guessing without needing any shared state.
    await new Promise((resolve) => setTimeout(resolve, 600));
    return json({ error: 'That password does not match.' }, 401);
  }

  cookies.set(COOKIE_NAME, await createSession(), cookieOptions);
  return json({ ok: true });
};
