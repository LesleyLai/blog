import { graphql } from "gatsby";
import * as React from "react";
import Helmet from "react-helmet";
import Footer from "../components/footer";
import Layout from "../components/layout";
import TagsList from "../components/tagsList";

import ReactDisqusComments from "react-disqus-comments";

import translations from "../utils/translations";

const css = require("./post.module.css");
require(`katex/dist/katex.min.css`);

export interface PostData {
  html: string;
  frontmatter: {
    id: string;
    lang: string;
    title: string;
    create: string;
    lastModify: string;
    categories: string[];
  };
  fields: {
    readingTime: {
      text: string;
    };
  };
}

interface PostProps {
  data: {
    markdownRemark: PostData;
  };
}

class PostTemplate extends React.Component<PostProps> {
  public handleNewComment() {
    /* noop now */
  }

  public render() {
    const post = this.props.data.markdownRemark;
    const lang = post.frontmatter.lang;
    const path = "/" + post.frontmatter.id + "/" + lang;
    const url = "http://lesleylai.info" + path;
    const title = translations["title"][lang] + " | " + post.frontmatter.title;
    return (
      <Layout location={{ pathname: path }} lang={lang}>
        <div className={css.post}>
          <Helmet>
            <title>{title}</title>
          </Helmet>
          <h1 className={css.title}>{post.frontmatter.title}</h1>
          <div className={css.info}>
            <span className={css.date}>
              {translations["lastModify"][lang]}: {post.frontmatter.lastModify}{" "}
              | {translations["create"][lang]}: {post.frontmatter.create} |{" "}
              {post.fields.readingTime.text}
            </span>
            <TagsList tags={post.frontmatter.categories} className={css.tags} />
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
  query BlogPostQuery($relativePath: String!) {
    markdownRemark(fields: { relativePath: { eq: $relativePath } }) {
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
  }
`;
