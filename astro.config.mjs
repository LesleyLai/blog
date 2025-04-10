import { defineConfig } from "astro/config";

import icon from "astro-icon";

import remarkMath from "remark-math";
import rehypeMathJax from "rehype-mathjax";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { rehypeHeadingIds } from "@astrojs/markdown-remark";

import expressiveCode from "astro-expressive-code";

// https://astro.build/config
export default defineConfig({
  site: "https://lesleylai.info",
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
  integrations: [
    icon(),
    expressiveCode({
      themes: ["light-plus", "github-dark"],
      themeCssRoot: "html",
      themeCssSelector: (theme) => `.${theme.type}`,
    }),
  ],
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [
      rehypeHeadingIds,
      [
        rehypeAutolinkHeadings,
        {
          properties: {
            className: ["anchor"],
          },
        },
      ],
      rehypeMathJax,
    ],
  },
  redirects: {
    "/en": "/",
  }
});
