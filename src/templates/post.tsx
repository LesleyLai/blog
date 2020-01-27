import { graphql } from "gatsby";
import * as React from "react";
import { MDXRenderer } from "gatsby-plugin-mdx";
import Helmet from "react-helmet";
import PrevNextLinks from "../components/prevnextlinks";
import Socials from "../components/socials";
import Layout from "../components/layout";
import TagsList from "../components/tagsList";

import { TagID, TagItem } from "../types/tags";
import { Language, translations } from "../utils/translations";

const css = require("./post.module.css");
require(`katex/dist/katex.min.css`);

export interface PostData {
  body: string;
  frontmatter: {
    id: string;
    lang: Language;
    title: string;
    create: string;
    lastModify: string;
    categories: TagID[];
  };
}

interface PostTitleInfo {
  frontmatter: {
    title: string;
  };
}

interface PostProps {
  pageContext: {
    previousId?: string;
    nextId?: string;
  };
  data: {
    site: {
      siteMetadata: {
        siteUrl: string;
      };
    };
    post: PostData;
    prevPost: PostTitleInfo;
    nextPost: PostTitleInfo;
    otherLangs: {
      edges: Array<{
        node: {
          frontmatter: {
            lang: Language;
          };
        };
      }>;
    };
    allPosts: {
      totalCount: number;
      tags: TagItem[];
    };
  };
}

class PostTemplate extends React.Component<PostProps> {
  public handleNewComment() {
    /* noop now */
  }

  public render() {
    const data = this.props.data;
    const post = data.post;
    const lang = post.frontmatter.lang;
    const path = "/" + lang + "/" + post.frontmatter.id;

    const tags = data.allPosts.tags;
    const postsTotalCount = data.allPosts.totalCount;

    const otherLangs = data.otherLangs.edges.map(
      edge => edge.node.frontmatter.lang
    );

    const create = post.frontmatter.create;
    const lastModify = post.frontmatter.lastModify;

    const absolutePath = data.site.siteMetadata.siteUrl + path;

    const previousId = this.props.pageContext.previousId;
    const nextId = this.props.pageContext.nextId;

    const previousInfo = previousId
      ? { id: previousId, title: data.prevPost.frontmatter.title }
      : null;
    const nextInfo = nextId
      ? { id: nextId, title: data.nextPost.frontmatter.title }
      : null;

    return (
      <Layout
        location={{ pathname: path }}
        lang={lang}
        otherLangs={otherLangs}
        tags={tags}
        postsTotalCount={postsTotalCount}
      >
        <div className={css.post}>
          <Helmet>
            <title>{`${post.frontmatter.title} | ${translations[lang]["title"]}`}</title>
            <meta name="Description" content={post.frontmatter.title} />
          </Helmet>
          <h1 className={css.title}>{post.frontmatter.title}</h1>
          <div className={css.info}>
            <span className={css.date}>
              {create !== lastModify &&
                `${translations[lang]["lastModify"]}: ${lastModify} | `}
              {`${translations[lang]["create"]}: ${create}`}
            </span>
            <TagsList
              lang={lang}
              tags={post.frontmatter.categories}
              className={css.tags}
            />
          </div>
          <MDXRenderer>{post.body}</MDXRenderer>

          <Socials
            lang={lang}
            shareInfo={{
              title: post.frontmatter.title,
              url: absolutePath
            }}
          />

          <PrevNextLinks
            lang={lang}
            previousInfo={previousInfo}
            nextInfo={nextInfo}
          />

          <div className={css.comment}>{/* For comment */}</div>
        </div>
      </Layout>
    );
  }
}

export default PostTemplate;

export const query = graphql`
  query BlogPostQuery(
    $id: String!
    $lang: String!
    $dateLocale: String!
    $previousId: String
    $nextId: String
  ) {
    site {
      siteMetadata {
        siteUrl
      }
    }
    post: mdx(frontmatter: { id: { eq: $id }, lang: { eq: $lang } }) {
      body
      frontmatter {
        id
        lang
        title
        create(formatString: "LL", locale: $dateLocale)
        lastModify(formatString: "LL", locale: $dateLocale)
        categories
      }
    }
    otherLangs: allMdx(
      filter: { frontmatter: { id: { eq: $id }, lang: { ne: $lang } } }
    ) {
      edges {
        node {
          frontmatter {
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
    prevPost: mdx(
      frontmatter: { id: { eq: $previousId }, lang: { eq: $lang } }
    ) {
      frontmatter {
        title
      }
    }
    nextPost: mdx(frontmatter: { id: { eq: $nextId }, lang: { eq: $lang } }) {
      frontmatter {
        title
      }
    }
  }
`;
