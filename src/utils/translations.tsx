/*eslint sort-keys: "warn"*/
/*eslint "@typescript-eslint/camelcase": "off"*/

import { Link } from "gatsby";
import { TagID } from "../types/tags";
import * as React from "react";

const en = {
  about_content: (
    <>
      <article>
        <p>
          Hi, I am <strong>Lesley Lai</strong>, a Software Engineering Intern at{" "}
          <a href="https://www.sketchup.com/">Trimble SketchUp</a> and a
          Computer Science and Applied Mathematics undergraduate student at the{" "}
          <a href="http://www.colorado.edu/">
            {" "}
            University of Colorado at Boulder
          </a>
          .
        </p>
        <p>
          My primary interests include{" "}
          <a href="https://en.wikipedia.org/wiki/Computer_graphics">
            Computer Graphics
          </a>
          {" and "}
          <a href="https://en.wikipedia.org/wiki/Programming_language_theory">
            Programming Language theories
          </a>
          . I love to code in various programming languages, though I am
          particularly fond of <a href="https://isocpp.org/">C++</a>.
        </p>
      </article>
    </>
  ),
  all_n_posts: (n: number) => (
    <>
      All <Link to={`/en/archive`}>{n} posts</Link>
    </>
  ),
  archive: "Archive",
  archive_title: "Blog archive",
  books: "Books",
  build_using_gatsby: (
    <>
      This blog is built using <a href="https://www.gatsbyjs.org/">Gatsby</a>.
      The source is on the{" "}
      <a href="https://github.com/LesleyLai/blog">Github repo</a>.
    </>
  ),
  c: "C",
  cmake: "CMake",
  code: "Coding",
  code_at_github: (
    <>
      Code at <a href="https://github.com/LesleyLai">Github</a>
    </>
  ),
  cpp: "C++",
  create: "Create",
  csharp: "C#",
  dod: "Data-oriented design",
  elm: "Elm",
  elsewhere: "Elsewhere",
  event: "Event",
  functional: "Functional Programming",
  game: "Game",
  graphics: "Computer Graphics",
  graphql: "GraphQL",
  home: "Home",
  i18n: "i18n",
  java: "Java",
  lang: "English",
  lastModify: "Last Modify",
  library: "Library",
  linkedin: (
    <>
      Profile on <a href="https://www.linkedin.com/in/lesley-lai/">LinkedIn</a>
    </>
  ),
  math: "Mathematics",
  myname: "Lesley Lai",
  n_posts: (n: number) => `${n} Posts`,
  opengl: "OpenGL",
  opinion: "Opinion",
  pl: "Programming Languages",
  projects: "Projects",
  python: "Python",
  react: "React",
  recent_posts: "Recent Posts",
  rt: "Ray tracing",
  showall: "Show all",
  stuff_I_wrote_about: (tag: TagID) => `Stuff I Wrote About ${en[tag]}`,
  tags: "Tags",
  talks: "Talks",
  test: "Testing",
  title: "Lesley Lai",
  typescript: "Typescript",
  web: "Web",
  x86: "x86"
};

export type Translations = typeof en;

const zh: Translations = {
  about_content: (
    <>
      <article>
        <p>
          大家好，我叫赖思理，是
          <a href="https://www.sketchup.com/zh-CN">SketchUp</a>的实习生以及
          <a href="http://www.colorado.edu/">科罗拉多大学</a>
          计算机科学以及应用数学的本科生。
        </p>
      </article>
    </>
  ),
  all_n_posts: (n: number) => (
    <>
      所有<Link to={`zh/archive`}>{n}篇博文</Link>
    </>
  ),
  archive: "博文目录",
  archive_title: "博文目录",
  books: "书籍",
  build_using_gatsby: (
    <>
      这个博客使用<a href="https://www.gatsbyjs.org/">Gatsby</a>
      来搭建，它的源码在<a href="https://github.com/LesleyLai/blog">Github</a>
      上。
    </>
  ),
  c: en.c,
  cmake: en.cmake,
  code: "编程",
  code_at_github: (
    <>
      <a href="https://github.com/LesleyLai">Github</a>
    </>
  ),
  cpp: en.cpp,
  create: "创建时间",
  csharp: en.csharp,
  dod: "面向数据设计",
  elm: en.elm,
  elsewhere: "链接",
  event: "活动",
  functional: "函数式编程",
  game: "游戏",
  graphics: "图形学",
  graphql: en.graphql,
  home: "主页",
  i18n: "国际化",
  java: en.java,
  lang: "中文",
  lastModify: "最近修改时间",
  library: "软件库",
  linkedin: (
    <>
      <a href="https://www.linkedin.com/in/lesley-lai/?locale=zh_CN">领英</a>
    </>
  ),
  math: "数学",
  myname: "赖思理",
  n_posts: (n: number) => `${n}篇博文`,
  opengl: en.opengl,
  opinion: "观点",
  pl: "编程语言",
  projects: "个儿项目",
  python: en.python,
  react: en.react,
  recent_posts: "最新内容",
  rt: "光线追踪",
  showall: "显示所有",
  stuff_I_wrote_about: (tag: TagID) => `关于${zh[tag]}的博文`,
  tags: "标签",
  talks: "演讲",
  test: "软件测试",
  title: "赖思理的博客",
  typescript: en.typescript,
  web: en.web,
  x86: en.x86
};

export const translations = {
  en: en,
  zh: zh
};

export type Language = keyof typeof translations;

export const languages = Object.keys(translations) as Language[];
