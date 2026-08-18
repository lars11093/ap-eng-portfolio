/**
 * Reads a server-side variable.
 *
 * Locally Vite puts .env values on import.meta.env; on Vercel they only exist
 * on process.env at runtime. Checking both means the same code works in both.
 */
export function env(name: string): string | undefined {
  const fromProcess =
    typeof process !== 'undefined' ? process.env?.[name] : undefined;
  const fromVite = (import.meta.env as Record<string, string | undefined>)[name];
  const value = fromProcess ?? fromVite;
  return value && value.length > 0 ? value : undefined;
}

/** True when the editor is running against the local dev server. */
export const isDev = import.meta.env.DEV;
