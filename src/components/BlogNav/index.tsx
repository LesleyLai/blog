import * as React from "react";
import { archive, blogNav, heading, link, postCount, ul } from "./BlogNav.css";

import { useStaticQuery, graphql, Link } from "gatsby";

import { Language, TranslationKey, translations } from "../../utils/translation";

type BlogNavProps = {
  readonly lang: Language;
};

export default function BlogNav({ lang }: BlogNavProps) {
  const data: Queries.BlogNavQuery = useStaticQuery(graphql`
    query BlogNav {
      allMdx(
        filter: {
          internal: { contentFilePath: { regex: "//contents/blog//" } }
          frontmatter: { lang: { eq: "en" } }
        }
      ) {
        tags: group(field: { frontmatter: { tags: SELECT } }) {
          id: fieldValue
          totalCount
        }
        totalCount
      }
    }
  `);

  const tags = data.allMdx.tags.toSorted((lhs, rhs) => rhs.totalCount - lhs.totalCount);

  return (
    <nav className={blogNav}>
      <h3 className={heading}>{translations[lang].tags}</h3>
      <ul className={ul}>
        {tags.map((tag) => (
          <li key={tag.id}>
            <Link to={`/${lang}/archive/${tag.id}`} className={link}>
              {translations[lang][tag.id as TranslationKey] as string}
            </Link>
            <span className={postCount}>{tag.totalCount}</span>
          </li>
        ))}
      </ul>
      <p className={archive}>
        {translations[lang].all}{" "}
        <Link to={`/${lang}/blog/archive`} className={link}>
          {data.allMdx.totalCount}
        </Link>{" "}
        {translations[lang].posts}
      </p>
      <p>© 2015-{new Date().getFullYear()} Lesley Lai</p>
    </nav>
  );
}
