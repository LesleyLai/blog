import { defineConfig } from "astro/config";

import icon from "astro-icon";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import pagefind from "astro-pagefind";

import remarkMath from "remark-math";
import rehypeMathJax from "rehype-mathjax";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { rehypeHeadingIds } from "@astrojs/markdown-remark";
import rehypeExternalLinks from "rehype-external-links";
import expressiveCode from "astro-expressive-code";

const externalLinkIcon = {
  type: "element",
  tagName: "svg",
  children: [
    {
      type: "element",
      tagName: "symbol",
      properties: {
        id: "ai:mdi:open-in-new",
        viewBox: "0 0 24 24",
      },
      children: [
        {
          type: "element",
          tagName: "path",
          properties: {
            fill: "currentColor",
            d: "M14 3v2h3.59l-9.83 9.83l1.41 1.41L19 6.41V10h2V3m-2 16H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7h-2z",
          },
        },
      ],
    },
    {
      type: "element",
      tagName: "use",
      properties: {
        href: "#ai:mdi:open-in-new",
      },
    },
  ],
};

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
    pagefind(),
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
      [
        rehypeExternalLinks,
        {
          content: externalLinkIcon,
          contentProperties: { className: ["external-link-icon"] },
          rel: ["noopener"],
          target: "_blank",
        },
      ],
    ],
  },
  redirects: {
    "/en": "/",
    "/en/archive": "/en/blog",
    "/zh/archive": "/zh/blog",
  },
});
