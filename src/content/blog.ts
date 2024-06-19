import {
  type CollectionEntry,
  type Render,
  type InferEntrySchema,
  getCollection,
} from "astro:content";
import { langFromSlug } from "@i18n/i18n";

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
  entriesById: Map<string, MultiLangBlogPost>;

  constructor() {
    const blogEntriesById = groupEntriesById(blogEntries);
    populateMissingChineseEntries(blogEntriesById);
    this.entriesById = blogEntriesById as Map<string, MultiLangBlogPost>;
  }

  // Map all blog posts regardless of languages
  map<T>(func: (entry: BlogPost) => T): T[] {
    const result: T[] = [];
    for (let blogPost of BLOG_POSTS.entriesById.values()) {
      for (let entry of Object.values(blogPost)) {
        result.push(func(entry));
      }
    }

    return result;
  }
}

export const BLOG_POSTS = new BlogPosts();
