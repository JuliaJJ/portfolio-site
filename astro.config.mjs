// astro.config.mjs
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel";
import keystatic from "@keystatic/astro";

export default defineConfig({
  output: "static",
  adapter: vercel(),
  site: "https://juliejohnston.design",

  integrations: [
    mdx(),
    react(),
    tailwind({
      applyBaseStyles: false,
    }),
    keystatic(),
  ],

  image: {
    service: { entrypoint: "astro/assets/services/sharp" },
  },

  vite: {
    resolve: {
      alias: {
        "@components": "/src/components",
        "@layouts": "/src/layouts",
        "@styles": "/src/styles",
      },
    },
  },

  trailingSlash: "never",
});
