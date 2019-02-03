import { graphql } from "gatsby";
import Link from "gatsby-link";
import * as React from "react";
import Helmet from "react-helmet";
import Layout from "../components/layout";
import TagsList from "../components/tagsList";

import ReactDisqusComments from "react-disqus-comments";

const css = require("./post.module.css");

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
    const path = "/" + post.frontmatter.id + "/" + post.frontmatter.lang + "/";
    const url = "http://lesleylai.info" + path;
    const title = "Lesley Lai | " + post.frontmatter.title;
    return (
      <Layout location={{ pathname: path }}>
        <div className={css.post}>
          <Helmet>
            <title>{title}</title>
          </Helmet>
          <h1 className={css.title}>{post.frontmatter.title}</h1>
          <div className={css.info}>
            <span className={css.date}>
              Last Modify: {post.frontmatter.lastModify} | Create:{" "}
              {post.frontmatter.create}
            </span>
            <TagsList tags={post.frontmatter.categories} className={css.tags} />
          </div>

          <article
            className={css.article}
            dangerouslySetInnerHTML={{ __html: post.html }}
          />
          <ReactDisqusComments
            className={css.comment}
            shortname="lesleylaiblog"
            identifier={post.frontmatter.id}
            title={post.frontmatter.title}
            url={url}
            onNewComment={this.handleNewComment}
          />
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
    }
  }
`;
