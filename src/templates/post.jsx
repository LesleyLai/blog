// This file can't use typescript syntax because some problems in gatsby-plugin-mdx
// See https://www.gatsbyjs.com/docs/how-to/routing/mdx/#make-a-layout-template-for-your-posts

import * as React from "react";
import { graphql } from "gatsby";
import Layout from "../components/Layout";
import { translations } from "../utils/translation";
//import { MDXProvider } from "@mdx-js/react";

const PostTemplate = ({ data, path, pageContext, children }) => {
  const mdx = data.mdx;
  console.log(mdx.frontmatter);

  const notTranslated = pageContext.bodyLang != pageContext.lang;

  return (
    <Layout lang={pageContext.lang} path={path}>
      <main style={{ maxWidth: "1200px", margin: "auto" }}>
        <h1>
          {mdx.frontmatter.title}{" "}
          <span>{notTranslated && translations[pageContext.lang].untranslated}</span>
        </h1>
        {children}
      </main>
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
        categories
      }
    }
  }
`;
