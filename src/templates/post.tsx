import { graphql } from "gatsby";
import * as React from "react";
import Helmet from "react-helmet";
import Footer from "../components/footer";
import Layout from "../components/layout";
import TagsList from "../components/tagsList";

import ReactDisqusComments from "react-disqus-comments";

import { TagID } from "../utils/tagInfo";
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
      text: string;
    };
  };
}

interface PostProps {
  data: {
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
  };
}

class PostTemplate extends React.Component<PostProps> {
  public handleNewComment() {
    /* noop now */
  }

  public render() {
    const post = this.props.data.post;
    const lang = post.frontmatter.lang;
    const path = "/" + post.frontmatter.id + "/" + lang;
    const url = "http://lesleylai.info" + path;
    const title = translations[lang]["title"] + " | " + post.frontmatter.title;

    const otherLangs = this.props.data.otherLangs.edges.map(
      edge => edge.node.frontmatter.lang
    );

    return (
      <Layout location={{ pathname: path }} lang={lang} otherLangs={otherLangs}>
        <div className={css.post}>
          <Helmet>
            <title>{title}</title>
          </Helmet>
          <h1 className={css.title}>{post.frontmatter.title}</h1>
          <div className={css.info}>
            <span className={css.date}>
              {translations[lang]["lastModify"]}: {post.frontmatter.lastModify}{" "}
              | {translations[lang]["create"]}: {post.frontmatter.create} |{" "}
              {post.fields.readingTime.text}
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

          <Footer />
          <div className={css.comment}>
            <ReactDisqusComments
              shortname="lesleylaiblog"
              identifier={post.frontmatter.id}
              title={post.frontmatter.title}
              url={url}
              onNewComment={this.handleNewComment}
            />
          </div>
        </div>
      </Layout>
    );
  }
}

export default PostTemplate;

export const query = graphql`
  query BlogPostQuery($id: String!, $lang: String!) {
    post: markdownRemark(
      frontmatter: { id: { eq: $id }, lang: { eq: $lang } }
    ) {
      html
      frontmatter {
        id
        lang
        title
        create(formatString: "DD MMMM, YYYY")
        lastModify(formatString: "DD MMMM, YYYY")
        categories
      }
      fields {
        readingTime {
          text
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
  }
`;
