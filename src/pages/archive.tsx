import * as React from "react";
import Link from 'gatsby-link';

import Posts from "../components/posts-list";

interface ArchiveProps {
}

const Archive = ({ data }) => (
    <div>
        <h1>Blog archive</h1>
        {data.allMarkdownRemark.totalCount} Posts
        <Posts posts={data.allMarkdownRemark.edges} />
    </div>
);


export const archiveQuery = graphql`
    query ArchiveQuery {
        allMarkdownRemark(sort: {fields: [frontmatter___create], order: DESC},
            filter: {
	        frontmatter: {
                    lang: {eq: "en"}
                }
            }) {
                totalCount
                edges {
                    node {
                        frontmatter {
                            title
                            create(formatString: "DD MMMM YYYY")
                            categories
                        }
                        excerpt
                    }
                }
            }
    }
`;

export default Archive;
