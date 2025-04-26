// Helpers to process blog post data

import { type CollectionEntry, getCollection } from "astro:content";
import { langFromSlug, type Language } from "@i18n/i18n";

export interface BlogPost extends CollectionEntry<"blog"> {
  untranslated?: boolean;
}

export type MultiLangBlogPost = {
  en: BlogPost;
  zh: BlogPost;
};

const groupEntriesById = (blogEntries: CollectionEntry<"blog">[]) => {
  const byId = new Map<string, Partial<MultiLangBlogPost>>();
  for (const entry of blogEntries) {
    const lang = langFromSlug(entry.id);
    const id = entry.id.replace(`\/${lang}`, "");
    if (!byId.has(id)) {
      byId.set(id, {});
    }
    byId.get(id)![lang] = entry;
  }

  return byId;
};

// If a blog post lacks a Chinese translation, fill the Chinese page with the English text.
const populateMissingChineseEntries = (
  blogEntriesById: Map<string, Partial<MultiLangBlogPost>>
) => {
  blogEntriesById.forEach((entries: Partial<MultiLangBlogPost>) => {
    if (!entries.zh) {
      const { id, untranslated: _untranslated, ...rest } = entries.en!;
      const [idWithoutLang, _] = id.split("/");
      entries.zh = {
        ...rest,
        untranslated: true,
        id: `${idWithoutLang}/zh`,
      };
    }
  });
};

const blogEntries = await getCollection("blog");

class BlogPosts {
  byId: Map<string, MultiLangBlogPost>;

  constructor() {
    const blogEntriesById = groupEntriesById(blogEntries);
    populateMissingChineseEntries(blogEntriesById);

    // validate
    blogEntriesById.forEach((multiLangBlogPost) => {
      if (!multiLangBlogPost.en || !multiLangBlogPost.zh) {
        throw new Error(`Missing language version in one blog post!`);
      }
    });

    this.byId = blogEntriesById as Map<string, MultiLangBlogPost>;
  }

  // all blog posts regardless of languages
  get all(): BlogPost[] {
    const result: BlogPost[] = [];
    for (const multiLangBlogPost of BLOG_POSTS.byId.values()) {
      for (const post of Object.values(multiLangBlogPost)) {
        result.push(post);
      }
    }

    return result;
  }

  // Gets the number of posts
  get size(): number {
    return this.byId.size;
  }

  // Filter By Language
  byLang(lang: Language): BlogPost[] {
    const result: BlogPost[] = [];
    BLOG_POSTS.byId.forEach((multiLangBlogPost) => {
      result.push(multiLangBlogPost[lang]);
    });
    return result;
  }
}

// Sort blog posts by date in descending order (newest to oldest)
export const sortByDate = (posts: BlogPost[]) => {
  posts.sort((lhs, rhs) => rhs.data.created.getTime() - lhs.data.created.getTime());
};

export const BLOG_POSTS = new BlogPosts();

// All blog post tags and post count
export const POST_COUNT_BY_TAGS = (() => {
  const tags = new Map<string, number>();
  for (const entry of BLOG_POSTS.byLang("en")) {
    for (const tag of entry.data.tags) {
      if (tags.has(tag)) {
        tags.set(tag, tags.get(tag)! + 1);
      } else {
        tags.set(tag, 1);
      }
    }
  }

  const array = Array.from(tags);

  array.sort(([_tag1, a], [_tag2, b]) => b - a);
  return array.map(([tag, count]) => ({
    id: tag,
    count: count,
  }));
})();

export const ALL_BLOG_POST_TAGS = POST_COUNT_BY_TAGS.map(({ id }) => id);
