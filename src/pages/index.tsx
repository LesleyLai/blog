import * as React from "react";
import Link from 'gatsby-link';

import PostTemplate from '../templates/post';

const IndexPage = ({ data }) => (
  <article>
    <PostTemplate data={
      { markdownRemark: data.allMarkdownRemark.edges[0].node }
    } />
  </article>
);

export const indexQuery = graphql`
  query IndexQuery {
    allMarkdownRemark(sort: {fields: [frontmatter___create], order: DESC},
      filter: {frontmatter: {lang: {eq: "en"}}}) {
        totalCount
        edges {
          node {
            html
            frontmatter {
              id
              lang
              title
              create(formatString: "DD MMMM YYYY")
              lastModify(formatString: "DD MMMM YYYY")
              categories
            }
          }
        }
      }
  }
`;

export default IndexPage;
