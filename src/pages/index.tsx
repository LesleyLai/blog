import { graphql } from "gatsby";
import Link from "gatsby-link";
import * as React from "react";

import { TagItem } from "../types/tags";
import Footer from "../components/footer";
import Layout from "../components/layout";
import RecentPosts, { PostMeta } from "../components/recentPosts";
import { Language, translations } from "../utils/translations";

interface IndexData {
  allMarkdownRemark: {
    totalCount: number;
    edges: Array<{
      node: PostMeta;
    }>;
    tags: TagItem[];
  };
}

interface IndexProps {
  data: IndexData;
  location: {
    pathname: string;
  };
  pageContext: { lang: Language };
}

class IndexPage extends React.Component<IndexProps> {
  public render() {
    const data = this.props.data;
    const lang = this.props.pageContext.lang;

    return (
      <Layout
        location={this.props.location}
        lang={lang}
        tags={data.allMarkdownRemark.tags}
      >
        <h1>{translations[lang]["recent_posts"]}</h1>
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
  }
}

export default IndexPage;

export const query = graphql`
  query indexQuery($lang: String!) {
    allMarkdownRemark(
      filter: {
        fields: { relativePath: { regex: "//blog/" } }
        frontmatter: { lang: { eq: $lang } }
      }
      sort: { fields: [frontmatter___create], order: DESC }
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
