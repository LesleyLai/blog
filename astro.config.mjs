import { defineConfig } from "astro/config";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  prefetch: {
    defaultStrategy: "viewport",
  },
  i18n: {
    defaultLocale: "en",
    locales: ["en", "zh"],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
    },
  },
  integrations: [react()],
});
