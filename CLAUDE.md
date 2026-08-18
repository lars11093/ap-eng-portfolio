# AP English Portfolio — Claude Code context

Year 2 ICT English portfolio for Lars Herrmann, TBZ Zürich. Teacher: Joseph Heeg.
Assessed at the end of the school year on four criteria: **Completeness, Content,
Grammar & Spelling, Formatting & Sourcing**.

The site is the deliverable. Anything that risks it not being readable at marking
time is a bug, however clever.

## Stack

- **Astro 7**, `output: 'static'` with the Vercel adapter
- Entries are Markdown in `src/content/entries/`, typed by `src/content.config.ts`
- Only `/admin` and `/api/*` are server-rendered (`export const prerender = false`)
- Fonts via Astro's built-in Fonts API — self-hosted at build time, no CDN
- No database, no client framework, no runtime third-party requests

## Rules

- **Every entry is a file in Git.** Never move entry content into a database or an
  external service. The point of the architecture is that the writing survives.
- **`aiUse` and `sources` stay required** in the schema. They are graded, and the
  build failing is the reminder.
- **All prose on the site is English.** This is an English portfolio.
- **Use the CSS tokens** in `src/styles/global.css` (`--ink`, `--paper`, `--signal`,
  `--f-display`…). No hardcoded colours — dark mode then works automatically.
- `--signal` (red) is reserved for things that report state: spine markers, entry
  numbers on hover, required-field labels. It is not a decorative accent.
- Keep the published pages static. If a feature needs a server, it belongs behind
  `/admin`, not in the reading experience.

## Design

Direction is "Logbook": ink bands for structure, paper for reading, one signal red.

The signature element is the **Year Spine** (`src/components/YearSpine.astro`) — one
slot per month of the school year, filled where an entry exists. It exists to make
Completeness visible. Do not turn it into decoration.

Type roles: `Archivo` for the masthead, interface and numbers; `Newsreader` for
entry titles and body prose; `JetBrains Mono` for dates, tags and labels.

## The editor

`/admin` is password-protected (`ADMIN_PASSWORD`, session cookie signed with
`ADMIN_SECRET`, httpOnly, 12 hours).

`src/lib/store.ts` decides where a save goes:
- `npm run dev` → writes the file straight to disk
- deployed → commits to GitHub via the Contents API, Vercel rebuilds

Slugs come from `slugify()` in `src/lib/entry.ts`, which is also what keeps a title
from escaping the entries folder. `assertSafePath()` in `store.ts` is the second
guard. Do not weaken either.

## Gotchas

- Writing files through a Bash heredoc mangles `'\'`. `store.ts` uses
  `String.fromCharCode(92)` for the backslash check because of this.
- Vercel runs Node 24; a newer local Node only produces a build warning.
- `.env` is gitignored and must stay that way. Tokens are created by the user in
  GitHub and pasted into Vercel — never generated or stored here.
