// Utility to use Astro's container API to render markdown into strings

import { type CollectionEntry } from "astro:content";

import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { loadRenderers } from "astro:container";
import { getContainerRenderer as getMDXRenderer } from "@astrojs/mdx";
import { render } from "astro:content";

const renderers = await loadRenderers([getMDXRenderer()]);
const container = await AstroContainer.create({ renderers });

export const renderBlogPost = async (page: CollectionEntry<"blog">) => {
  const { Content } = await render(page);
  return await container.renderToString(Content);
};
