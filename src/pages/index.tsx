import { graphql } from "gatsby";
import * as React from "react";
import Helmet from "react-helmet";

import { TagItem } from "../types/tags";
import Socials from "../components/socials";
import Layout from "../components/layout";
import RecentPosts, { PostMeta } from "../components/recentPosts";
import { Language, translations } from "../utils/translations";

interface IndexData {
  posts: {
    edges: Array<{
      node: PostMeta;
    }>;
  };
  allPosts: {
    totalCount: number;
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
        tags={data.allPosts.tags}
        postsTotalCount={data.allPosts.totalCount}
      >
        <Helmet>
          <title>{`${translations[lang]["title"]}`}</title>
          <meta name="Description" content="Personal website of Lesley Lai" />
        </Helmet>
        <h1>{translations[lang]["recent_posts"]}</h1>
        {translations[lang]["older_posts"]()}
        <RecentPosts
          posts={data.posts.edges.map(edge => edge.node)}
          lang={lang}
        />
        <Socials lang={lang} />
      </Layout>
    );
  }
}

export default IndexPage;

export const query = graphql`
  query indexQuery($lang: String!, $dateLocale: String!) {
    posts: allMdx(
      filter: {
        fileAbsolutePath: { regex: "//contents/blog//" }
        frontmatter: { lang: { eq: $lang } }
      }
      sort: { fields: [frontmatter___create], order: DESC }
      limit: 4
    ) {
      totalCount
      edges {
        node {
          frontmatter {
            id
            title
            lang
            create(formatString: "LL", locale: $dateLocale)
            categories
          }
          excerpt(pruneLength: 200)
        }
      }
    }
    allPosts: allMdx(
      filter: {
        fileAbsolutePath: { regex: "//contents/blog//" }
        frontmatter: { lang: { eq: $lang } }
      }
      sort: { fields: [frontmatter___create], order: DESC }
    ) {
      totalCount
      ...Tags
    }
  }
`;
