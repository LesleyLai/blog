import * as React from "react";
import { HeadFC, Link, PageProps, graphql } from "gatsby";
import Layout from "../../components/Layout";
import { BlogPageLayout } from "../../components/BlogPageLayout";

import { Language, translations } from "../../utils/translation";
import groupBy from "lodash.groupby";
import { PageTitle } from "../../components/PageTitle";

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

  const posts = data.allMdx.posts;
  const singleLanguagePosts = posts.map((post) => {
    const thisLangPost = post.edges.find((post) => post.node.frontmatter!.lang == lang);
    const isUntranslated = thisLangPost == null;
    const singleLangPost =
      thisLangPost ?? post.edges.find((post) => post.node.frontmatter!.lang == "en")!;

    return {
      id: post.id!,
      create: singleLangPost.node.frontmatter!.create!,
      title: singleLangPost.node.frontmatter!.title!,
      isUntranslated,
    };
  });

  // sort by descending order of time
  singleLanguagePosts.sort((p1, p2) => Date.parse(p2.create) - Date.parse(p1.create));
  // group posts by years
  const postsByYear = groupBy(singleLanguagePosts, (post) => new Date(post.create).getFullYear());

  const years = Object.keys(postsByYear).sort().reverse();

  return (
    <Layout lang={pageContext.lang} path={path}>
      <BlogPageLayout lang={lang}>
        <h1>Blog Archive</h1>

        {years.map((year) => (
          <article key={year}>
            <h2>{year}</h2>
            <ul>
              {postsByYear[year].map(({ id, create, title, isUntranslated }) => {
                const createFormated = new Intl.DateTimeFormat(lang, {
                  month: "long",
                  day: "numeric",
                  timeZone: "UTC",
                }).format(new Date(create));

                return (
                  <li key={id}>
                    <Link to={`/${lang}/${id}`}>
                      {title}
                      {isUntranslated ? translations[lang].untranslated : undefined}
                    </Link>{" "}
                    — {createFormated}
                  </li>
                );
              })}
            </ul>
          </article>
        ))}
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
              create
              title
              lang
            }
          }
        }
      }
    }
  }
`;
