import { TagID } from "../types/tags";

interface PostData {
  objectID: string;
  frontmatter: {
    id: string;
    title: string;
    lang: string;
    create: string;
    tags: TagID[];
  };
  excerpt: string;
}

interface QueryData {
  posts: {
    edges: Array<{ node: PostData }>;
  };
}

const postQueryEn = `{
  posts: allMdx(filter: {fileAbsolutePath: {regex: "//contents/blog//"}, frontmatter: {lang: {eq: "en"}}}) {
    edges {
      node {
        objectID: id
        frontmatter {
          id
          title
          lang
          create(formatString: "MMM D, YYYY")
          tags: categories
        }
        excerpt(pruneLength: 5000)
      }
    }
  }
}`;

const postQueryZh = `{
  posts: allMdx(filter: {fileAbsolutePath: {regex: "//contents/blog//"}, frontmatter: {lang: {eq: "zh"}}}) {
    edges {
      node {
        objectID: id
        frontmatter {
          id
          title
          lang
          create(formatString: "MMM D, YYYY")
          tags: categories
        }
        excerpt(pruneLength: 5000)
      }
    }
  }
}`;

const flatten = (arr: Array<{ node: PostData }>) =>
  arr.map(({ node: { frontmatter, ...rest } }) => ({
    ...frontmatter,
    ...rest
  }));

const settings = { attributesToSnippet: [`excerpt:20`] };
const queries = [
  {
    query: postQueryEn,
    transformer: ({ data }: { data: QueryData }) => flatten(data.posts.edges),
    indexName: `LesleyBlogPostsen`,
    settings
  },
  {
    query: postQueryZh,
    transformer: ({ data }: { data: QueryData }) => flatten(data.posts.edges),
    indexName: `LesleyBlogPostszh`,
    settings
  }
];

export default queries;
