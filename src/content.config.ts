import { z, defineCollection } from "astro:content";
import { glob } from "astro/loaders";

const blogPostsCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    created: z.date(),
    modified: z.date().optional(),
    tags: z.array(z.string()),
  }),
});

const projectsCollection = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      created: z.date(),
      modified: z.date().optional(),
      image: image().optional(),
      github: z.string().optional(),
      demo: z.string().optional(),
      tags: z.array(z.string()),
      featured: z.boolean().optional(),
    }),
});

export const collections = {
  blog: blogPostsCollection,
  projects: projectsCollection,
};
