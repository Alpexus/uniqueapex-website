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
  integrations: [
    mdx(),
    sitemap({
      // Only the public marketing / legal / auth-entry pages belong in the
      // sitemap. App pages live behind login (empty shells to a crawler),
      // /admin is the coordinator console, and /blog is still template
      // content — none of those should be offered to search engines.
      filter: (page) =>
        [
          "/", "/howitworks/", "/about/", "/pricing/", "/contact/",
          "/waitlist/", "/privacy/", "/terms/", "/signin/", "/signup/", "/login/",
          "/fr/", "/fr/howitworks/", "/fr/about/", "/fr/pricing/", "/fr/contact/",
          "/fr/waitlist/", "/fr/privacy/", "/fr/terms/", "/fr/signin/", "/fr/signup/",
        ].includes(new URL(page).pathname),
    }),
    icon(),
  ],
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
