// This file can't use typescript syntax because some problems in gatsby-plugin-mdx
// See https://www.gatsbyjs.com/docs/how-to/routing/mdx/#make-a-layout-template-for-your-posts

import * as React from "react";
import { graphql } from "gatsby";
import Layout from "../components/Layout";
import BlogPostLayout from "../components/BlogPostLayout";

const PostTemplate = ({ data, path, pageContext, children }) => {
  const notTranslated = pageContext.bodyLang != pageContext.lang;

  return (
    <Layout lang={pageContext.lang} path={path}>
      <BlogPostLayout notTranslated={notTranslated} mdx={data.mdx} lang={pageContext.lang}>
        {children}
      </BlogPostLayout>
    </Layout>
  );
};

export default PostTemplate;

export const pageQuery = graphql`
  query DocsTemplate($id: String!, $bodyLang: String!) {
    mdx(frontmatter: { id: { eq: $id }, lang: { eq: $bodyLang } }) {
      frontmatter {
        title
        create
        lastModify
        tags: categories
      }
    }
  }
`;
