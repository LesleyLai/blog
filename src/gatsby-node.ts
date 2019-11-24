import { GatsbyNode } from "gatsby";
import { resolve } from "path";
import { languages, Language } from "./utils/translations";
import { TagID } from "./types/tags";

export const createPages: GatsbyNode["createPages"] = async ({
  graphql,
  actions
}) => {
  const { createPage, createRedirect } = actions;

  const postTemplate = resolve(`src/templates/post.tsx`);
  const tagsTemplate = resolve("src/templates/tags.tsx");
  const projectsTemplate = resolve("src/templates/projects.tsx");

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
          path: `/${id}/${lang}`,
          component: postTemplate,
          context: {
            lang: lang,
            id: id
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
                postTags.forEach((tag: any) => {
                  tags.add(tag);
                });
              }
            }
          }

          return { lang, tags };
        })
        .forEach(({ lang, tags }) => {
          for (const tag of Array.from(tags)) {
            const localizedPath = `/archive/${tag}/${lang}`;

            const otherLangsRegex = `//archive/${tag}/(?!${lang})/`;

            createPage({
              path: localizedPath,
              component: tagsTemplate,
              context: {
                tag,
                lang: lang,
                otherLangsRegex: otherLangsRegex
              }
            });
          }

          if (lang == "en") {
            for (const tag of Array.from(tags)) {
              createRedirect({
                fromPath: `/archive/${tag}`,
                redirectInBrowser: true,
                toPath: `/archive/${tag}/en`
              });

              createRedirect({
                fromPath: `/archive/${tag}/`,
                redirectInBrowser: true,
                toPath: `/archive/${tag}/en`
              });
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
          path: "/projects/" + tag + "/en",
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
const specialPages = new Set(["/404", "/dev-404-page", "/404.html"]);

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

  // Pages with multiple language versions
  // Homepage is special as it will not have a language postfix
  languages.forEach(lang => {
    const localizedPath =
      page.path === "/" ? localizedRoot(lang) : `${page.path}/${lang}`;

    createPage({
      ...page,
      path: localizedPath,
      context: {
        lang: lang
      }
    });
  });

  // Pages with no language postfixes redirect to English version
  if (page.path !== "/") {
    const redirectTo = `${page.path}/en`;

    createRedirect({
      fromPath: page.path,
      redirectInBrowser: true,
      toPath: redirectTo
    });
    createRedirect({
      fromPath: `${page.path}/`,
      redirectInBrowser: true,
      toPath: redirectTo
    });
  }
};
