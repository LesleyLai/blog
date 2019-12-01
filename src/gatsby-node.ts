import { GatsbyNode } from "gatsby";
import { resolve } from "path";
import { languages, Language } from "./utils/translations";
import { TagID } from "./types/tags";

// Create redirect from from path to to path
// Both with or without trailing slash
// The fromPath should not have trailing slash
const createRedirectsSlash = (
  fromPath: string,
  toPath: string,
  createRedirect: (redirect: {
    fromPath: string;
    redirectInBrowser: boolean;
    toPath: string;
  }) => void
): void => {
  createRedirect({
    fromPath: fromPath,
    redirectInBrowser: true,
    toPath: toPath
  });
  createRedirect({
    fromPath: `${fromPath}/`,
    redirectInBrowser: true,
    toPath: toPath
  });
};

const lagacyURLRedirections: Array<{ from: string; to: string }> = [
  { from: "/cppcon2019/en", to: "/en/cppcon2019" },
  { from: "/functional-cpp/en", to: "/en/functional-cpp" },
  { from: "/c++-lambda/en", to: "/en/c++-lambda" },
  { from: "/lea/zh", to: "/zh/lea" },
  { from: "/overhead/en", to: "/en/overhead" },
  { from: "/professional-cmake/en", to: "/en/professional-cmake" },
  { from: "/siggraph2019/en", to: "/en/siggraph2019" },
  { from: "/siggraph2019/zh", to: "/zh/siggraph2019" },
  { from: "/raii/zh", to: "/zh/raii" },
  { from: "/raii/en", to: "/en/raii" },
  { from: "/temporaries/en", to: "/en/temporaries" },
  {
    from: "/make-impossible-state-unrepresentable/en",
    to: "/en/make-impossible-state-unrepresentable"
  },
  { from: "/tail-recursion/en", to: "/en/tail-recursion" },
  {
    from: "/make-impossible-state-unrepresentable/zh",
    to: "/zh/make-impossible-state-unrepresentable"
  },
  {
    from: "/type-of-assignment-operators/en",
    to: "/en/type-of-assignment-operators"
  },
  { from: "/unit-test-with-cmake/en", to: "/en/unit-test-with-cmake" },
  { from: "/unit-test-with-cmake/zh", to: "/zh/unit-test-with-cmake" },
  { from: "/lea/en", to: "/en/lea" },
  { from: "/archive/cpp/en", to: "/en/archive/cpp" },
  { from: "/archive/event/en", to: "/en/archive/event" },
  { from: "/archive/books/en", to: "/en/archive/books" },
  { from: "/archive/code/en", to: "/en/archive/code" },
  { from: "/archive/functional/en", to: "/en/archive/functional" },
  { from: "/archive/c/en", to: "/en/archive/c" },
  { from: "/archive/csharp/en", to: "/en/archive/csharp" },
  { from: "/archive/java/en", to: "/en/archive/java" },
  { from: "/archive/opinion/en", to: "/en/archive/opinion" },
  { from: "/archive/cmake/en", to: "/en/archive/cmake" },
  { from: "/archive/graphics/en", to: "/en/archive/graphics" },
  { from: "/archive/dod/en", to: "/en/archive/dod" },
  { from: "/archive/elm/en", to: "/en/archive/elm" },
  { from: "/archive/test/en", to: "/en/archive/test" },
  { from: "/archive/x86/en", to: "/en/archive/x86" },
  { from: "/archive/c/zh", to: "/zh/archive/c" },
  { from: "/archive/code/zh", to: "/zh/archive/code" },
  { from: "/archive/x86/zh", to: "/zh/archive/x86" },
  { from: "/archive/graphics/zh", to: "/zh/archive/graphics" },
  { from: "/archive/event/zh", to: "/zh/archive/event" },
  { from: "/archive/cpp/zh", to: "/zh/archive/cpp" },
  { from: "/archive/opinion/zh", to: "/zh/archive/opinion" },
  { from: "/archive/dod/zh", to: "/zh/archive/dod" },
  { from: "/archive/functional/zh", to: "/zh/archive/functional" },
  { from: "/archive/cmake/zh", to: "/zh/archive/cmake" },
  { from: "/archive/test/zh", to: "/zh/archive/test" },
  { from: "/projects/elm/en", to: "/en/projects/elm" },
  { from: "/projects/library/en", to: "/en/projects/library" },
  { from: "/projects/functional/en", to: "/en/projects/functional" },
  { from: "/projects/cpp/en", to: "/en/projects/cpp" },
  { from: "/projects/pl/en", to: "/en/projects/pl" },
  { from: "/projects/graphics/en", to: "/en/projects/graphics" },
  { from: "/projects/opengl/en", to: "/en/projects/opengl" },
  { from: "/projects/rt/en", to: "/en/projects/rt" },
  { from: "/projects/game/en", to: "/en/projects/game" },
  { from: "/projects/web/en", to: "/en/projects/web" },
  { from: "/projects/i18n/en", to: "/en/projects/i18n" },
  { from: "/projects/typescript/en", to: "/en/projects/typescript" },
  { from: "/projects/react/en", to: "/en/projects/react" },
  { from: "/projects/graphql/en", to: "/en/projects/graphql" },
  { from: "/archive/en", to: "/en/archive" },
  { from: "/archive/zh", to: "/zh/archive" },
  { from: "/projects/en", to: "/en/projects" },
  { from: "/projects/zh", to: "/zh/projects" },
  { from: "/talks/en", to: "/en/talks" },
  { from: "/talks/zh", to: "/zh/talks" }
];

