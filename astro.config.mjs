// astro.config.mjs
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel/static";

export default defineConfig({
  output: "static",
  adapter: vercel(),
  site: "https://juliejohnston.design",

  integrations: [
    mdx(),
    react(),
    tailwind({
      // Use Tailwind only for utilities, not base reset
      // (we're writing our own CSS for the portfolio aesthetic)
      applyBaseStyles: false,
    }),
  ],

  image: {
    // Astro's built-in image optimization
    // Generates WebP and AVIF at build time
    service: { entrypoint: "astro/assets/services/sharp" },
  },

  vite: {
    resolve: {
      alias: {
        // Use @components, @layouts, @styles instead of long relative paths
        "@components": "/src/components",
        "@layouts": "/src/layouts",
        "@styles": "/src/styles",
      },
    },
  },

  // Generates /work?domain=healthcare shareable URLs correctly
  // (static mode handles this via client-side JS in DomainFilter.tsx)
  trailingSlash: "never",
});
