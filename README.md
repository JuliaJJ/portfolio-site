# Julie Johnston — Portfolio Site

Built with [Astro](https://astro.build) + MDX + React + Tailwind + Vercel.

## Setup

```bash
npm install
npm run dev      # localhost:4321
npm run build    # production build to dist/
npm run preview  # preview production build locally
```

## Project structure

```
src/
  content/
    config.ts          ← typed schemas for work + lab collections
    work/              ← case studies (.mdx files)
    lab/               ← personal projects (.mdx files)
  pages/
    index.astro        ← homepage
    work/
      index.astro      ← case study index with filtering
      [slug].astro     ← dynamic case study page
    lab/
      index.astro      ← lab index
      [slug].astro     ← dynamic lab entry page
    about.astro
  components/
    CaseStudyCard.astro
    OutcomeBlock.astro
    NdaBanner.astro
    ProcessTimeline.astro
    DomainFilter.tsx   ← only React island (client-side filter)
  layouts/
    BaseLayout.astro
  styles/
    global.css
    tokens.css
public/
  fonts/
  og/                  ← og:image assets per case study
```

## Adding a case study

1. Create `src/content/work/your-project-slug.mdx`
2. Fill in the frontmatter (see `iknowmed-ordering.mdx` as template)
3. Write the case study body in MDX below the frontmatter
4. Add a cover image to `src/content/work/covers/`
5. Set `featured: true` and `order: N` if it should appear on the homepage

### Frontmatter fields

| Field | Type | Notes |
|---|---|---|
| `title` | string | Full project title |
| `client` | string | Client or employer. Omit/genericize if NDA. |
| `role` | string | Your specific role, not just "UX Designer" |
| `year` | number | Year the project shipped or peaked |
| `featured` | boolean | Show on homepage grid (keep to 3–4 max) |
| `order` | number | Sort position within featured |
| `summary` | string | One sentence for the card. What did you build? |
| `complexity_note` | string | What made this hard. The narrative thread. |
| `my_contribution` | string | What YOU specifically owned |
| `collaborators` | string[] | Who else was involved |
| `visibility` | `full` \| `partial` \| `request` | NDA level |
| `nda_note` | string | Custom NDA message if needed |
| `domain` | enum | `healthcare` \| `ecommerce` \| `web` \| `mobile` \| `enterprise` \| `agency` |
| `problem_types` | enum[] | `workflow` \| `system` \| `research` \| `0-to-1` \| `redesign` \| `ecommerce` |
| `skills` | string[] | Skills demonstrated |
| `tools` | string[] | Tools used |
| `outcomes` | `{metric, value, note?}[]` | Quantified results |
| `impact_note` | string | Freeform note when metrics aren't available |
| `cover_image` | string | Path to cover image |
| `prototype_url` | URL | Figma embed or live prototype |

### NDA handling

- `visibility: full` — show everything
- `visibility: partial` — show process artifacts and research; blur or omit final screens. Add an `nda_note` explaining what's redacted and offering a walkthrough.
- `visibility: request` — show summary only. NDA banner with contact CTA.

## Adding a lab entry

Same process, lighter schema. See `src/content/config.ts` for the lab collection fields. Lab entries use `type` (concept | tool | experiment | writing | game) instead of `domain`.

## Filtering

Case studies at `/work` filter by `domain` and `problem_type` via URL params:
- `/work?domain=healthcare`
- `/work?type=workflow`
- `/work?domain=ecommerce&type=redesign`

These are shareable and SEO-friendly. Works without JavaScript via static links; `DomainFilter.tsx` enhances to client-side filtering.

## Deployment

Push to GitHub, connect to Vercel. Set output to Static in Vercel settings (matches `output: "static"` in astro.config).

No environment variables required for the base portfolio.
