import type { Language } from "./i18n";

const en = {
  about: "About",
  ai: "AI",
  algorithms: "Algorithms",
  all: "All",
  archive: "Blog Archive",
  blog: "Blog",
  books: "Book Review",
  c: "C",
  cmake: "CMake",
  code: "Coding",
  compiler: "Compiler",
  cpp: "C++",
  createTime: "Create: ",
  csharp: "C#",
  cuda: "CUDA",
  designpattern: "Design Patterns",
  dod: "Data-Oriented Design",
  elm: "Elm",
  event: "Event",
  functional: "Functional Programming",
  game: "Game",
  graphics: "Graphics",
  graphql: "GraphQL",
  home: "Home",
  i18n: "Internationalization",
  java: "Java",
  javascript: "Javascript",
  langName: "English",
  lastModified: "Last Modify: ",
  latestPosts: "Latest Posts",
  learning: "Learning",
  library: "Library",
  logic: "Logic",
  math: "Mathematics",
  myname: "Lesley Lai",
  notFound: "404 Not Found",
  notes: "Notes",
  ocaml: "OCaml",
  oop: "OOP",
  opengl: "OpenGL",
  opinion: "Opinion",
  oppositeLang: "zh" as Language,
  personal: "Personal",
  physics: "Physics",
  pl: "Programming Languages",
  portfolio: "Portfolio",
  posts: "posts",
  python: "Python",
  racket: "Racket",
  rasterizer: "Rasterization",
  react: "React",
  rust: "Rust",
  scheme: "Scheme",
  tags: "Tags",
  talks: "Talks",
  test: "Testing",
  typescript: "Typescript",
  untranslated: "(untranslated)",
  vulkan: "Vulkan",
  web: "Web",
  webgpu: "WebGPU",
  website: "Website",
  wgpu: "wgpu",
  x86: "x86",
};

export type Translations = typeof en;

export type TranslationKey = keyof Translations;

const zh: Translations = {
  about: "关于",
  ai: en.ai,
  algorithms: "算法",
  all: "所有",
  archive: "博文存档",
  blog: "博客",
  books: "书评",
  c: en.c,
  cmake: en.cmake,
  code: "编程",
  compiler: "编译器",
  cpp: en.cpp,
  createTime: "创建时间：",
  csharp: en.csharp,
  cuda: en.cuda,
  designpattern: "设计模式",
  dod: "面向数据设计",
  elm: en.elm,
  event: "活动",
  functional: "函数式编程",
  game: "游戏",
  graphics: "图形学",
  graphql: en.graphql,
  home: "主页",
  i18n: "国际化",
  java: en.java,
  javascript: en.javascript,
  langName: "中文",
  lastModified: "最近修改时间：",
  latestPosts: "最新文章",
  learning: "学习",
  library: "软件库",
  logic: "逻辑学",
  math: "数学",
  myname: "赖思理",
  notFound: "找不到页面",
  notes: "笔记",
  ocaml: en.ocaml,
  oop: "面向对象编程",
  opengl: en.opengl,
  opinion: "观点",
  oppositeLang: "en" as Language,
  personal: "个人相关",
  physics: "物理",
  pl: "编程语言",
  portfolio: "个人项目",
  posts: "篇博文",
  python: en.python,
  racket: en.racket,
  rasterizer: "光栅化",
  react: en.react,
  rust: en.rust,
  scheme: en.scheme,
  tags: "标签",
  talks: "演讲",
  test: "软件测试",
  typescript: en.typescript,
  untranslated: "（未翻译）",
  vulkan: en.vulkan,
  web: en.web,
  webgpu: en.webgpu,
  website: "网站",
  wgpu: en.web,
  x86: en.x86,
};

export const translations: Record<Language, typeof en> = {
  en: en,
  zh: zh,
};