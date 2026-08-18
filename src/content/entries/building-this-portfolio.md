---
title: Building This Portfolio Instead of Buying One
date: 2026-08-18
summary: >-
  The assignment allowed Weebly, Wix, Canva or Google Sites. I coded the site
  myself, and the decision turned out to be about permanence rather than skill.
tags: [portfolio, web, decisions]
sources:
  - label: "Forbes Advisor — Best Free Website Builders (2024)"
    url: https://www.forbes.com/advisor/business/software/best-free-website-builder/
    note: The article recommended in the assignment brief. I used it to compare the hosted options before deciding against them.
  - label: Astro documentation — Content collections
    url: https://docs.astro.build/en/guides/content-collections/
    note: The technical approach this site is built on.
aiUse: >-
  Substantial, and only on the code. I used Claude to scaffold the website: the
  build configuration, the page templates and the CSS. I described the structure
  I wanted and reviewed what it produced, and I asked it to explain the parts I
  did not understand rather than just accepting them. The writing on this site,
  including this entry, is mine. The only language help I took was a grammar
  check on the finished draft.
draft: false
---

The brief for this year's portfolio listed four ways to build it: Weebly, Wix,
Canva or Google Sites. It also said, almost as a footnote, that we could code the
site ourselves. I took the footnote.

## Why not the easy option

I read the Forbes article the assignment linked to, and the hosted builders are
genuinely good. Wix in particular would have taken an afternoon. But I kept
running into the same objection, and it was not about difficulty.

On a hosted builder, my portfolio is a page inside somebody else's product. It
exists as long as that company keeps the free tier, keeps the account, and keeps
the product. I have already lost work that way once, when a note-taking app I used
in secondary school shut down its free plan. A portfolio is supposed to be the
thing that survives the year.

There was also a smaller objection about form. The brief says the portfolio should
read like a blog rather than a presentation, and it warns specifically that Canva
pushes you towards something that looks like PowerPoint. Every drag-and-drop
builder pushes you somewhere. I wanted the writing to be the thing on the page,
and the fastest way to guarantee that was to build a site where text is the only
thing there is.

## What I actually built

Each entry on this site is a plain Markdown file stored in a Git repository. The
site is generated from those files as static HTML, which means the published pages
are just files on a server — no database, nothing that can go to sleep, nothing to
log into. If the hosting disappears tomorrow, I still have every entry as a text
file on my laptop and in version control.

Two decisions came out of the assessment criteria rather than out of design taste.

The first is the row of markers under the title on the home page. It draws one
slot for every month of the school year and fills it in when an entry exists for
that month. Completeness is the first thing this portfolio is graded on, and I
would rather see the gaps than discover them in June.

The second is that "Sources" and "How I used AI" are part of the entry template,
not something I add by hand. The site will not build an entry that is missing
them. I built that constraint deliberately, because the honest version of me
forgets, and the useful version of a tool is one that does not let you.

## What I got out of it

Less than I expected technically, and more than I expected in terms of writing.
The code took a weekend with a lot of help. What took longer was working out what
the site was supposed to *do* — and that turned out to be a question about the
assessment criteria, not about CSS.

The thing I would tell someone choosing between the two routes: pick the coded
version if you want to keep the work, and pick the hosted version if you want to
be finished on Sunday. Both are defensible. Only one of them still exists in five
years.
