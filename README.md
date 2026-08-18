# AP English Portfolio — Year 2

The Year 2 ICT English portfolio of Lars Herrmann, Technische Berufsschule Zürich.

Every entry is a Markdown file in `src/content/entries/`, kept in Git. The site is
generated as static HTML, so the published pages are plain files — nothing to log
into, no database, nothing that can go to sleep before the portfolio is marked.

---

## Quick start

```bash
npm install
npm run dev
```

Then open <http://localhost:4321>.

| Command | What it does |
| --- | --- |
| `npm run dev` | Local dev server with live reload, on port 4321 |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build locally |

---

## Adding an entry

There are two ways, and they produce exactly the same thing: a Markdown file in
`src/content/entries/`.

### 1. The editor

Go to `/admin`, sign in with your `ADMIN_PASSWORD`, and write.

- **Locally** (`npm run dev`) the editor saves straight to disk. The dev server
  reloads immediately. Commit and push when you are happy.
- **On the deployed site** the editor commits the file to GitHub for you, and
  Vercel rebuilds automatically. The entry is live about a minute later.

The editor has a Markdown toolbar, a live preview, drag-in image upload, and a
repeating Sources block.

### 2. By hand

Copy `docs/entry-template.md` into `src/content/entries/`, rename it to the web
address you want (`writing-a-cv.md` becomes `/entries/writing-a-cv/`), and fill
it in.

### Entry frontmatter

```yaml
---
title: Writing a Job Application in English   # required
date: 2026-09-14                              # required, YYYY-MM-DD
summary: One sentence for the entry list.     # required
tags: [reflection, writing]                   # optional
sources:                                      # optional, but shown either way
  - label: Name of the source
    url: https://example.com                  # optional
    note: What you used it for                # optional
aiUse: >-                                     # required
  Be specific. If you used no AI, write that.
draft: false                                  # true hides it from the live site
---
```

`aiUse` is **required by the build**. An entry without it will not compile. That is
deliberate: explaining AI use is one of the four graded criteria, so the project
refuses to publish an entry that is missing it.

Entries with `draft: true` are visible on the local dev server and hidden on the
published site.

---

## Deploying to Vercel

1. Push this repository to GitHub.
2. In Vercel, choose **Add New… → Project** and import the repository.
   Vercel detects Astro on its own — leave the build settings untouched.
3. Add the environment variables below, then deploy.
4. Copy the deployment URL into `site:` in `astro.config.mjs` and push again, so
   the canonical links are right.

### Environment variables

Set these in **Vercel → Settings → Environment Variables**, and mirror them in a
local `.env` file (copy `.env.example`). `.env` is gitignored — never commit it.

| Variable | Needed for | Notes |
| --- | --- | --- |
| `ADMIN_PASSWORD` | The `/admin` page | Choose something long. |
| `ADMIN_SECRET` | Signing your session cookie | Any long random string. |
| `GITHUB_TOKEN` | The **online** editor only | See below. |
| `GITHUB_REPO` | The **online** editor only | `your-username/ap-eng-portfolio` |
| `GITHUB_BRANCH` | The **online** editor only | `main` |

Generate a secret with:

```bash
node -e "console.log(crypto.randomUUID()+crypto.randomUUID())"
```

The local editor needs only the first two. The GitHub variables are what let the
deployed `/admin` write entries from a device that does not have the repository.

### Creating the GitHub token

Create this yourself — never paste a token into a chat or a commit.

1. GitHub → **Settings → Developer settings → Personal access tokens →
   Fine-grained tokens → Generate new token**.
2. **Repository access:** Only select repositories → this repository.
3. **Permissions:** Repository permissions → **Contents: Read and write**.
   Nothing else.
4. Set an expiry you will remember — the end of the school year is a good choice.
5. Copy the token straight into the Vercel environment variable.

If the token expires or is revoked, the published site keeps working exactly as
before. Only the online editor stops being able to save.

---

## How the design maps to the assessment

The four marking criteria are Completeness, Content, Grammar & Spelling, and
Formatting & Sourcing. Three of them are shaped into the site itself:

- **Completeness** — the row of markers under the title draws one slot per month
  of the school year. A filled dot is a finished entry, a dashed outline is a
  month with nothing in it. The gaps are visible before June.
- **Formatting** — every entry gets its number, title and date from the same
  template, so the format cannot drift between entries.
- **Sourcing** — `Sources` and `How I used AI` are part of the entry layout and
  are enforced by the content schema, not left to memory.

Content and grammar are still your job.

---

## Project structure

```
src/
  content/entries/    every portfolio entry, one Markdown file each
  content.config.ts   the entry schema — what a valid entry must contain
  site.ts             your name, course, teacher, school year
  pages/
    index.astro       entry list + the year spine
    entries/[slug]    a single entry
    about.astro       how the portfolio works, and the AI policy
    admin.astro       the editor
    api/              login, logout, save entry, upload image
  components/         year spine, entry row, sources block, header, footer
  lib/                auth, file storage, Markdown building, formatting
  styles/global.css   the whole design system
docs/
  entry-template.md   copy this to start a new entry by hand
public/uploads/       images added through the editor
```

## Notes

- Fonts (Archivo, Newsreader, JetBrains Mono) are downloaded and self-hosted at
  build time, so the site loads no third-party resources at runtime.
- Vercel runs Node 24. A newer local Node version is fine; the build only warns.
- Light and dark themes both follow the reader's system setting.