const dateLocale = (lang: Language) => (lang === "zh" ? "ZH_CN" : lang);

export const createPages: GatsbyNode["createPages"] = async ({
  graphql,
  actions
}) => {
  const { createPage, createRedirect } = actions;

  const postTemplate = resolve(`src/templates/post.tsx`);
  const tagsTemplate = resolve("src/templates/tags.tsx");
  const projectsTemplate = resolve("src/templates/projects.tsx");

  lagacyURLRedirections.forEach(({ from, to }) => {
    createRedirectsSlash(from, to, createRedirect);
  });

  const posts = new Promise((resolve, _reject) => {
    graphql(`
      {
        allMarkdownRemark(
          filter: { fields: { relativePath: { regex: "//blog/" } } }
        ) {
          edges {
            node {
              frontmatter {
                id
                lang
                categories
              }
            }
          }
        }
      }
    `).then((result: any) => {
      const posts = result.data.allMarkdownRemark.edges;

      // Creates individual pages
      posts.map(({ node }: any) => {
        const lang = node.frontmatter.lang;
        const id = node.frontmatter.id;

        createPage({
          path: `/${lang}/${id}`,
          component: postTemplate,
          context: {
            lang: lang,
            id: id,
            dateLocale: dateLocale(lang)
          }
        });
      });

      languages
        .map(lang => {
          const tags: Set<TagID> = new Set();
          for (const post of posts) {
            if (post.node.frontmatter.lang === lang) {
              const postTags = post.node.frontmatter.categories;
              if (postTags) {
                postTags.forEach((tag: TagID) => {
                  tags.add(tag);
                });
              }
            }
          }

          return { lang, tags };
        })
        .forEach(({ lang, tags }) => {
          for (const tag of Array.from(tags)) {
            const localizedPath = `/${lang}/archive/${tag}`;

            const otherLangsRegex = `//(?!${lang}).*/archive/${tag}$/`;

            createPage({
              path: localizedPath,
              component: tagsTemplate,
              context: {
                tag,
                lang: lang,
                dateLocale: dateLocale(lang),
                otherLangsRegex: otherLangsRegex
              }
            });
          }

          if (lang == "en") {
            for (const tag of Array.from(tags)) {
              createRedirectsSlash(
                `/archive/${tag}`,
                `/en/archive/${tag}`,
                createRedirect
              );
            }
          }
        });

      resolve();
    });
  }).catch(error => {
    console.log(error);
  });

  const projects = new Promise((resolve, _reject) => {
    graphql(`
      {
        allMarkdownRemark(
          filter: {
            fields: { relativePath: { regex: "//projects/" } }
            frontmatter: { lang: { eq: "en" } }
          }
        ) {
          edges {
            node {
              frontmatter {
                categories
              }
            }
          }
        }
      }
    `).then((result: any) => {
      const projects = result.data.allMarkdownRemark.edges;

      // Create tag pages
      const tags = new Set();
      for (const project of projects) {
        const projectTags = project.node.frontmatter.categories;
        if (projectTags) {
          projectTags.forEach((tag: any) => {
            tags.add(tag);
          });
        }
      }

      for (const tag of Array.from(tags)) {
        createPage({
          path: `/en/projects/${tag}`,
          component: projectsTemplate,
          context: {
            tag,
            lang: "en"
          }
        });
      }

      resolve();
    });
  });

  return Promise.all([posts, projects]).catch(error => {
    console.log(error);
  });
};

const removeTrailingSlash = (path: string) =>
  path === `/` ? path : path.replace(/\/$/, ``);

// Page that with no other language versions
const specialPages = new Set(["/dev-404-page"]);

const localizedRoot = (lang: Language) => (lang == "en" ? "/" : "/zh");

export const onCreatePage: GatsbyNode["onCreatePage"] = async args => {
  const page: any = args.page;
  const actions = args.actions;
  const { createPage, deletePage, createRedirect } = actions;

  deletePage(page);
  page.path = removeTrailingSlash(page.path);

  if (specialPages.has(page.path)) {
    createPage(page);
    return;
  }

  // 404 pages
  if (page.path === "/404.html") {
    createPage({
      ...page,
      context: {
        lang: "en"
      }
    });
    return;
  }

  if (page.path === "/404") {
    languages.forEach(lang => {
      const localizedPath =
        page.path === "/" ? localizedRoot(lang) : `/${lang}/404`;

      createPage({
        ...page,
        matchPath: `/${lang}/*`,
        path: localizedPath,
        context: {
          lang: lang
        }
      });
    });

    return;
  }

  // Pages with multiple language versions
  // Homepage is special as it will not have a language postfix
  languages.forEach(lang => {
    const localizedPath =
      page.path === "/" ? localizedRoot(lang) : `/${lang}${page.path}`;

    createPage({
      ...page,
      path: localizedPath,
      context: {
        lang: lang,
        dateLocale: dateLocale(lang)
      }
    });
  });

  // Pages with no language postfixes redirect to English version
  if (page.path !== "/") {
    const redirectTo = `en/${page.path}`;

    createRedirectsSlash(page.path, redirectTo, createRedirect);
  }
};
