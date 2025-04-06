import rss from "@astrojs/rss";

import { BLOG_POSTS } from "@content/blog";
import type { APIContext } from "astro";

import sanitizeHtml from "sanitize-html";
import MarkdownIt from "markdown-it";
import { transformSlug, type Language } from "@i18n/i18n";
import { translations } from "@i18n/translations";

const parser = new MarkdownIt();

export function getRSSFeed(context: APIContext, lang: Language) {
  const posts = BLOG_POSTS.byLang(lang).sort(
    (a, b) => new Date(b.data.created).getTime() - new Date(a.data.created).getTime()
  );

  const language = lang === "en" ? "en-us" : "zh-cn";

  return rss({
    title: translations[lang].siteName,
    description: "A personal website and blog for Lesley Lai",
    site: context.site!,
    trailingSlash: false,
    items: posts.map((post) => ({
      title: post.data.title,
      //description: post.data.description,
      author: translations[lang].myname,
      pubDate: post.data.created,
      link: transformSlug(post.slug),
      content: sanitizeHtml(parser.render(post.body), {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
      }),
      categories: post.data.tags,
    })),
    customData: `<language>${language}</language>`,
    stylesheet: "/rss/styles.xsl",
  });
}
