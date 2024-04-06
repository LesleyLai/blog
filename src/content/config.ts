// Import utilities from `astro:content`
import { z, defineCollection } from "astro:content";

const blogPostsCollection = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    created: z.date(),
    modified: z.date(),
    tags: z.array(z.string()),
  }),
});

export const collections = {
  blog: blogPostsCollection,
};
