# Julie Johnston — Portfolio Site

Product/UX design portfolio. Built with [Astro 5](https://astro.build), MDX, React islands, Tailwind 3, and [Keystatic](https://keystatic.com) as a git-backed CMS. Deployed to Vercel as a server-rendered site behind a password gate.

## Setup

```bash
npm install
npm run dev      # localhost:4321 (CMS at localhost:4321/keystatic)
npm run build    # production build (Vercel output in .vercel/output)
```

Requires Node 24 to match the Vercel runtime.

> **iCloud note:** this repo lives in iCloud Drive. `node_modules` is excluded from sync with
> `xattr -w 'com.apple.fileprovider.ignore#P' 1 node_modules`. Re-run that after deleting and
> reinstalling `node_modules`, or iCloud may corrupt native binaries.

## Environment variables

Copy into `.env.local` for local dev; set the same in Vercel for production.

| Variable | Purpose |
|---|---|
| `SITE_PASSWORD` | Passphrase for the site gate. Leave empty locally to disable the gate. |
| `SITE_AUTH_SECRET` | Signs the login cookie. **Required in production** — without it nobody can log in. |
| `KEYSTATIC_GITHUB_CLIENT_ID` | Keystatic GitHub App credentials (production CMS only). |
| `KEYSTATIC_GITHUB_CLIENT_SECRET` | |
| `KEYSTATIC_SECRET` | |
| `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` | |

Changing `SITE_PASSWORD` or `SITE_AUTH_SECRET` signs out every visitor.

## How it works

### Themes

Every page renders four complete theme shells; a `data-theme` attribute on `<html>` and CSS in `src/styles/themes.css` show one. The visitor's choice is saved in `localStorage` and applied before first paint.

| Theme | Shell id | Layout | Components |
|---|---|---|---|
| Studio (default) | `shell-studio` | `StudioLayout.astro` | `components/studio/` |
| Tech | `shell-tech` | `DefaultLayout.astro` | `components/tech/`, top-level cards |
| Pixel | `shell-pixel` | `PixelLayout.astro` | `components/pixel/` |
| Editorial | `shell-editorial` | `EditorialLayout.astro` | `components/editorial/` |

Any page or card change has to be made in all four shells.

### Password gate

`src/middleware.ts` redirects every request without a valid `site-auth` cookie to `/login`. The cookie is an HMAC of the password (`src/lib/auth.ts`). `/login`, `/api/auth/*`, and the Keystatic routes are public. `/api/auth/logout` clears the cookie. `robots.txt` also blocks all crawlers.

### CMS

Keystatic edits content files in this repo. In dev it writes to local files; in production it commits to `JuliaJJ/portfolio-site` via a GitHub App. Admin UI is at `/keystatic`.

**Schema changes must be made in both `src/content/config.ts` (Astro) and `keystatic.config.ts` (Keystatic).**

## Content

```
src/content/
  work/            ← case studies (.mdx)
  lab/             ← personal projects (.mdx)
  additionalWork/  ← short image-led pieces (.mdx), at /work/additional/[slug]
  singletons/      ← home, about, footer, work-landing, lab-landing (.yaml)
public/images/
  work/            ← case study images (cover + inline)
  lab/             ← lab images
```

Set `draft: true` on any entry to hide it from the site without deleting it.

### Work case studies

Easiest via `/keystatic`. To write by hand, copy an existing file such as `ontada-iknowmed.mdx`.

| Field | Notes |
|---|---|
| `title`, `client`, `role` | Role should be specific, not just "UX Designer" |
| `featured`, `order` | Featured entries appear on the homepage (max 4), sorted by `order` |
| `summary` | Card text |
| `complexity_note` | What made it hard — the narrative thread |
| `my_contribution` | What you owned |
| `collaborators`, `skills`, `tools` | Lists |
| `problem_types` | `workflow` · `system` · `research` · `0-to-1` · `redesign` · `ecommerce` — powers `/work?type=` filtering |
| `outcomes` | `{ metric, value, note? }[]` |
| `impact_note` | When metrics aren't available |
| `cover_image`, `cover_image_wide`, `cover_alt` | Paths under `/images/work/`; wide (21:9) is used in Studio headers and falls back to `cover_image` |
| `prototype_url` | Figma or live prototype |

MDX body components: `<ProcessTimeline steps={[...]} />` and `<CaseStudyImage />` (insert both from Keystatic).

### Lab entries

Lighter schema — see `src/content/config.ts`. Uses `type` (`concept` · `tool` · `experiment` · `writing` · `game`), `what_it_shows`, freeform `tags`, an optional `link`, and an image `gallery`. `/lab` filters by `?type=` and `?tag=`.

## Deployment

Hosted on Vercel via `@astrojs/vercel`. Production URL: https://portfolio-site-liart-ten.vercel.app
