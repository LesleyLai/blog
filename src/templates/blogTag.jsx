// This file can't use typescript syntax because some problems in gatsby-plugin-mdx
// See https://www.gatsbyjs.com/docs/how-to/routing/mdx/#make-a-layout-template-for-your-posts

import * as React from "react";
import { graphql } from "gatsby";
import Layout from "../components/Layout";
import { BlogPageLayout } from "../components/BlogPageLayout";
import { BlogPostsByYears } from "../components/BlohPostsByYear";
import { translations } from "../utils/translation";

import { PageTitle } from "../components/PageTitle";

const TagsArchiveTemplate = ({ path, pageContext, data }) => {
  let { lang, tag } = pageContext;

  return (
    <Layout lang={lang} path={path}>
      <BlogPageLayout lang={lang}>
        <h1>Stuff I Wrote About {translations[lang][tag]}</h1>
        <BlogPostsByYears posts={data.allMdx.posts} lang={lang} />
      </BlogPageLayout>
    </Layout>
  );
};

export default TagsArchiveTemplate;

export const pageQuery = graphql`
  query TagsArchiveTemplate($tag: String!) {
    allMdx(
      filter: {
        internal: { contentFilePath: { regex: "//contents/blog//" } }
        frontmatter: { tags: { in: [$tag] } }
      }
    ) {
      posts: group(field: { frontmatter: { id: SELECT } }) {
        id: fieldValue
        edges {
          node {
            frontmatter {
              created
              title
              lang
            }
          }
        }
      }
    }
  }
`;

export const Head = ({ pageContext: { lang, tag } }) => (
  <PageTitle title={`Stuff I Wrote About ${translations[lang][tag]}`} lang={lang} />
);
