import React from 'react';
import Link from 'gatsby-link';

import Posts from "../components/posts-list.jsx";

export const query = graphql`
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
          create(formatString: "DD MMMM, YYYY")
          categories
        }
        excerpt
        html
      }
    }
  }
}
`


const Archive = ({ data })=> (
    <div>
    <h1>Blog archive</h1>
    {data.allMarkdownRemark.totalCount} Posts
    <Posts posts={data.allMarkdownRemark.edges} />
    </div>
);


export default Archive;

