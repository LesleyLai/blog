import * as React from "react";

import { Language } from "../../utils/translation";
import BlogNav from "../BlogNav";

import { blogContainer, main } from "./BlogPageLayout.css";

type BlogPageLayoutProps = {
  readonly lang: Language;
  readonly children?: React.ReactNode;
};

/*
 * Layout for all blog pages including blog posts but also the archive and tag pages
 */
export const BlogPageLayout = ({ lang, children }: BlogPageLayoutProps) => (
  <div className={blogContainer}>
    <main className={main}>{children}</main>
    <BlogNav lang={lang} />
  </div>
);
