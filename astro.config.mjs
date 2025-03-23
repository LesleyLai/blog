import { defineConfig } from "astro/config";

import icon from "astro-icon";

import remarkMath from "remark-math";
import rehypeMathJax from "rehype-mathjax";

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
  integrations: [icon()],
  markdown: {
    shikiConfig: {
      themes: {
        light: "light-plus",
        dark: "github-dark",
      },
    },
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeMathJax],
  },
});
