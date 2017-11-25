import * as React from "react";

interface CourseProp {
    courseInfo: {
        frontmatter: {
            title: string;
            complete: string;
            platform: string;
            institution: string;
            certification: string;
            link: string;
            categories: string;
            rating: number;
        };
        html: string;
    }
}

const Course = ({ courseInfo }: CourseProp) => {
    const frontmatter = courseInfo.frontmatter;
    const description = { __html: courseInfo.html };
    return (
        <div style={{ maxWidth: "700px", margin: "auto" }}>
            <h3>{frontmatter.platform} • {frontmatter.title}</h3>

            <article dangerouslySetInnerHTML={description} />

        </div>
    );
}

const MoocPage = ({ data }) => {
    const edges = data.allMarkdownRemark.edges;

    return (
        <article>
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
