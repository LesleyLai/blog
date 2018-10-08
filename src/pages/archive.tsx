import Link from "gatsby-link";
import * as React from "react";
import Helmet from "react-helmet";

import Layout from "../components/layout";
import Posts from "../components/posts-list";
import Post from "../types/Post";

import { graphql, StaticQuery } from "gatsby";

interface ArchiveData {
  allMarkdownRemark: {
    totalCount: number;
    edges: Array<{ node: Post }>;
  };
}

interface ArchiveProps {
  data: ArchiveData;
  location: {
    pathname: string;
  };
}

export default (props: ArchiveProps) => {
  const render = (data: ArchiveData) => {
    const title = "Blog archive";
    return (
      <Layout location={props.location}>
        <div>
          <Helmet>
            <title>{"Lesley Lai | " + title}</title>
          </Helmet>
          <h1>{title}</h1>
          {data.allMarkdownRemark.totalCount} Posts
          <Posts posts={data.allMarkdownRemark.edges} />
        </div>
      </Layout>
    );
  };

  return (
    <StaticQuery
      query={graphql`
        query ArchiveQuery {
          allMarkdownRemark(
            sort: { fields: [frontmatter___create], order: DESC }
            filter: { frontmatter: { lang: { eq: "en" } } }
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
          }
        }
      `}
      render={render}
    />
  );
};
