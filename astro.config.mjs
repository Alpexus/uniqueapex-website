import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  // The real domain — canonical URLs, hreflang alternates and the sitemap
  // are all built from this (was still the Astroship template default).
  site: "https://uniqueapex.com",
  integrations: [mdx(), sitemap(), icon()],
  vite: {
    plugins: [tailwindcss()],
    server: {
      watch: {
        // OneDrive + externally-written files (e.g. delivered by Claude)
        // don't always fire native file-change events on Windows, which
        // leaves the dev server serving stale modules. Polling is cheap
        // at this project size and makes localhost always trustworthy.
        usePolling: true,
        interval: 400,
      },
    },
  },
});
