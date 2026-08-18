import { env } from './env';

const encoder = new TextEncoder();
const SESSION_HOURS = 12;

export const COOKIE_NAME = 'ap_admin';

async function hmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
}

async function sign(secret: string, payload: string): Promise<string> {
  const signature = await crypto.subtle.sign(
    'HMAC',
    await hmacKey(secret),
    encoder.encode(payload),
  );
  return btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/** Compares two strings without leaking their contents through timing. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export function isConfigured(): boolean {
  return Boolean(env('ADMIN_PASSWORD') && env('ADMIN_SECRET'));
}

export function checkPassword(candidate: string): boolean {
  const expected = env('ADMIN_PASSWORD');
  if (!expected) return false;
  return safeEqual(candidate, expected);
}

/** Signed, expiring session value. Carries no data beyond its own expiry. */
export async function createSession(): Promise<string> {
  const secret = env('ADMIN_SECRET');
  if (!secret) throw new Error('ADMIN_SECRET is not set');
  const expires = String(Date.now() + SESSION_HOURS * 60 * 60 * 1000);
  return `${expires}.${await sign(secret, expires)}`;
}

export async function isValidSession(token: string | undefined): Promise<boolean> {
  const secret = env('ADMIN_SECRET');
  if (!secret || !token) return false;

  const [expires, signature] = token.split('.');
  if (!expires || !signature) return false;

  const expected = await sign(secret, expires);
  if (!safeEqual(signature, expected)) return false;

  return Number(expires) > Date.now();
}

export const cookieOptions = {
  httpOnly: true,
  sameSite: 'strict' as const,
  path: '/',
  secure: !import.meta.env.DEV,
  maxAge: SESSION_HOURS * 60 * 60,
};
