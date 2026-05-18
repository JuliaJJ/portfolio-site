import { config, collection, singleton, fields } from "@keystatic/core";
import { block } from "@keystatic/core/content-components";

export default config({
  storage: import.meta.env.DEV
    ? { kind: "local" }
    : { kind: "github", repo: { owner: "JuliaJJ", name: "portfolio-site" } },

  collections: {
    // ── Work ──────────────────────────────────────────────────────────────
    work: collection({
      label: "Work",
      slugField: "title",
      path: "src/content/work/*",
      format: { contentField: "content" },
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        client: fields.text({ label: "Client" }),
        role: fields.text({ label: "Role" }),
        featured: fields.checkbox({ label: "Featured on homepage", defaultValue: false }),
        order: fields.number({ label: "Featured order (lower = first)", validation: { isRequired: false } }),

        summary: fields.text({ label: "Summary", multiline: false }),
        complexity_note: fields.text({ label: "Complexity note", multiline: true }),
        my_contribution: fields.text({ label: "My contribution", multiline: true }),
        collaborators: fields.array(
          fields.text({ label: "Collaborator" }),
          { label: "Collaborators", itemLabel: (p) => p.value }
        ),

        visibility: fields.select({
          label: "Visibility",
          defaultValue: "partial",
          options: [
            { label: "Full", value: "full" },
            { label: "Partial", value: "partial" },
            { label: "Request (NDA)", value: "request" },
          ],
        }),
        nda_note: fields.text({ label: "NDA note", multiline: true, validation: { isRequired: false } }),

        problem_types: fields.multiselect({
          label: "Problem types",
          options: [
            { label: "Workflow", value: "workflow" },
            { label: "System", value: "system" },
            { label: "Research", value: "research" },
            { label: "0-to-1", value: "0-to-1" },
            { label: "Redesign", value: "redesign" },
            { label: "Ecommerce", value: "ecommerce" },
          ],
        }),
        skills: fields.array(
          fields.text({ label: "Skill" }),
          { label: "Skills", itemLabel: (p) => p.value }
        ),
        tools: fields.array(
          fields.text({ label: "Tool" }),
          { label: "Tools", itemLabel: (p) => p.value }
        ),

        outcomes: fields.array(
          fields.object({
            metric: fields.text({ label: "Metric" }),
            value: fields.text({ label: "Value" }),
            note: fields.text({ label: "Note", validation: { isRequired: false } }),
          }),
          { label: "Outcomes", itemLabel: (p) => p.fields.metric.value }
        ),
        impact_note: fields.text({ label: "Impact note", multiline: true, validation: { isRequired: false } }),

        cover_image: fields.text({ label: "Cover image — standard (16:9)", validation: { isRequired: false } }),
        cover_image_wide: fields.text({ label: "Cover image — wide (21:9, Studio header)", validation: { isRequired: false } }),
        cover_alt: fields.text({ label: "Cover image alt text", validation: { isRequired: false } }),
        prototype_url: fields.url({ label: "Prototype URL (Figma)", validation: { isRequired: false } }),

        draft: fields.checkbox({ label: "Draft (hide from site)", defaultValue: false }),

        content: fields.mdx({
          label: "Case study body",
          components: {
            ProcessTimeline: block({
              label: "Process Timeline",
              schema: {
                steps: fields.array(
                  fields.object({
                    label: fields.text({ label: "Step name" }),
                    detail: fields.text({ label: "Detail" }),
                  }),
                  { label: "Steps", itemLabel: (p) => p.fields.label.value }
                ),
              },
            }),
            CaseStudyImage: block({
              label: "Image",
              schema: {
                image: fields.image({
                  label: "Image",
                  directory: "public/images/work",
                  publicPath: "/images/work/",
                }),
                alt: fields.text({ label: "Alt text", validation: { isRequired: false } }),
                caption: fields.text({ label: "Caption (optional)", validation: { isRequired: false } }),
                size: fields.select({
                  label: "Size",
                  defaultValue: "full",
                  options: [
                    { label: "Full width", value: "full" },
                    { label: "Medium (centred)", value: "medium" },
                  ],
                }),
              },
            }),
          },
        }),
      },
    }),

    // ── Lab ───────────────────────────────────────────────────────────────
    lab: collection({
      label: "Lab",
      slugField: "title",
      path: "src/content/lab/*",
      format: { contentField: "content" },
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        summary: fields.text({ label: "Summary" }),
        what_it_shows: fields.text({ label: "What it shows", multiline: true }),

        type: fields.select({
          label: "Type",
          defaultValue: "experiment",
          options: [
            { label: "Concept", value: "concept" },
            { label: "Tool", value: "tool" },
            { label: "Experiment", value: "experiment" },
            { label: "Writing", value: "writing" },
            { label: "Game", value: "game" },
          ],
        }),

        skills: fields.array(
          fields.text({ label: "Skill" }),
          { label: "Skills", itemLabel: (p) => p.value }
        ),
        tools: fields.array(
          fields.text({ label: "Tool" }),
          { label: "Tools", itemLabel: (p) => p.value }
        ),

        link: fields.url({ label: "External link", validation: { isRequired: false } }),
        link_label: fields.text({ label: "Link label", validation: { isRequired: false } }),

        gallery: fields.array(
          fields.object({
            image: fields.image({
              label: "Image",
              directory: "public/images/lab",
              publicPath: "/images/lab/",
            }),
            alt: fields.text({ label: "Alt text", validation: { isRequired: false } }),
          }),
          { label: "Gallery", itemLabel: (p) => p.fields.alt.value || "Image" }
        ),

        cover_image: fields.text({ label: "Cover image — standard (16:9)", validation: { isRequired: false } }),
        cover_image_wide: fields.text({ label: "Cover image — wide (21:9, Studio header)", validation: { isRequired: false } }),
        cover_alt: fields.text({ label: "Cover image alt text", validation: { isRequired: false } }),

        tags: fields.array(
          fields.text({ label: "Tag" }),
          { label: "Tags", itemLabel: (p) => p.value }
        ),

        draft: fields.checkbox({ label: "Draft (hide from grid)", defaultValue: false }),

        content: fields.mdx({ label: "Body" }),
      },
    }),

    // ── Additional Work ───────────────────────────────────────────────────
    additionalWork: collection({
      label: "Additional Work",
      slugField: "title",
      path: "src/content/additionalWork/*",
      format: { contentField: "notes" },
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        client: fields.text({ label: "Client" }),
        role: fields.text({ label: "Role" }),
        description: fields.text({ label: "Description", multiline: true }),
        order: fields.number({ label: "Order (lower = first)", validation: { isRequired: false } }),

        visibility: fields.select({
          label: "Visibility",
          defaultValue: "full",
          options: [
            { label: "Full", value: "full" },
            { label: "Partial", value: "partial" },
            { label: "Request (NDA)", value: "request" },
          ],
        }),
        nda_note: fields.text({ label: "NDA note", multiline: true, validation: { isRequired: false } }),

        cover_image: fields.text({ label: "Cover image — standard (16:9)", validation: { isRequired: false } }),
        cover_image_wide: fields.text({ label: "Cover image — wide (21:9, Studio header)", validation: { isRequired: false } }),
        cover_alt: fields.text({ label: "Cover image alt text", validation: { isRequired: false } }),

        gallery: fields.array(
          fields.object({
            image: fields.image({
              label: "Image",
              directory: "public/images/additional-work",
              publicPath: "/images/additional-work/",
            }),
            alt: fields.text({ label: "Alt text", validation: { isRequired: false } }),
            caption: fields.text({ label: "Caption", validation: { isRequired: false } }),
          }),
          { label: "Gallery", itemLabel: (p) => p.fields.alt.value || "Image" }
        ),

        draft: fields.checkbox({ label: "Draft (hide from index)", defaultValue: false }),

        notes: fields.mdx({ label: "Notes (optional)" }),
      },
    }),
  },

  singletons: {
    // ── Home ──────────────────────────────────────────────────────────────
    home: singleton({
      label: "Home",
      path: "src/content/singletons/home",
      schema: {
        tagline: fields.text({ label: "Tagline (eyebrow)" }),
        heading: fields.text({ label: "Heading" }),
        intro: fields.text({ label: "Intro paragraph", multiline: true }),
        stats: fields.array(
          fields.object({
            value: fields.text({ label: "Value" }),
            label: fields.text({ label: "Label" }),
          }),
          { label: "Stats", itemLabel: (p) => `${p.fields.value.value} ${p.fields.label.value}` }
        ),
        email: fields.text({ label: "Contact email" }),
      },
    }),

    // ── About ─────────────────────────────────────────────────────────────
    about: singleton({
      label: "About",
      path: "src/content/singletons/about",
      schema: {
        heading: fields.text({ label: "Heading" }),
        intro: fields.text({ label: "Short intro (under heading)" }),
        bio: fields.array(
          fields.text({ label: "Paragraph", multiline: true }),
          { label: "Bio paragraphs" }
        ),
        bio_short: fields.text({ label: "Short bio (pixel theme)", multiline: true }),
        skills: fields.array(
          fields.text({ label: "Skill" }),
          { label: "Skills", itemLabel: (p) => p.value }
        ),
        tools: fields.array(
          fields.text({ label: "Tool" }),
          { label: "Tools", itemLabel: (p) => p.value }
        ),
        email: fields.text({ label: "Email" }),
        linkedin_url: fields.url({ label: "LinkedIn URL" }),
        available: fields.checkbox({ label: "Available for new work", defaultValue: true }),
      },
    }),

    // ── Work landing ──────────────────────────────────────────────────────
    workLanding: singleton({
      label: "Work landing",
      path: "src/content/singletons/work-landing",
      schema: {
        intro: fields.text({ label: "Intro paragraph", multiline: true }),
      },
    }),

    // ── Lab landing ───────────────────────────────────────────────────────
    labLanding: singleton({
      label: "Lab landing",
      path: "src/content/singletons/lab-landing",
      schema: {
        intro: fields.text({ label: "Intro paragraph", multiline: true }),
      },
    }),

    // ── Footer ────────────────────────────────────────────────────────────
    footer: singleton({
      label: "Footer",
      path: "src/content/singletons/footer",
      schema: {
        tagline: fields.text({ label: "Tagline" }),
        email: fields.text({ label: "Contact email" }),
        linkedin_url: fields.url({ label: "LinkedIn URL", validation: { isRequired: false } }),
        credit_line: fields.text({ label: "Credit line (bottom right)" }),
        pixel_tagline: fields.text({ label: "Pixel theme footer blink text" }),
      },
    }),
  },
});
