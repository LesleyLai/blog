import * as React from "react";

import { Language, translations } from "../../utils/translation";
import { postMain, postInfo, postTitle, tagList, tagListItem, tagBox } from "./BlogPostLayout.css";

type Frontmatter = {
  readonly title: string;
  readonly create: string;
  readonly lastModify: string;
  readonly tags: readonly string[] | null;
};

type Mdx = {
  readonly frontmatter: Frontmatter;
};

type BlogPostLayoutProps = {
  readonly mdx: Mdx;
  readonly lang: Language;
  readonly notTranslated: boolean;
  readonly children?: React.ReactNode;
};

export default function BlogPostLayout({
  mdx,
  lang,
  notTranslated,
  children,
}: BlogPostLayoutProps) {
  const { title, create, lastModify, tags } = mdx.frontmatter;

  return (
    <div style={{ maxWidth: "1200px", margin: "auto" }}>
      <main className={postMain}>
        <h1 className={postTitle}>
          {title} <span>{notTranslated && translations[lang].untranslated}</span>
        </h1>
        <div className={postInfo}>
          <span>
            last modify: {lastModify} | create: {create}
          </span>
          <ul className={tagList}>
            {" "}
            {tags?.map((tag) => (
              <li className={tagListItem} key={tag}>
                <span className={tagBox}>{tag}</span>
              </li>
            ))}
          </ul>
        </div>
        {children}
      </main>
    </div>
  );
}
