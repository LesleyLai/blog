import * as React from "react";
import Helmet from "react-helmet";

import { TagItem } from "../types/tags";
import Footer from "../components/footer";
import Layout from "../components/layout";
import Posts from "../components/postsList";
import Post from "../types/Post";
import { Language, translations } from "../utils/translations";

import { graphql } from "gatsby";

interface ArchiveData {
  posts: {
    totalCount: number;
    edges: Array<{ node: Post }>;
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
          <title>{"Lesley Lai | " + title}</title>
        </Helmet>
        <h1>{title}</h1>
        {posts.totalCount} Posts
        <Posts posts={posts.edges} />
        <Footer />
      </div>
    </Layout>
  );
};

export default Archive;

export const query = graphql`
  query ArchiveQuery($lang: String!) {
    posts: allMarkdownRemark(
      sort: { fields: [frontmatter___create], order: DESC }
      filter: {
        fields: { relativePath: { regex: "//blog/" } }
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
            create(formatString: "DD MMMM YYYY")
            categories
          }
          excerpt
        }
      }
      ...Tags
    }
  }
`;
