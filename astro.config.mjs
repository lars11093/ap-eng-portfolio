// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import vercel from '@astrojs/vercel';

// Update `site` once Vercel has given you the real deployment URL.
// It is used for canonical links and social metadata.
export default defineConfig({
  site: 'https://ap-eng-portfolio.vercel.app',

  // Static by default: every entry page is pre-rendered HTML, so the graded
  // site can never be slow or "asleep". Only /admin and /api/* opt out
  // (see `export const prerender = false` in those files).
  output: 'static',
  adapter: vercel(),

  // Fonts are downloaded and self-hosted at build time, with fallback
  // metrics generated automatically to avoid layout shift.
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Archivo',
      cssVariable: '--font-display',
      weights: [500, 600, 700],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['Helvetica Neue', 'Arial', 'sans-serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'Newsreader',
      cssVariable: '--font-body',
      weights: [400, 500, 600],
      styles: ['normal', 'italic'],
      subsets: ['latin'],
      fallbacks: ['Iowan Old Style', 'Georgia', 'serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'JetBrains Mono',
      cssVariable: '--font-mono',
      weights: [400, 500, 700],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['ui-monospace', 'SFMono-Regular', 'monospace'],
    },
  ],

  markdown: {
    shikiConfig: { theme: 'github-light', wrap: true },
  },
});
