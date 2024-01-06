import type { GatsbyNode } from "gatsby";

import { Language, languages } from "./src/utils/translation";

const removeTrailingSlash = (path: string) => (path === `/` ? path : path.replace(/\/$/, ``));

export const onCreatePage: GatsbyNode["onCreatePage"] = async ({ page, actions }) => {
  const { createPage, deletePage } = actions;

  //console.log(page.path);

  const path = removeTrailingSlash(page.path);

  // special page
  if (path.includes("dev-404-page")) {
    return;
  }

  // TODO: handle 404 pages?
  if (path.includes("404")) {
    return;
  }

  deletePage(page);

  const localizedRoot = (lang: Language) => (lang == "en" ? "/" : `/${lang}`);
  const getDateLocale = (lang: Language) => (lang === "zh" ? "ZH_CN" : lang);
  for (const lang of languages) {
    const localizedPath = page.path === "/" ? localizedRoot(lang) : `/${lang}${page.path}`;

    createPage({
      ...page,
      path: localizedPath,
      context: {
        lang: lang,
        dateLocale: getDateLocale(lang),
      },
    });
  }
};

type PostNode = {
  readonly frontmatter: {
    readonly id: string;
    readonly title: string;
    readonly lang: string;
    readonly tags: readonly string[] | null;
  };
};

type AllPostsQuery = {
  readonly allMdx: {
    readonly nodes: readonly PostNode[];
  };
};

const groupPostById = (nodes: readonly PostNode[]) => {
  const idToNodes: Map<string, unknown> = new Map();
  for (const node of nodes) {
    const id = node.frontmatter.id;
    if (idToNodes.has(id)) {
      (idToNodes.get(id) as PostNode[]).push(node);
    } else {
      idToNodes.set(id, [node]);
    }
  }

  idToNodes.forEach((translations, id) => {
    const translationMap: { [P in Language]?: PostNode } = {};
    for (const node of translations as PostNode[]) {
      translationMap[node.frontmatter.lang as Language] = node;
    }
    idToNodes.set(id, translationMap);
  });

  return idToNodes as Map<string, { [P in Language]?: PostNode }>;
};

export const createPages: GatsbyNode["createPages"] = async ({ graphql }) => {
  await graphql(`
    query CreatePagesAllPosts {
      allMdx(filter: { internal: { contentFilePath: { regex: "//contents/blog//" } } }) {
        nodes {
          frontmatter {
            id
            title
            lang
            tags: categories
          }
        }
      }
    }
  `).then((posts) => {
    const nodes = (posts.data as AllPostsQuery).allMdx.nodes;

    const groupedPosts = groupPostById(nodes);

    groupedPosts.forEach((translations, id) => {
      console.log(`${id} => ${JSON.stringify(translations, null, 2)}`);
    });
  });
};
