import rss from "@astrojs/rss";

import { BLOG_POSTS } from "@content/blog";
import type { APIContext } from "astro";

import sanitizeHtml from "sanitize-html";
import MarkdownIt from "markdown-it";
import { transformSlug, type Language } from "@i18n/i18n";
import { translateTag, translations } from "@i18n/translations";

const parser = new MarkdownIt();

export function getRSSFeed(context: APIContext, lang: Language) {
  const posts = BLOG_POSTS.byLang(lang).sort(
    (a, b) => new Date(b.data.created).getTime() - new Date(a.data.created).getTime()
  );

  const language = lang === "en" ? "en-us" : "zh-cn";
  const site = lang === "en" ? context.site! : `${context.site!}zh`;

  return rss({
    title: translations[lang].rssFeed.blogName,
    description: translations[lang].rssFeed.blogDescription,
    site: site,
    trailingSlash: false,
    items: posts
      .filter((post) => !post.untranslated)
      .map((post) => ({
        title: post.data.title,
        description: post.data.description,
        author: translations[lang].myname,
        pubDate: post.data.created,
        link: transformSlug(post.id),
        content: sanitizeHtml(parser.render(post.body ?? ""), {
          allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
        }),
        categories: post.data.tags.map((tag) => translateTag(lang, tag)),
      })),
    customData: `<language>${language}</language>`,
    stylesheet: "/rss/styles.xsl",
  });
}

export const getRSSRoute = (lang: Language): string => (lang === "en" ? "/rss.xml" : `/zh/rss.xml`);
