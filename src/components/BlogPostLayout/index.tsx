import * as React from "react";
import { MDXProvider } from "@mdx-js/react";

import { Language, TranslationKey, translations } from "../../utils/translation";
import {
  blogContainer,
  postMain,
  postInfo,
  postTitle,
  postDate,
  tagList,
  tagListItem,
  tagBox,
  blogPostH2,
  blogPostH3,
  blogPostH4,
  blogPostParagraph,
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

const components = {
  h2: (props: object) => <h2 className={blogPostH2} {...props} />,
  h3: (props: object) => <h3 className={blogPostH3} {...props} />,
  h4: (props: object) => <h4 className={blogPostH4} {...props} />,
  p: (props: object) => <p className={blogPostParagraph} {...props} />,
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
          <span className={postDate}>
            {translations[lang].lastModify}
            {lastModify} | {translations[lang].createTime}
            {create}
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
        <MDXProvider components={components}>{children}</MDXProvider>
      </main>
      <BlogNav lang={lang} />
    </div>
  );
}
