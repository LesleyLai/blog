import * as React from "react";
import TagsList from "../components/tags-list";
var ReactDisqusThread = require('react-disqus-thread');

export default ({ data }) => {
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
        <ReactDisqusThread
            shortname="lesleylaiblog"
            identifier={post.frontmatter.id}
            title={post.frontmatter.title}
            url={url}
            onNewComment={this.handleNewComment} />
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
