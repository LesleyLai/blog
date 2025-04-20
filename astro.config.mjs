import { defineConfig } from "astro/config";

import icon from "astro-icon";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import pagefind from "astro-pagefind";

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
      styleOverrides: {
        borderRadius: 0,
        borderWidth: "1px",
        borderColor: "var(--border-color)",
        codeFontFamily: '"PT Mono", monospace',
        frames: {
          frameBoxShadowCssValue: "none",
        },
      },
    }),
    mdx(),
    sitemap(),
    pagefind()
  ],
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [
      rehypeHeadingIds,
      [
        rehypeAutolinkHeadings,
        {
          properties: (e) => ({
            className: ["anchor"],
            ariaLabel: `${e.properties.id} permalink`,
          }),
        },
      ],
      rehypeMathJax,
    ],
  },
  redirects: {
    "/en": "/",
    "/en/archive": "/en/blog",
    "/zh/archive": "/zh/blog",
  },
});
