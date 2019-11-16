import { GatsbyNode } from "gatsby";
import { resolve } from "path";

export const createPages: GatsbyNode["createPages"] = async ({
  graphql,
  actions
}: any) => {
  const { createPage } = actions;

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
              fields {
                relativePath
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

        createPage({
          path: "/" + node.frontmatter.id + "/" + lang,
          component: postTemplate,
          context: {
            relativePath: node.fields.relativePath
          }
        });
      });

      const tags = new Set();
      for (const post of posts) {
        const postTags = post.node.frontmatter.categories;
        if (postTags) {
          postTags.forEach((tag: any) => {
            tags.add(tag);
          });
        }
      }

      const langs = ["en", "zh"];

      for (const tag of Array.from(tags)) {
        for (const lang of langs) {
          createPage({
            path: "/archive/" + tag + "/" + lang,
            component: tagsTemplate,
            context: {
              tag,
              lang: lang
            }
          });
        }
      }

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
          path: "/projects/" + tag + "/",
          component: projectsTemplate,
          context: {
            tag
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
