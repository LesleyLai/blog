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
    toPath: toPath,
  });
  createRedirect({
    fromPath: `${fromPath}/`,
    redirectInBrowser: true,
    toPath: toPath,
  });
};

const localizedRoot = (lang: Language) => (lang == "en" ? "/" : "/zh");

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
    to: "/en/make-impossible-state-unrepresentable",
  },
  { from: "/tail-recursion/en", to: "/en/tail-recursion" },
  {
    from: "/make-impossible-state-unrepresentable/zh",
    to: "/zh/make-impossible-state-unrepresentable",
  },
  {
    from: "/type-of-assignment-operators/en",
    to: "/en/type-of-assignment-operators",
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
  { from: "/talks/zh", to: "/zh/talks" },
];

const getDateLocale = (lang: Language) => (lang === "zh" ? "ZH_CN" : lang);

interface ProjectMeta {
  readonly frontmatter: {
    tags: TagID[];
  };
}

interface MdxWithTags {
  node: {
    frontmatter: {
      tags: TagID[];
    };
  };
}

const uniqueTags = (mdxs: MdxWithTags[]) => {
  const tagSet: Set<TagID> = new Set();
  mdxs
    .map(mdx => mdx.node.frontmatter.tags)
    .filter(tags => tags.length !== 0)
    .forEach(tags => {
      tags.forEach(tag => tagSet.add(tag));
    });
  return Array.from(tagSet);
};

export const createPages: GatsbyNode["createPages"] = async ({ graphql, actions }) => {
  const { createPage, createRedirect } = actions;

  const paginationTemplate = resolve(`src/templates/pagination.tsx`);
  const postTemplate = resolve(`src/templates/post.tsx`);
  const tagsTemplate = resolve("src/templates/tags.tsx");
  const projectsTemplate = resolve("src/templates/projects.tsx");

  lagacyURLRedirections.forEach(({ from, to }) => {
    createRedirectsSlash(from, to, createRedirect);
  });

  const postsPromise = new Promise((resolve, _reject) => {
    interface Result {
      data: {
        posts: {
          edges: Array<{
            node: {
              frontmatter: {
                id: string;
                lang: Language;
                tags: TagID[];
              };
            };
          }>;
        };
      };
    }

    graphql(`
      {
        posts: allMdx(
          sort: { fields: [frontmatter___create] }
          filter: { fileAbsolutePath: { regex: "//contents/blog//" } }
        ) {
          edges {
            node {
              frontmatter {
                id
                lang
                tags: categories
              }
            }
          }
        }
      }
    `).then((result: Result) => {
      const posts = result.data.posts.edges;
      languages.forEach(lang => {
        const langPosts = posts.filter(post => post.node.frontmatter.lang === lang);
        const dateLocale = getDateLocale(lang);

        // Creates individual pages
        langPosts.forEach(({ node }, index) => {
          const lang = node.frontmatter.lang;
          const id = node.frontmatter.id;

          const previousIndex = index - 1;
          const previousId =
            previousIndex in langPosts ? langPosts[previousIndex].node.frontmatter.id : null;

          const nextIndex = index + 1;
          const nextId = nextIndex in langPosts ? langPosts[nextIndex].node.frontmatter.id : null;

          createPage({
            path: `/${lang}/${id}`,
            component: postTemplate,
            context: {
              lang: lang,
              id: id,
              dateLocale: dateLocale,
              previousId: previousId,
              nextId: nextId,
            },
          });
        });

        // Creates pagination
        const postsPerPage = 5;
        const pagesCount = Math.ceil(langPosts.length / postsPerPage);
        Array.from({ length: pagesCount }).forEach((_, i) => {
          // Homepage is special as it will not have a language postfix
          const localizedPath = i === 0 ? localizedRoot(lang) : `/${lang}/${i + 1}`;

          createPage({
            path: localizedPath,
            component: paginationTemplate,
            context: {
              lang: lang,
              dateLocale: dateLocale,
              skip: i * postsPerPage,
              pagesCount: pagesCount,
              currentPage: i + 1,
            },
          });
        });

        // Tag pages
        uniqueTags(langPosts).forEach(tag => {
          const localizedPath = `/${lang}/archive/${tag}`;
          const otherLangsRegex = `//(?!${lang}).*/archive/${tag}$/`;

          createPage({
            path: localizedPath,
            component: tagsTemplate,
            context: {
              tag,
              lang: lang,
              dateLocale: dateLocale,
              otherLangsRegex: otherLangsRegex,
            },
          });
        });
      });

      resolve();
    });
  }).catch(error => {
    console.log(error);
  });

  const projectsPromise = new Promise((resolve, _reject) => {
    interface Result {
      readonly data: {
        projects: {
          edges: Array<{
            node: ProjectMeta;
          }>;
        };
      };
    }

    const promises = languages.map(lang =>
      graphql(`
    {
      projects: allMdx(
        filter: {
          fileAbsolutePath: { regex: "//contents/projects//" }
          frontmatter: { lang: { eq: "${lang}" } }
        }
      ) {
        edges {
          node {
            frontmatter {
              tags: categories
            }
          }
        }
      }
    }
  `).then((result: Result) => {
        const projects = result.data.projects.edges;

        // Create tag pages
        uniqueTags(projects).map(tag => {
          createPage({
            path: `/${lang}/projects/${tag}`,
            component: projectsTemplate,
            context: {
              tag,
              lang: lang,
            },
          });
        });
      })
    );

    Promise.all(promises)
      .catch(error => {
        console.log(error);
      })
      .then(() => {
        resolve();
      });
  });

  return Promise.all([postsPromise, projectsPromise]).catch(error => {
    console.log(error);
  });
};

const removeTrailingSlash = (path: string) => (path === `/` ? path : path.replace(/\/$/, ``));

// Page that with no other language versions
const specialPages = new Set(["/dev-404-page"]);

export const onCreatePage: GatsbyNode["onCreatePage"] = async args => {
  const page = args.page;
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
        lang: "en",
      },
    });
    return;
  }

  if (page.path === "/404") {
    languages.forEach(lang => {
      const localizedPath = page.path === "/" ? localizedRoot(lang) : `/${lang}/404`;

      createPage({
        ...page,
        matchPath: `/${lang}/*`,
        path: localizedPath,
        context: {
          lang: lang,
        },
      });
    });

    return;
  }

  // Pages with multiple language versions
  languages.forEach(lang => {
    createPage({
      ...page,
      path: `/${lang}${page.path}`,
      context: {
        lang: lang,
        dateLocale: getDateLocale(lang),
      },
    });
  });

  // Pages with no language postfixes redirect to English version
  if (page.path !== "/") {
    const redirectTo = `en/${page.path}`;

    createRedirectsSlash(page.path, redirectTo, createRedirect);
  }
};
