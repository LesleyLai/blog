const path = require('path');
const { createFilePath } = require(`gatsby-source-filesystem`);
const _ = require("lodash");

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;
  if (node.internal.type === `MarkdownRemark`) {
    const relativePath = createFilePath({ node, getNode, basePath: `pages` });
    createNodeField({
      node,
      name: `relativePath`,
      value: relativePath,
    });
  }
};

const langs = ["en", "zh"];

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;

  const postTemplate = path.resolve(`src/templates/post.tsx`);
  const tagsTemplate = path.resolve("src/templates/tags.tsx");
  const projectsTemplate = path.resolve("src/templates/projects.tsx");

  const posts = new Promise((resolve, _reject) => {
    graphql(`
      {
        allMarkdownRemark(filter: {fields: {relativePath: {regex: "/\/blog/"}}}) {
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
    `).then(result => {
      const posts = result.data.allMarkdownRemark.edges;

      // Creates individual pages
      posts.map(({ node }) => {
        const lang = node.frontmatter.lang;

        createPage({
          path: '/' + node.frontmatter.id + '/' + lang,
          component: postTemplate,
          context: {
            relativePath: node.fields.relativePath,
          },
        });
      });

      const tags = new Set();
      for (const post of posts) {
        const postTags = post.node.frontmatter.categories;
        if (postTags) {
          postTags.forEach(tag => {
            tags.add(tag);
          });
        }
      }

      const langs = ["en", "zh"];

      for (const tag of tags) {
        for (const lang of langs) {
          createPage({
            path: "/archive/" + tag + '/' + lang,
            component: tagsTemplate,
            context: {
              tag,
              lang: lang,
            },
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
  allMarkdownRemark(filter: {fields: {relativePath: {regex: "//projects/"}}, frontmatter: {lang: {eq: "en"}}}) {
    edges {
      node {
        frontmatter {
          categories
        }
      }
    }
  }
}
    `).then(result => {
      const projects = result.data.allMarkdownRemark.edges;

      // Create tag pages
      const tags = new Set();
      for (const project of projects) {
        const projectTags = project.node.frontmatter.categories;
        if (projectTags) {
          projectTags.forEach(tag => {
            tags.add(tag);
          });
        }
      }

      for (const tag of tags) {
        createPage({
          path: "/projects/" + tag + '/',
          component: projectsTemplate,
          context: {
            tag,
          },
        });
      }


      resolve();
    });
  }).catch(error => {
    console.log(error);
  });

  return Promise.all([posts, projects]);
};
