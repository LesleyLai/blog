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
  
  return new Promise((resolve, reject) => {
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
          path: "/tags/" + tag + '/',
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
};
