import {
  type CollectionEntry,
  type Render,
  type InferEntrySchema,
  getCollection,
} from "astro:content";
import { langFromSlug, type Language } from "@i18n/i18n";

export interface BlogPost {
  body: string;
  slug: string;
  data: InferEntrySchema<"blog">;
  untranslated?: boolean;
  render(): Render[".md"];
}

export type MultiLangBlogPost = {
  en: BlogPost;
  zh: BlogPost;
};

const groupEntriesById = (blogEntries: CollectionEntry<"blog">[]) => {
  const byId = new Map<string, Partial<MultiLangBlogPost>>();
  for (const entry of blogEntries) {
    const lang = langFromSlug(entry.slug);
    const id = entry.slug.replace(`${lang}\/`, "");
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
  blogEntriesById.forEach((entries: Partial<MultiLangBlogPost>, id: string) => {
    if (!entries.zh) {
      let { slug, untranslated, ...rest } = entries.en!;
      entries.zh = {
        ...rest,
        untranslated: true,
        slug: `zh/${id}`,
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
    for (let multiLangBlogPost of BLOG_POSTS.byId.values()) {
      for (let post of Object.values(multiLangBlogPost)) {
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
