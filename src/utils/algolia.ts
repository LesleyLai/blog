import { TagID } from "../types/tags";

import { languages, Language } from "./translations";

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

const postQuery = (lang: Language) => `{
  posts: allMdx(
    filter: {
      frontmatter: { lang: { eq: "${lang}" } }
      fileAbsolutePath: { regex: "//contents/blog//" }
    }) {
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

const queries = languages.map(lang => ({
  query: postQuery(lang),
  transformer: ({ data }: { data: QueryData }) => flatten(data.posts.edges),
  indexName: `LesleyBlogPosts${lang}`,
  settings
}));

export default queries;
