export default interface Post {
  frontmatter: {
    id: number;
    title: string;
    lang: string;
    create: string;
    categories: string[];
  };
}
