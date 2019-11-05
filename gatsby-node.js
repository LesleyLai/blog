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
        createPage({
          path: '/' + node.frontmatter.id + '/' + node.frontmatter.lang + '/',
          component: postTemplate,
          context: {
            relativePath: node.fields.relativePath,
          },
        });
      });

      // Create tag pages
      const tags = new Set();
      for (const post of posts) {
        const postTags = post.node.frontmatter.categories;
        if (postTags) {
          postTags.forEach(tag => {
            tags.add(tag);
          });
        }
      }

      for (const tag of tags) {
        createPage({
          path: "/archive/" + tag + '/',
          component: tagsTemplate,
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
        console.log(tag);
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
