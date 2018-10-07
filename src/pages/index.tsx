import * as React from "react";

import Layout from "../components/layout";

import RecentPosts, { PostMeta } from "../components/recentPosts";

interface IndexProps {
  data: {
    allMarkdownRemark: {
      totalCount: number;
      edges: Array<{
        node: PostMeta;
      }>;
    };
  };
  location: {
    pathname: string;
  };
}

const IndexPage = (props: IndexProps) => (
  <Layout location={props.location}>
    <div>
      <h1>Recent Posts</h1>
      <RecentPosts
        posts={props.data.allMarkdownRemark.edges.map(edge => edge.node)}
      />
    </div>
  </Layout>
);

export const indexQuery = graphql`
  query indexQuery {
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
`;

export default IndexPage;
