import { Color, colors } from "./colorTable";

export interface Tag {
  en: string;
  zh?: string;
  color: Color; // Color of the tag box
}

export const tagInfos: { [id: string]: Tag } = {
  books: { en: "Books", zh: "书籍", color: colors.yellow },
  cpp: { en: "C++", color: colors.red },
  cmake: { en: "CMake", color: colors.green },
  elm: { en: "Elm", color: colors.teal },
  functional: {
    en: "Functional Programming",
    zh: "函数式编程",
    color: colors.black
  },
  code: {
    en: "Coding",
    zh: "编程",
    color: colors.blue
  },
  test: { en: "Test", zh: "测试", color: colors.orange },
  rant: {
    en: "Rant",
    color: colors.pink
  },
  resource: {
    en: "Resource Management",
    zh: "资源管理",
    color: colors.white
  }
};
