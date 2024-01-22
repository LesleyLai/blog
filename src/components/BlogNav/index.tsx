import * as React from "react";
import { blogNav, heading, link, postCount, ul } from "./BlogNav.css";

import { useStaticQuery, graphql } from "gatsby";

import { Language, translations } from "../../utils/translation";

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
        tags: group(field: { frontmatter: { categories: SELECT } }) {
          id: fieldValue
          totalCount
        }
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
            <a href="#" className={link}>
              {tag.id}
            </a>{" "}
            <span className={postCount}>{tag.totalCount}</span>
          </li>
        ))}
      </ul>
    </nav>
  );
}
