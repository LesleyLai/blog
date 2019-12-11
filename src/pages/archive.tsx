import * as React from "react";
import Helmet from "react-helmet";

import { TagItem } from "../types/tags";
import Socials from "../components/socials";
import Layout from "../components/layout";
import Posts from "../components/postsList";
import { PostRaw, rawToStructured } from "../types/Post";
import { Language, translations } from "../utils/translations";

import { graphql } from "gatsby";

interface ArchiveData {
  posts: {
    totalCount: number;
    edges: Array<{ node: PostRaw }>;
    tags: TagItem[];
  };
}

interface ArchiveProps {
  data: ArchiveData;
  location: {
    pathname: string;
  };
  pageContext: { lang: Language };
}

const Archive = (props: ArchiveProps) => {
  const posts = props.data.posts;
  const lang = props.pageContext.lang;
  const title = translations[lang]["archive_title"];

  return (
    <Layout
      location={props.location}
      lang={lang}
      tags={posts.tags}
      postsTotalCount={posts.totalCount}
    >
      <div>
        <Helmet>
          <title>{`${title} | ${translations[lang]["title"]}`}</title>
          <meta name="Description" content="All blog posts of Lesley Lai" />
        </Helmet>
        <h1>{title}</h1>
        {translations[lang]["n_posts"](posts.totalCount)}
        <Posts
          lang={lang}
          posts={posts.edges.map(edge => rawToStructured(edge.node))}
        />
        <Socials lang={lang} />
      </div>
    </Layout>
  );
};

export default Archive;

export const query = graphql`
  query ArchiveQuery($lang: String!) {
    posts: allMdx(
      sort: { fields: [frontmatter___create], order: DESC }
      filter: {
        fileAbsolutePath: { regex: "//contents/blog//" }
        frontmatter: { lang: { eq: $lang } }
      }
    ) {
      totalCount
      edges {
        node {
          frontmatter {
            id
            title
            lang
            create
            categories
          }
          excerpt
        }
      }
      ...Tags
    }
  }
`;
