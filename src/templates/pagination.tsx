import { graphql } from "gatsby";
import * as React from "react";

import { TagItem } from "../types/tags";
import Socials from "../components/socials";
import Layout from "../components/layout";
import PaginatedPostsList, { PostMeta } from "../components/paginatedPostsList";
import { Language, translations } from "../utils/translations";
import SEO from "../components/seo";

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
  pageContext: {
    lang: Language;
    pagesCount: number;
    currentPage: number;
  };
}

class PaginationTemplate extends React.Component<IndexProps> {
  public render() {
    const data = this.props.data;
    const { lang, pagesCount, currentPage } = this.props.pageContext;

    return (
      <Layout
        location={this.props.location}
        lang={lang}
        tags={data.allPosts.tags}
        postsTotalCount={data.allPosts.totalCount}
      >
        <SEO
          title={translations[lang]["title"]}
          lang={lang}
          description="Personal website of Lesley Lai"
          path={this.props.location.pathname}
        />
        <h1>{translations[lang]["blog"]}</h1>
        <PaginatedPostsList
          posts={data.posts.edges.map(edge => edge.node)}
          lang={lang}
          pagesCount={pagesCount}
          currentPage={currentPage}
        />
        <Socials lang={lang} />
      </Layout>
    );
  }
}

export default PaginationTemplate;

export const query = graphql`
  query paginationQuery($lang: String!, $dateLocale: String!, $skip: Int!) {
    posts: allMdx(
      filter: {
        fileAbsolutePath: { regex: "//contents/blog//" }
        frontmatter: { lang: { eq: $lang } }
      }
      sort: { fields: [frontmatter___create], order: DESC }
      limit: 5
      skip: $skip
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
