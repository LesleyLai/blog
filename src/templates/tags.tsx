import { graphql } from "gatsby";
import * as React from "react";

import SEO from "../components/seo";

import Layout from "../components/layout";
import Posts from "../components/postsList";
import { PostRaw, rawToStructured } from "../types/Post";
import { TagID, TagItem } from "../types/tags";
import { Language, translations } from "../utils/translations";

export interface ArchiveData {
  posts: {
    totalCount: number;
    edges: Array<{ node: PostRaw }>;
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
    const posts = this.props.data.posts;

    const tag = this.props.pageContext.tag;
    const lang = this.props.pageContext.lang;
    const title = translations[lang]["stuff_I_wrote_about"](tag);

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
        <SEO title={title} lang={lang} path={this.props.location.pathname} />
        <h1>{title}</h1>
        {translations[lang]["n_posts"](data.posts.totalCount)}
        <Posts
          lang={lang}
          posts={posts.edges.map(edge => rawToStructured(edge.node))}
          excludeTag={tag}
        />
      </Layout>
    );
  }
}

export default TagsTemplate;

export const query = graphql`
  query TagsQuery($tag: String!, $lang: String!, $otherLangsRegex: String!) {
    posts: allMdx(
      sort: { fields: [frontmatter___create], order: DESC }
      filter: {
        fileAbsolutePath: { regex: "//contents/blog//" }
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
            create
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
    allPosts: allMdx(
      filter: {
        fileAbsolutePath: { regex: "//contents/blog//" }
        frontmatter: { lang: { eq: $lang } }
      }
    ) {
      totalCount
      ...Tags
    }
  }
`;
