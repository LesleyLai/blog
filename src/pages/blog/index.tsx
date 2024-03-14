import * as React from "react";
import { HeadFC, Link, PageProps } from "gatsby";
import Layout from "../../components/Layout";
import { BlogPageLayout } from "../../components/BlogPageLayout";

import { Language, translations } from "../../utils/translation";
import { PageTitle } from "../../components/PageTitle";

type PageContext = {
  dateLocale: string;
  lang: Language;
};

const BlogPage: React.FC<PageProps<object, PageContext>> = ({ path, pageContext: { lang } }) => (
  <Layout lang={lang} path={path}>
    <BlogPageLayout lang={lang}>
      <h1>{translations[lang].blog}</h1>

      <p>
        See <Link to={`/${lang}/blog/archive`}>archive</Link> for all posts
      </p>
    </BlogPageLayout>
  </Layout>
);

export default BlogPage;

export const Head: HeadFC<object, PageContext> = ({ pageContext: { lang } }) => (
  <PageTitle title={translations[lang].blog} lang={lang} />
);
