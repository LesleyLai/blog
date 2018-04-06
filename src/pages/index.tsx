import * as React from "react";

import RecentPosts, { PostMeta } from "../components/recentPosts"

interface IndexProps {
  data: {
    allMarkdownRemark: {
      totalCount: number;
      edges: Array<{
        node: PostMeta;
      }>;
    };
  }
}

const IndexPage = ({ data }: IndexProps) => (
  <div>
    <h1>Recent Posts</h1>
    <RecentPosts posts={data.allMarkdownRemark.edges.map((edge) => edge.node)} />
  </div>
);

export const indexQuery = graphql`
  query indexQuery {
          allMarkdownRemark(sort: {fields: [frontmatter___create], order: DESC},
      filter: {
          frontmatter: {
          lang: {eq: "en"}
    }
      }) {
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
