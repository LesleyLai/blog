/*eslint sort-keys: "warn"*/
/*eslint "@typescript-eslint/camelcase": "off"*/

import { TagID } from "./tagInfo";

const en = {
  books: "Books",
  c: "C",
  cmake: "CMake",
  code: "Coding",
  cpp: "C++",
  create: "Create",
  dod: "Data-oriented design",
  elm: "Elm",
  event: "Event",
  functional: "Functional Programming",
  game: "Game",
  graphics: "Computer Graphics",
  graphql: "GraphQL",
  lang: "English",
  lastModify: "Last Modify",
  library: "Library",
  math: "Mathematics",
  opengl: "OpenGL",
  pl: "Programming Languages",
  python: "Python",
  rant: "Rant",
  react: "React",
  rt: "Ray tracing",
  showall: "Show all",
  stuff_I_wrote_about: (tag: TagID) => `Stuff I Wrote About ${en[tag]}`,
  test: "Testing",
  title: "Lesley Lai",
  typescript: "Typescript",
  web: "Web",
  x86: "x86"
};

export type Translations = typeof en;

const zh: Translations = {
  books: "书籍",
  c: en.c,
  cmake: en.cmake,
  code: "编程",
  cpp: en.cpp,
  create: "创建时间",
  dod: "面向数据设计",
  elm: en.elm,
  event: "活动",
  functional: "函数式编程",
  game: "游戏",
  graphics: "图形学",
  graphql: en.graphql,
  lang: "中文",
  lastModify: "最近修改时间",
  library: "软件库",
  math: "数学",
  opengl: en.opengl,
  pl: "编程语言",
  python: en.python,
  rant: "抱怨",
  react: en.react,
  rt: "光线追踪",
  showall: "显示所有",
  stuff_I_wrote_about: (tag: TagID) => `关于${zh[tag]}的博文`,
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

export const languages = Object.keys(translations);

export type Language = keyof typeof translations;
