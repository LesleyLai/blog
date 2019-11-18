import { graphql } from "gatsby";
import * as React from "react";
import Helmet from "react-helmet";

import Layout from "../components/layout";
import Posts from "../components/postsList";
import Post from "../types/Post";
import { TagID, TagItem } from "../types/tags";
import { Language, languages, translations } from "../utils/translations";

export interface ArchiveData {
  posts: {
    totalCount: number;
    edges: Array<{ node: Post }>;
  };
  allPosts: {
    tags: TagItem[];
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

    return (
      <Layout
        location={this.props.location}
        lang={lang}
        otherLangs={languages.filter(l => l !== lang)}
        tags={data.allPosts.tags}
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
  query TagsQuery($tag: String!, $lang: String!) {
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
    allPosts: allMarkdownRemark(
      filter: {
        fields: { relativePath: { regex: "//blog/" } }
        frontmatter: { lang: { eq: $lang } }
      }
    ) {
      ...Tags
    }
  }
`;
