import { graphql } from "gatsby";
import * as React from "react";
import Helmet from "react-helmet";
import Socials from "../components/socials";
import Layout from "../components/layout";
import TagsList from "../components/tagsList";

import ReactDisqusComments from "react-disqus-comments";

import { TagID, TagItem } from "../types/tags";
import { Language, translations } from "../utils/translations";

const css = require("./post.module.css");
require(`katex/dist/katex.min.css`);

export interface PostData {
  html: string;
  frontmatter: {
    id: string;
    lang: Language;
    title: string;
    create: string;
    lastModify: string;
    categories: TagID[];
  };
  fields: {
    readingTime: {
      minutes: number;
      words: number;
    };
  };
}

interface PostProps {
  data: {
    site: {
      siteMetadata: {
        siteUrl: string;
      };
    };
    post: PostData;
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
    const post = this.props.data.post;
    const lang = post.frontmatter.lang;
    const path = "/" + lang + "/" + post.frontmatter.id;
    const url = "http://lesleylai.info" + path;

    const tags = this.props.data.allPosts.tags;
    const postsTotalCount = this.props.data.allPosts.totalCount;

    const otherLangs = this.props.data.otherLangs.edges.map(
      edge => edge.node.frontmatter.lang
    );

    const readingTimeMinutes = Math.round(post.fields.readingTime.minutes);
    const words = post.fields.readingTime.words;

    const create = post.frontmatter.create;
    const lastModify = post.frontmatter.lastModify;

    const absolutePath = this.props.data.site.siteMetadata.siteUrl + path;

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
              {lang === "en" &&
                ` | ${words} words | ${readingTimeMinutes} min read`}
            </span>
            <TagsList
              lang={lang}
              tags={post.frontmatter.categories}
              className={css.tags}
            />
          </div>
          <article
            className={css.article}
            dangerouslySetInnerHTML={{ __html: post.html }}
          />

          <Socials
            lang={lang}
            shareInfo={{
              title: post.frontmatter.title,
              url: absolutePath
            }}
          />
          <div className={css.comment}>
            <ReactDisqusComments
              shortname="lesleylaiblog"
              identifier={post.frontmatter.id}
              title={post.frontmatter.title}
              url={url}
              onNewComment={this.handleNewComment}
              language={lang}
            />
          </div>
        </div>
      </Layout>
    );
  }
}

export default PostTemplate;

export const query = graphql`
  query BlogPostQuery($id: String!, $lang: String!, $dateLocale: String!) {
    site {
      siteMetadata {
        siteUrl
      }
    }
    post: markdownRemark(
      frontmatter: { id: { eq: $id }, lang: { eq: $lang } }
    ) {
      html
      frontmatter {
        id
        lang
        title
        create(formatString: "LL", locale: $dateLocale)
        lastModify(formatString: "LL", locale: $dateLocale)
        categories
      }
      fields {
        readingTime {
          minutes
          words
        }
      }
    }
    otherLangs: allMarkdownRemark(
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
