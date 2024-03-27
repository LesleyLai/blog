import * as React from "react";
import { HeadFC, PageProps, graphql } from "gatsby";
import Layout from "../../components/Layout";
import { BlogPageLayout } from "../../components/BlogPageLayout";

import { Language, translations } from "../../utils/translation";
import { PageTitle } from "../../components/PageTitle";
import { BlogPostsByYears } from "../../components/BlohPostsByYear";

type PageContext = {
  dateLocale: string;
  lang: Language;
};

const BlogArchivePage: React.FC<PageProps<Queries.BlogArchiveQuery, PageContext>> = ({
  path,
  pageContext,
  data,
}) => {
  const lang = pageContext.lang;

  return (
    <Layout lang={pageContext.lang} path={path}>
      <BlogPageLayout lang={lang}>
        <h1>Blog Archive</h1>

        <BlogPostsByYears posts={data.allMdx.posts} lang={lang} />
      </BlogPageLayout>
    </Layout>
  );
};

export default BlogArchivePage;

export const Head: HeadFC<object, PageContext> = ({ pageContext: { lang } }) => (
  <PageTitle title={translations[lang].archive} lang={lang} />
);

export const query = graphql`
  query BlogArchive {
    allMdx(filter: { internal: { contentFilePath: { regex: "//contents/blog//" } } }) {
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
