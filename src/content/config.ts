import { defineCollection, z } from "astro:content";

// ─── Shared enums ──────────────────────────────────────────────────────────

const domainEnum = z.enum([
  "healthcare",
  "ecommerce",
  "web",
  "mobile",
  "enterprise",
  "agency",
]);

const problemTypeEnum = z.enum([
  "workflow",       // complex task flows, EHR, ops tools
  "system",         // design systems, component libraries
  "research",       // research-led projects
  "0-to-1",         // net-new product or MVP
  "redesign",       // existing product overhaul
  "ecommerce",      // purchase flows, catalog, conversion
]);

const visibilityEnum = z.enum([
  "full",           // all screens and artifacts shown
  "partial",        // process shown, final screens redacted/blurred
  "request",        // NDA — show summary only, CTA to request walkthrough
]);

// ─── Outcome block ─────────────────────────────────────────────────────────

const outcomeSchema = z.object({
  metric: z.string(),
  value: z.string(),
  // Optional: clarify what the number means
  note: z.string().optional(),
});

// ─── Work collection ───────────────────────────────────────────────────────
// Professional client work and day-job projects

const workCollection = defineCollection({
  type: "content",
  schema: z.object({

    // ── Identity
    title: z.string(),
    // Use client name OR a generic descriptor if NDA prevents naming
    client: z.string(),
    // What you actually did — specific, not "UX Designer"
    role: z.string(),
    year: z.number(),
    // Controls homepage featured grid (max 3–4 recommended)
    featured: z.boolean().default(false),
    // Sort order within featured (lower = earlier)
    order: z.number().optional(),

    // ── Framing — the narrative thread fields
    // One sentence on the card. Lead with what made it hard.
    summary: z.string(),
    // The constraint or difficulty that forced real thinking.
    // This is your through-line across domains.
    complexity_note: z.string(),
    // What YOU owned specifically (not the team)
    my_contribution: z.string(),
    // Who else was in the room
    collaborators: z.array(z.string()).default([]),

    // ── NDA / visibility
    visibility: visibilityEnum.default("partial"),
    // Shown when visibility = partial | request
    nda_note: z.string().optional(),

    // ── Domain + skills — powers filtering
    domain: domainEnum,
    // Can belong to multiple problem types
    problem_types: z.array(problemTypeEnum),
    skills: z.array(z.string()).default([]),
    tools: z.array(z.string()).default([]),

    // ── Outcomes
    outcomes: z.array(outcomeSchema).default([]),
    // Freeform note when metrics aren't available
    impact_note: z.string().optional(),

    // ── Assets
    // Path relative to this file, or /public URL
    cover_image: z.string().optional(),
    // Alt text for cover
    cover_alt: z.string().optional(),
    // Optional Figma embed URL for prototypes
    prototype_url: z.string().url().optional(),
  }),
});

// ─── Lab collection ────────────────────────────────────────────────────────
// Personal projects, experiments, side work — lighter schema

const labCollection = defineCollection({
  type: "content",
  schema: z.object({

    title: z.string(),
    year: z.number(),
    // One-liner for the card
    summary: z.string(),
    // What does this demonstrate about you as a designer/builder?
    what_it_shows: z.string(),

    // Loose type tags
    type: z.enum([
      "concept",     // design exploration, speculative
      "tool",        // something you built and use
      "experiment",  // prototype, test, proof of concept
      "writing",     // article, essay, process doc
      "game",        // TTRPG, interactive fiction, game design
    ]),

    skills: z.array(z.string()).default([]),
    tools: z.array(z.string()).default([]),

    // Optional external link (live project, GitHub, etc.)
    link: z.string().url().optional(),
    link_label: z.string().optional(),

    cover_image: z.string().optional(),
    cover_alt: z.string().optional(),

    // Hide from grid without deleting the file
    draft: z.boolean().default(false),
  }),
});

// ─── Export ────────────────────────────────────────────────────────────────

export const collections = {
  work: workCollection,
  lab: labCollection,
};
