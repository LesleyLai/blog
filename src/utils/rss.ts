import rss from "@astrojs/rss";

import { BLOG_POSTS } from "@content/blog";
import type { APIContext } from "astro";

import sanitizeHtml from "sanitize-html";
import { transformSlug, type Language } from "@i18n/i18n";
import { translateTag, translations } from "@i18n/translations";
import { renderBlogPost } from "./pageRenderer";
import { generateExcerpt } from "./excerpt";

export async function getRSSFeed(context: APIContext, lang: Language) {
  const posts = BLOG_POSTS.byLang(lang).sort(
    (a, b) => new Date(b.data.created).getTime() - new Date(a.data.created).getTime()
  );

  const language = lang === "en" ? "en-us" : "zh-cn";
  const site = lang === "en" ? context.site! : `${context.site!}zh`;

  const translatedPosts = posts.filter((post) => !post.untranslated);

  const items = await Promise.all(
    translatedPosts.map(async (post) => {
      const content = await renderBlogPost(post);
      const sanitizedContent = sanitizeHtml(content, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
      });
      return {
        title: post.data.title,
        description: post.data.description ?? generateExcerpt(sanitizedContent),
        pubDate: post.data.created,
        link: transformSlug(post.id),
        content: sanitizedContent,
        categories: post.data.tags.map((tag) => translateTag(lang, tag)),
      };
    })
  );

  return rss({
    title: translations[lang].rssFeed.blogName,
    description: translations[lang].rssFeed.blogDescription,
    site: site,
    trailingSlash: false,
    items,
    customData: `<language>${language}</language>`,
    stylesheet: "/rss/styles.xsl",
  });
}

export const getRSSRoute = (lang: Language): string => (lang === "en" ? "/rss.xml" : `/zh/rss.xml`);
