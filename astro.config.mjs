// astro.config.mjs
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel";

export default defineConfig({
  output: "server",
  adapter: vercel({
    includeFiles: [
      "src/content/singletons/home.yaml",
      "src/content/singletons/about.yaml",
      "src/content/singletons/footer.yaml",
      "src/content/singletons/work-landing.yaml",
      "src/content/singletons/lab-landing.yaml",
    ],
  }),
  site: "https://portfolio-site-liart-ten.vercel.app",

  integrations: [
    mdx(),
    react(),
    tailwind({
      applyBaseStyles: false,
    }),

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

  security: {
    checkOrigin: false,
  },
});
