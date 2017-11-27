import * as React from "react";

import Course from "../components/course/course";

const MoocPage = ({ data }) => {
    const edges = data.allMarkdownRemark.edges;

    return (
        <article style={{ maxWidth: "800px" }}>
            <h1>Online courses I learned</h1>
            {edges.map(edge =>
                <Course courseInfo={edge.node} />
            )}

        </article>
    );
}

export const moocQuery = graphql`
    query MoocsQuery {
        allMarkdownRemark(sort: {fields: [frontmatter___complete], order: DESC},
            filter: {frontmatter: {type: {eq: "mooc"}}}) {
                edges {
                    node {
                        frontmatter {
                            title
                            complete(formatString: "MMMM d, YYYY")
                            platform
                            institution
                            certification
                            link
                            categories
                            rating
                        }
                        html
                    }
                }
            }
    }
`

export default MoocPage;
