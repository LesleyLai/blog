import { Color, colors } from "./colorTable";

/*eslint sort-keys: "warn"*/

export interface Tag {
  color: Color; // Color of the tag box
}

export const tagInfos = {
  books: { color: colors.yellow },
  c: { color: colors.grey },
  cmake: { color: colors.green },
  code: { color: colors.red },
  compiler: { color: colors.green },
  cpp: { color: colors.blue },
  csharp: { color: colors.green },
  dod: { color: colors.orange },
  elm: { color: colors.teal },
  event: { color: colors.orange },
  functional: { color: colors.black },
  game: { color: colors.orange },
  graphics: { color: colors.purple },
  graphql: { color: colors.pink },
  i18n: { color: colors.black },
  java: { color: colors.red },
  javascript: { color: colors.yellow },
  library: { color: colors.grey },
  math: { color: colors.pink },
  ocaml: { color: colors.orange },
  opengl: { color: colors.typescript },
  opinion: { color: colors.pink },
  physics: { color: colors.black },
  pl: { color: colors.teal },
  python: { color: colors.blue },
  react: { color: colors.react },
  rt: { color: colors.yellow },
  test: { color: colors.orange },
  typescript: { color: colors.typescript },
  web: { color: colors.violet },
  x86: { color: colors.pink }
};
