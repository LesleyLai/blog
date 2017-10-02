import * as React from "react";
import TagsList from "../components/tags-list";

export default ({ data }) => {
    const post = data.markdownRemark;
    return (<div>
        <h1>{post.frontmatter.title}</h1>
        <TagsList tags={post.frontmatter.categories} />
        <div>Create: {post.frontmatter.create} &#8226; Last Modify: {post.frontmatter.lastModify}</div>
        <div dangerouslySetInnerHTML={{ __html: post.html }} />
    </div>);
};

export const query = graphql`
    query BlogPostQuery($relativePath: String!) {
        markdownRemark(fields: { relativePath: { eq: $relativePath } }) {
            html
            frontmatter {
                title
                create(formatString: "DD MMMM, YYYY")
                lastModify(formatString: "DD MMMM, YYYY")
                categories
            }
        }
    }
`;
