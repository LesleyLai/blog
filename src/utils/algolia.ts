import remark from "remark";

import { TagID } from "../types/tags";
import { languages, Language } from "./translations";

interface PostFrontMatter {
  id: string;
  title: string;
  lang: string;
  create: string;
  tags: TagID[];
}

interface PostDataBase {
  frontmatter: PostFrontMatter;
}

interface PostRawData extends PostDataBase {
  rawBody: string;
}

interface PostData extends PostDataBase {
  content: string;
}

interface QueryData {
  posts: {
    edges: Array<{ node: PostRawData }>;
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
        frontmatter {
          id
          title
          lang
          create(formatString: "MMM D, YYYY")
          tags: categories
        }
        rawBody
      }
    }
  }
}`;

const flatten = (arr: PostData[]) =>
  arr.map(({ frontmatter, ...rest }) => ({
    ...frontmatter,
    ...rest,
  }));

const handleRawBody = (node: PostRawData) => {
  // We want to split `rawBody` from the node
  const { rawBody, ...rest } = node;

  const frontmatter = require("remark-frontmatter");
  const unlink = require("remark-unlink");
  const strip = require("strip-markdown");

  const text = remark()
    .use(frontmatter)
    .use(unlink)
    .use(strip)
    .processSync(rawBody)
    .toString();

  // Split by two adjacent empty line (an estimation of paragraph)
  const sections = text.split("\n\n");

  const records = sections.map(section => ({
    ...rest,
    content: section,
  }));

  return records;
};

const queries = languages.map(lang => ({
  query: postQuery(lang),
  transformer: ({ data }: { data: QueryData }) =>
    flatten(
      data.posts.edges
        .map(edge => edge.node)
        .map(handleRawBody)
        .reduce((x, y) => x.concat(y), [])
    ),
  indexName: `LesleyBlogPosts${lang}`,
  settings: {
    attributeForDistinct: "id",
    distinct: true,
  },
}));

export default queries;
