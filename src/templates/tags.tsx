import { graphql } from "gatsby";
import * as React from "react";
import Helmet from "react-helmet";

import Layout from "../components/layout";
import Posts from "../components/postsList";
import Post from "../types/Post";
import { TagID, TagItem } from "../types/tags";
import { Language, translations } from "../utils/translations";

export interface ArchiveData {
  posts: {
    totalCount: number;
    edges: Array<{ node: Post }>;
  };
  allPosts: {
    totalCount: number;
    tags: TagItem[];
  };
  otherLangs: {
    edges: Array<{
      node: {
        context: {
          lang: Language;
        };
      };
    }>;
  };
}

interface ArchiveProps {
  data: ArchiveData;
  pageContext: { tag: TagID; lang: Language };
  location: { pathname: string };
}

class TagsTemplate extends React.Component<ArchiveProps> {
  public render() {
    const data = this.props.data;

    const tag = this.props.pageContext.tag;
    const lang = this.props.pageContext.lang;
    const title = translations[lang][tag];

    const otherLangs = data.otherLangs.edges.map(
      edge => edge.node.context.lang
    );

    return (
      <Layout
        location={this.props.location}
        lang={lang}
        otherLangs={otherLangs}
        tags={data.allPosts.tags}
        postsTotalCount={data.allPosts.totalCount}
      >
        <Helmet>
          <title>{`Lesley Lai | ${title}`}</title>
        </Helmet>
        <h1>{title}</h1>
        {data.posts.totalCount} Posts
        <Posts posts={data.posts.edges} excludeTag={tag} />
      </Layout>
    );
  }
}

export default TagsTemplate;

export const query = graphql`
  query TagsQuery($tag: String!, $lang: String!, $otherLangsRegex: String!) {
    posts: allMarkdownRemark(
      sort: { fields: [frontmatter___create], order: DESC }
      filter: {
        fields: { relativePath: { regex: "//blog/" } }
        frontmatter: { lang: { eq: $lang }, categories: { in: [$tag] } }
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
    otherLangs: allSitePage(filter: { path: { regex: $otherLangsRegex } }) {
      edges {
        node {
          context {
            lang
          }
        }
      }
    }
    allPosts: allMarkdownRemark(
      filter: {
        fields: { relativePath: { regex: "//blog/" } }
        frontmatter: { lang: { eq: $lang } }
      }
    ) {
      totalCount
      ...Tags
    }
  }
`;
