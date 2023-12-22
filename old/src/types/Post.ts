import { TagID } from "./tags";
import { Language } from "../utils/translations";

export interface PostRaw {
  frontmatter: {
    id: number;
    title: string;
    lang: Language;
    create: string;
    categories: TagID[];
  };
}

export default interface Post {
  frontmatter: {
    id: number;
    title: string;
    lang: Language;
    create: Date;
    categories: TagID[];
  };
}

export const rawToStructured = (post: PostRaw) => ({
  ...post,
  frontmatter: {
    ...post.frontmatter,
    create: new Date(post.frontmatter.create),
  },
});
