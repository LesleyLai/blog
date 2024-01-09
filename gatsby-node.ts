import type { GatsbyNode, Reporter } from "gatsby";

import { Language, languages } from "./src/utils/translation";
import { resolve } from "path";

const removeTrailingSlash = (path: string) => (path === `/` ? path : path.replace(/\/$/, ``));

const getDateLocale = (lang: Language) => (lang === "zh" ? "ZH_CN" : lang);

export const onCreatePage: GatsbyNode["onCreatePage"] = async ({ page, actions }) => {
  const { createPage, deletePage } = actions;

  // Is a generated page
  if (page.context?.isGenerated) {
    return;
  }

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
  readonly internal: {
    readonly contentFilePath: string;
  };
};

type AllPostsQuery = {
  readonly allMdx: {
    readonly nodes: readonly PostNode[];
  };
};

const groupPostById = (nodes: readonly PostNode[], reporter: Reporter) => {
  const idToNodes: Map<string, unknown> = new Map();
  for (const node of nodes) {
    const id = node.frontmatter.id;
    if (idToNodes.has(id)) {
      (idToNodes.get(id) as PostNode[]).push(node);
    } else {
      idToNodes.set(id, [node]);
    }
  }

  idToNodes.forEach((nodeLanguageVariants, id) => {
    const translationMap: { [P in Language]?: PostNode } = {};
    for (const node of nodeLanguageVariants as PostNode[]) {
      translationMap[node.frontmatter.lang as Language] = node;
    }
    idToNodes.set(id, translationMap);
  });

  // Generate untranslated posts
  idToNodes.forEach((nodeLanguageVariants) => {
    const langToNode = nodeLanguageVariants as { [P in Language]?: PostNode };
    for (const lang of languages) {
      if (!langToNode[lang]) {
        langToNode[lang] = langToNode["en"];
      }
    }
    if (!langToNode["en"]) {
      reporter.panicOnBuild("Post miss the english version!");
    }
  });

  return idToNodes as Map<string, { [P in Language]: PostNode }>;
};

export const createPages: GatsbyNode["createPages"] = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions;

  const result = await graphql<AllPostsQuery>(`
    query CreatePagesAllPosts {
      allMdx(filter: { internal: { contentFilePath: { regex: "//contents/blog//" } } }) {
        nodes {
          frontmatter {
            id
            title
            lang
            tags: categories
          }
          internal {
            contentFilePath
          }
        }
      }
    }
  `);

  if (result.errors) {
    reporter.panicOnBuild("Error querying blog posts", result.errors);
  }

  const nodes = result.data!.allMdx.nodes;

  const groupedPosts = groupPostById(nodes, reporter);

  const postTemplate = resolve(`src/templates/post.jsx`);
  groupedPosts.forEach((nodeLanguageVariants, id) => {
    for (const lang of languages) {
      const node = nodeLanguageVariants[lang];
      const contentFilePath = node.internal.contentFilePath;
      //console.log(contentFilePath);

      createPage({
        path: `/${lang}/${id}`,
        component: `${postTemplate}?__contentFilePath=${contentFilePath}`,
        context: {
          lang: lang,
          isGenerated: true,
          bodyLang: node.frontmatter.lang, // in case of untranslated post, the bodyLang may be different from page's langauge
          id: id,
          dateLocale: getDateLocale(lang),
        },
      });
    }
  });
};
