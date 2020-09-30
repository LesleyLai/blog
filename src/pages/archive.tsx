import * as React from "react";

import { TagItem } from "../types/tags";
import Socials from "../components/socials";
import Layout from "../components/layout";
import PostsByYear from "../components/postsByYear";
import { PostRaw, rawToStructured } from "../types/Post";
import { Language, translations } from "../utils/translations";
import SEO from "../components/seo";

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
        <SEO
          title={title}
          lang={lang}
          description="All blog posts of Lesley Lai"
          path={props.location.pathname}
        />
        <h1>{title}</h1>
        {translations[lang]["n_posts"](posts.totalCount)}
        <PostsByYear lang={lang} posts={posts.edges.map(edge => rawToStructured(edge.node))} />
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
