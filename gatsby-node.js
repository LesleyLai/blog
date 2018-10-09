const path = require('path');
const { createFilePath } = require(`gatsby-source-filesystem`);

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
    return new Promise((resolve, reject) => {
        graphql(`
      {
        allMarkdownRemark {
          edges {
            node {
              frontmatter {
                id
                lang
              }
              fields {
                relativePath
              }
            }
          }
        }
      }
    `).then(result => {
        result.data.allMarkdownRemark.edges.map(({ node }) => {
            createPage({
                path: '/' + node.frontmatter.id + '/' + node.frontmatter.lang + '/',
                component: path.resolve(`./src/templates/post.tsx`),
                context: {
                    // Data passed to context is available in page queries as GraphQL variables.
                    relativePath: node.fields.relativePath,
                },
            });
        });
        resolve();
    });
    });
};
