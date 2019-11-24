import { graphql } from "gatsby";
import * as React from "react";
import Helmet from "react-helmet";

import { TagItem } from "../types/tags";
import Layout from "../components/layout";

interface NotFoundProps {
  data: {
    posts: {
      tags: TagItem[];
      totalCount: number;
    };
  };
  location: {
    pathname: string;
  };
}

const NotFoundPage = ({ data, location }: NotFoundProps) => {
  const tags = data.posts.tags;
  return (
    <Layout
      location={location}
      tags={tags}
      lang="en"
      otherLangs={[]}
      postsTotalCount={data.posts.totalCount}
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
      totalCount
      ...Tags
    }
  }
`;
