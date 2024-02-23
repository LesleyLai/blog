import * as React from "react";

import { Language, TranslationKey, translations } from "../../utils/translation";
import {
  blogContainer,
  postMain,
  postInfo,
  postTitle,
  tagList,
  tagListItem,
  tagBox,
} from "./BlogPostLayout.css";
import BlogNav from "../BlogNav";

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
    <div className={blogContainer}>
      <main className={postMain}>
        <h1 className={postTitle}>
          {title} <span>{notTranslated && translations[lang].untranslated}</span>
        </h1>
        <div className={postInfo}>
          <span>
            {translations[lang].lastModify} {lastModify} | {translations[lang].createTime}: {create}
          </span>
          <ul className={tagList}>
            {" "}
            {tags?.map((tag) => (
              <li className={tagListItem} key={tag}>
                <span className={tagBox}>{translations[lang][tag as TranslationKey]}</span>
              </li>
            ))}
          </ul>
        </div>
        {children}
      </main>
      <BlogNav lang={lang} />
    </div>
  );
}
