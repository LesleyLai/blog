import type { Language } from "./i18n";
import { ALL_BLOG_POST_TAGS } from "@content/blog";
import { ALL_PROJECT_TAGS } from "@content/projects";

interface TagTranslation {
  shortName: string;
  longName?: string;
}

interface TagTranslations {
  [tagId: string]: TagTranslation;
}

// Enforcing that all tag translation entries has the TagTranslation interface
const createTagTranslations = <M extends TagTranslations>(map: M) => map;

const enTagTranslations = createTagTranslations({
  ai: { shortName: "AI" },
  algorithms: { shortName: "Algorithms" },
  books: { shortName: "Books", longName: "Book Review" },
  c: { shortName: "C", longName: "C Programming Language" },
  cmake: { shortName: "CMake" },
  code: { shortName: "Coding" },
  compiler: { shortName: "Compiler" },
  cpp: { shortName: "C++" },
  csharp: { shortName: "C#" },
  cuda: { shortName: "CUDA" },
  designpattern: { shortName: "Design Patterns" },
  dod: { shortName: "DOD", longName: "Data-Oriented Design" },
  elm: { shortName: "Elm" },
  event: { shortName: "Event" },
  functional: { shortName: "FP", longName: "Functional Programming" },
  game: { shortName: "Game" },
  git: { shortName: "Git" },
  graphics: { shortName: "Graphics", longName: "Computer Graphics" },
  graphql: { shortName: "GraphQL" },
  i18n: { shortName: "i18n", longName: "Internationalization" },
  java: { shortName: "Java" },
  javascript: { shortName: "Javascript" },
  learning: { shortName: "Learning" },
  library: { shortName: "Library", longName: "Software Library" },
  logic: { shortName: "Logic" },
  math: { shortName: "Math", longName: "Mathematics" },
  ocaml: { shortName: "OCaml" },
  oop: { shortName: "OOP", longName: "Object-Oriented Programming" },
  opengl: { shortName: "OpenGL" },
  opinion: { shortName: "Opinion" },
  personal: { shortName: "Personal" },
  physics: { shortName: "Physics" },
  pl: { shortName: "PL", longName: "Programming Languages" },
  pldev: { shortName: "PLDev", longName: "Programming Language Development" },
  python: { shortName: "Python" },
  racket: { shortName: "Racket" },
  rasterizer: { shortName: "Rasterization" },
  react: { shortName: "React" },
  rt: { shortName: "Ray Tracing", longName: "Ray Tracing" },
  rust: { shortName: "Rust" },
  scheme: { shortName: "Scheme" },
  test: { shortName: "Testing", longName: "Software Testing" },
  typescript: { shortName: "TypeScript" },
  vulkan: { shortName: "Vulkan" },
  web: { shortName: "Web", longName: "Web Development" },
  webgpu: { shortName: "WebGPU" },
  x86: { shortName: "X86", longName: "X86 Assembly" },
});

const zhTagTranslations: typeof enTagTranslations = createTagTranslations({
  ai: enTagTranslations.ai,
  algorithms: { shortName: "算法" },
  books: { shortName: "书评", longName: "书评" },
  c: { shortName: "C", longName: "C语言" },
  cmake: enTagTranslations.cmake,
  code: { shortName: "编程" },
  compiler: { shortName: "编译器" },
  cpp: enTagTranslations.cpp,
  csharp: enTagTranslations.csharp,
  cuda: enTagTranslations.cuda,
  designpattern: { shortName: "设计模式" },
  dod: { shortName: "面向数据设计", longName: "面向数据设计" },
  elm: enTagTranslations.elm,
  event: { shortName: "活动" },
  functional: { shortName: "函数式编程", longName: "函数式编程" },
  game: { shortName: "游戏" },
  git: enTagTranslations.git,
  graphics: { shortName: "图形学", longName: "计算机图形学" },
  graphql: enTagTranslations.graphql,
  i18n: { shortName: "国际化", longName: "国际化" },
  java: enTagTranslations.java,
  javascript: enTagTranslations.javascript,
  learning: enTagTranslations.learning,
  library: { shortName: "软件库", longName: "软件库" },
  logic: { shortName: "逻辑学" },
  math: { shortName: "数学", longName: "数学" },
  ocaml: enTagTranslations.ocaml,
  oop: { shortName: "OOP", longName: "面向对象编程" },
  opengl: enTagTranslations.opengl,
  opinion: { shortName: "观点" },
  personal: { shortName: "个人相关" },
  physics: { shortName: "物理" },
  pl: { shortName: "编程语言", longName: "编程语言" },
  pldev: { shortName: "编程语言开发", longName: "编程语言开发" },
  python: enTagTranslations.python,
  racket: enTagTranslations.racket,
  rasterizer: { shortName: "光栅化" },
  react: enTagTranslations.react,
  rt: { shortName: "光线追踪", longName: "光线追踪" },
  rust: enTagTranslations.rust,
  scheme: enTagTranslations.scheme,
  test: { shortName: "测试", longName: "软件测试" },
  typescript: enTagTranslations.typescript,
  vulkan: enTagTranslations.vulkan,
  web: { shortName: "Web", longName: "Web开发" },
  webgpu: enTagTranslations.webgpu,
  x86: { shortName: "X86", longName: "X86汇编语言" },
});

