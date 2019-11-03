import { graphql, StaticQuery } from "gatsby";
import Link from "gatsby-link";
import * as React from "react";

import Footer from "../components/footer";
import Layout from "../components/layout";
import RecentPosts, { PostMeta } from "../components/recentPosts";

interface IndexData {
  allMarkdownRemark: {
    totalCount: number;
    edges: Array<{
      node: PostMeta;
    }>;
  };
}

interface IndexProps {
  data: IndexData;
  location: {
    pathname: string;
  };
}

class IndexPage extends React.Component<IndexProps> {
  public render() {
    const helper = (data: IndexData) => (
      <Layout location={this.props.location}>
        <h1>Recent Posts</h1>
        <RecentPosts
          posts={data.allMarkdownRemark.edges
            .slice(0, 3)
            .map(edge => edge.node)}
        />
        <p style={{ fontSize: 20 }}>
          Older posts are available in the <Link to="/archive/">archive</Link>.
        </p>
        <Footer />
      </Layout>
    );
    return (
      <StaticQuery
        query={graphql`
          query indexQuery {
            allMarkdownRemark(
              sort: { fields: [frontmatter___create], order: DESC }
              filter: {
                fields: { relativePath: { regex: "/blog/" } }
                frontmatter: { lang: { eq: "en" } }
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
            }
          }
        `}
        render={helper}
      />
    );
  }
}

export default IndexPage;
