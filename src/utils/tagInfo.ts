import { Color, colors } from "./colorTable";

export interface Tag {
  en: string;
  zh?: string;
  color: Color; // Color of the tag box
}

export const tagInfos: { [id: string]: Tag } = {
  books: { en: "Books", zh: "书籍", color: colors.yellow },
  c: { en: "C", color: colors.grey },
  cmake: { en: "CMake", color: colors.green },
  cpp: { en: "C++", color: colors.blue },
  elm: { en: "Elm", color: colors.teal },
  math: { en: "Mathematics", color: colors.pink },
  functional: {
    en: "Functional Programming",
    zh: "函数式编程",
    color: colors.black
  },
  code: {
    en: "Coding",
    zh: "编程",
    color: colors.red
  },
  library: { en: "Library", color: colors.white },
  graphql: { en: "GraphQL", color: colors.pink },
  opengl: { en: "OpenGL", color: colors.typescript },
  python: { en: "Python", color: colors.blue },
  pl: { en: "Programming Language", color: colors.red },
  react: { en: "React", color: colors.react },
  rt: { en: "Ray tracing", color: colors.yellow },
  typescript: { en: "Typescript", color: colors.typescript },
  web: { en: "Web", color: colors.violet },
  game: { en: "Game", color: colors.orange },
  quaternion: {
    en: "Quaternion",
    zh: "四元数",
    color: colors.pink
  },
  graphics: {
    en: "Computer Graphics",
    color: colors.purple
  },
  rant: {
    en: "Rant",
    color: colors.pink
  },
  test: { en: "Test", zh: "测试", color: colors.orange },
  event: { en: "Event", color: colors.orange },
  x86: { en: "X86", color: colors.pink }
};

export const projectsTagInfos = tagInfos;
