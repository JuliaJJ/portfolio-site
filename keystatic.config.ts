import { config, collection, fields } from "@keystatic/core";

export default config({
  storage: {
    kind: "github",
    repo: { owner: "JuliaJJ", name: "portfolio-site" },
  },

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
        year: fields.number({ label: "Year", defaultValue: new Date().getFullYear() }),
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

        domain: fields.select({
          label: "Domain",
          defaultValue: "web",
          options: [
            { label: "Healthcare", value: "healthcare" },
            { label: "Ecommerce", value: "ecommerce" },
            { label: "Web", value: "web" },
            { label: "Mobile", value: "mobile" },
            { label: "Enterprise", value: "enterprise" },
            { label: "Agency", value: "agency" },
          ],
        }),
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

        cover_image: fields.text({ label: "Cover image path", validation: { isRequired: false } }),
        cover_alt: fields.text({ label: "Cover image alt text", validation: { isRequired: false } }),
        prototype_url: fields.url({ label: "Prototype URL (Figma)", validation: { isRequired: false } }),

        content: fields.mdx({ label: "Case study body" }),
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
        year: fields.number({ label: "Year", defaultValue: new Date().getFullYear() }),
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

        cover_image: fields.text({ label: "Cover image path", validation: { isRequired: false } }),
        cover_alt: fields.text({ label: "Cover image alt text", validation: { isRequired: false } }),

        draft: fields.checkbox({ label: "Draft (hide from grid)", defaultValue: false }),

        content: fields.mdx({ label: "Body" }),
      },
    }),
  },
});
