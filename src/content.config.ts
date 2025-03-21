// Import utilities from `astro:content`
import { z, defineCollection } from "astro:content";

const blogPostsCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    created: z.date(),
    modified: z.date().optional(),
    tags: z.array(z.string()),
  }),
});

const projectsCollection = defineCollection({
  type: "content",
  schema: z.object({
    name: z.string(),
    created: z.date(),
    modified: z.date().optional(),
  }),
});

export const collections = {
  blog: blogPostsCollection,
  projects: projectsCollection,
};
