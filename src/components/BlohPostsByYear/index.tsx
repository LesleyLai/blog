import * as React from "react";
import { Link } from "gatsby";
import groupBy from "lodash.groupby";

import { Language, translations } from "../../utils/translation";

type PostQuery = {
  readonly id: string | null;
  readonly edges: readonly {
    readonly node: {
      readonly frontmatter: {
        readonly created: string | null;
        readonly title: string | null;
        readonly lang: string | null;
      } | null;
    };
  }[];
};

type BlogPostsByYearsProps = {
  lang: Language;
  posts: readonly PostQuery[];
};

export const BlogPostsByYears = ({ posts, lang }: BlogPostsByYearsProps) => {
  const singleLanguagePosts = posts.map((post) => {
    const thisLangPost = post.edges.find((post) => post.node.frontmatter!.lang == lang);
    const isUntranslated = thisLangPost == null;
    const singleLangPost =
      thisLangPost ?? post.edges.find((post) => post.node.frontmatter!.lang == "en")!;

    return {
      id: post.id!,
      created: singleLangPost.node.frontmatter!.created!,
      title: singleLangPost.node.frontmatter!.title!,
      isUntranslated,
    };
  });

  // sort by descending order of time
  singleLanguagePosts.sort((p1, p2) => Date.parse(p2.created) - Date.parse(p1.created));
  // group posts by years
  const postsByYear = groupBy(singleLanguagePosts, (post) => new Date(post.created).getFullYear());

  const years = Object.keys(postsByYear).sort().reverse();

  return (
    <>
      {years.map((year) => (
        <article key={year}>
          <h2>{year}</h2>
          <ul>
            {postsByYear[year].map(({ id, created, title, isUntranslated }) => {
              const createFormated = new Intl.DateTimeFormat(lang, {
                month: "long",
                day: "numeric",
                timeZone: "UTC",
              }).format(new Date(created));

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
    </>
  );
};
