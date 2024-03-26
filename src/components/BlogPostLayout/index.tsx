import * as React from "react";
import { MDXProvider } from "@mdx-js/react";

import { Language, TranslationKey, translations } from "../../utils/translation";
import {
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
import { BlogPageLayout } from "../BlogPageLayout";

type Frontmatter = {
  readonly title: string;
  readonly created: string;
  readonly modified: string;
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

type PostDataProps = {
  lang: Language;
  created: string;
  modified: string;
};
const PostDate = ({ lang, created, modified }: PostDataProps) => {
  const createDate = new Date(created);
  const modifiedDate = new Date(modified);
  const modifiedAfterCreation = createDate.getTime() < modifiedDate.getTime();

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formatDate = (date: Date) => date.toLocaleDateString(lang, options);

  return (
    <span className={postDate}>
      {modifiedAfterCreation && `${translations[lang].lastModified}${formatDate(modifiedDate)} | `}
      {`${translations[lang].createTime}${formatDate(createDate)}`}
    </span>
  );
};

export default function BlogPostLayout({
  mdx,
  lang,
  notTranslated,
  children,
}: BlogPostLayoutProps) {
  const { title, created, modified, tags } = mdx.frontmatter;

  return (
    <BlogPageLayout lang={lang}>
      <h1 className={postTitle}>
        {title} <span>{notTranslated && translations[lang].untranslated}</span>
      </h1>
      <div className={postInfo}>
        <PostDate lang={lang} created={created} modified={modified} />
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
    </BlogPageLayout>
  );
}