const tagTranslations = {
  en: enTagTranslations,
  zh: zhTagTranslations,
};

const assertTagTranslated = (tags: string[]) => {
  for (const tag of tags) {
    if (!Object.keys(enTagTranslations).includes(tag)) {
      throw new Error(`Untranslated tag: ${tag}!`);
    }
  }
};

// Make sure that all the tags are translated
assertTagTranslated(ALL_BLOG_POST_TAGS);
assertTagTranslated(ALL_PROJECT_TAGS);

const en = {
  about: "About",
  aboutme: "About Me",
  all: "All",
  archive: "Blog Archive",
  blog: "Blog",
  createTime: "Created: ",
  elsewhere: "Elsewhere",
  featuredProjects: "Featured Projects",
  home: "Home",
  langName: "English",
  langToggleHint: "View in Chinese (切换至中文)",
  lastModified: "Last Modified: ",
  latestPosts: "Latest Posts",
  learning: "Learning",
  myname: "Lesley Lai",
  notFound: "404 Not Found",
  notes: "Notes",
  oppositeLang: "zh" as Language,
  otherProjects: "Other Projects",
  projects: "Projects",
  projectsDescription: "Check out all my personal projects below.",
  projectsFilterHint: "Showing all projects. Click tags to filter by topic.",
  projectsFilterHintTag: (tag: string, count: number) =>
    `Show ${count} projects filtered by ${translateTag("en", tag, true)}`,
  posts: "posts",
  showAll: "Show All",
  siteName: "Lesley Lai",
  stuffIWroteAbout: (tag: string) => `Stuff I wrote about ${translateTag("en", tag, true)}`,
  tags: "Tags",
  talks: "Talks",
  talksDescription: "Here are the talks that I gave in various events.",
  themeDark: "Dark",
  themeLight: "Light",
  themeToggleHint: "Toggle Appearance (Dark/Light)",
  untranslated: "(untranslated)",
  website: "Website",
};

export type Translations = typeof en;

export type TranslationKey = keyof Translations;

const zh: Translations = {
  about: "关于",
  aboutme: "关于我",
  all: "所有",
  archive: "博文存档",
  blog: "博客",
  createTime: "创建时间：",
  elsewhere: "我的其他在线足迹",
  featuredProjects: "代表作",
  home: "主页",
  langName: "中文",
  langToggleHint: "View in English (切换至英文)",
  lastModified: "最近修改时间：",
  latestPosts: "最新文章",
  learning: "学习",
  myname: "赖思理",
  notFound: "找不到页面",
  notes: "笔记",
  oppositeLang: "en" as Language,
  otherProjects: "其他项目",
  projects: "项目",
  projectsDescription: "下列是我的一些个人项目",
  projectsFilterHint: "正在显示所有项目。您可以通过标签来限定显示包含指定标签的项目。",
  projectsFilterHintTag: (tag: string, count: number) =>
    `显示${count}个关于${translateTag("zh", tag, true)}的项目`,
  posts: "篇博文",
  showAll: "显示所有",
  siteName: "赖思理的个人网站",
  stuffIWroteAbout: (tag) => `关于${translateTag("zh", tag, true)}的博文`,
  tags: "标签",
  talks: "演讲",
  talksDescription: "以下为我在不同场所的一些讲话：",
  themeDark: "深色",
  themeLight: "浅色",
  themeToggleHint: "切换外观（深色/浅色）",
  untranslated: "（未译）",
  website: "网站",
};

export const translations: Record<Language, typeof en> = {
  en: en,
  zh: zh,
};

export const tagHasLongName = (lang: Language, tag: string): boolean => {
  if (tag in enTagTranslations) {
    const translation = tagTranslations[lang][tag as keyof typeof enTagTranslations];
    return "longName" in translation;
  }
  throw Error(`Failed to translate tag: ${tag}`);
};

export const translateTag = (lang: Language, tag: string, longName = false): string => {
  if (tag in enTagTranslations) {
    const translation = tagTranslations[lang][tag as keyof typeof enTagTranslations];
    if (!longName || !("longName" in translation)) {
      return translation.shortName;
    }

    return translation.longName;
  }
  throw Error(`Failed to translate tag: ${tag}`);
};
