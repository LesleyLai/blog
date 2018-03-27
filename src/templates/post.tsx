import * as React from "react";
import TagsList from "../components/tagsList";
// import ReactDisqusComments from "react-disqus-comments";

export interface PostData {
  html: string;
  frontmatter: {
    id: string,
    lang: string,
    title: string,
    create: string,
    lastModify: string,
    categories: string[],
  }
}

interface PostProps {
  data: {
    markdownRemark: PostData;
  }
}

export default ({ data }: PostProps) => {
  const post = data.markdownRemark;
  const path = '/' + post.frontmatter.id + '/' + post.frontmatter.lang + '/';
  const url = "http://lesleylai.info" + path;
  return (<div>
    <h1>{post.frontmatter.title}</h1>
    <TagsList tags={post.frontmatter.categories} />
    <ul>
      <li>Create: {post.frontmatter.create}</li>
      <li>Last Modify: {post.frontmatter.lastModify}</li>
    </ul>
    <div dangerouslySetInnerHTML={{ __html: post.html }} />
    {/*<ReactDisqusComments
        shortname="lesleylaiblog"
        identifier={post.frontmatter.id}
        title={post.frontmatter.title}
        url={url}
        onNewComment={this.handleNewComment} />*/}
  </div>);
};

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
