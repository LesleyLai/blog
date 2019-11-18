import { graphql } from "gatsby";
import * as React from "react";
import Helmet from "react-helmet";

import { TagItem } from "../types/tags";
import Layout from "../components/layout";

interface NotFoundProps {
  data: {
    posts: {
      tags: TagItem[];
    };
  };
}

const NotFoundPage = ({ data }: NotFoundProps) => {
  const tags = data.posts.tags;
  return (
    <Layout
      location={{ pathname: "/404.html" }}
      tags={tags}
      lang="en"
      otherLangs={[]}
    >
      <div>
        <Helmet>
          <title>{"Lesley Lai | 404 NOT FOUND"}</title>
        </Helmet>
        <h1>404 NOT FOUND</h1>
        <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
      </div>
    </Layout>
  );
};

export default NotFoundPage;

export const query = graphql`
  query notFoundQuery {
    posts: allMarkdownRemark(
      filter: {
        fields: { relativePath: { regex: "//blog/" } }
        frontmatter: { lang: { eq: "en" } }
      }
      sort: { fields: [frontmatter___create], order: DESC }
    ) {
      ...Tags
    }
  }
`;
