import * as React from "react";
import { HeadFC, Link, PageProps, graphql } from "gatsby";
import Layout from "../../components/Layout";
import { Language, translations } from "../../utils/translation";
import groupBy from "lodash.groupby";

type PageContext = {
  dateLocale: string;
  lang: Language;
};

const BlogPage: React.FC<PageProps<Queries.BlogIndexQuery, PageContext>> = ({
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

  const postsByYear = groupBy(singleLanguagePosts, (post) => new Date(post.create).getFullYear());
  const years = Object.keys(postsByYear).sort().reverse();

  return (
    <Layout lang={pageContext.lang} path={path}>
      <main>
        <h1>Blog</h1>

        <p>
          I have written {data.allMdx.posts.length} blog posts since 2016. They are organized by
          their publish dates and can also be filtered by tags.
        </p>

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
      </main>
    </Layout>
  );
};

export default BlogPage;

export const Head: HeadFC<object, PageContext> = ({ pageContext }) => (
  <title>
    {translations[pageContext.lang].blog} | {translations[pageContext.lang].myname}
  </title>
);

export const query = graphql`
  query BlogIndex {
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
      totalCount
    }
  }
`;
