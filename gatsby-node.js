const path = require('path');

exports.onCreateNode = ({ node, boundActionCreators, getNode }) => {
    const { createNodeField } = boundActionCreators;
    let relativePath;
    if (node.internal.type === `MarkdownRemark`) {
        const fileNode = getNode(node.parent);
        const parsedFilePath = path.parse(fileNode.relativePath);
        if (parsedFilePath.name !== `index` && parsedFilePath.dir !== ``) {
            relativePath = `/${parsedFilePath.dir}/${parsedFilePath.name}/`;
        } else if (parsedFilePath.dir === ``) {
            relativePath = `/${parsedFilePath.name}/`;
        } else {
            relativePath = `/${parsedFilePath.dir}/`;
        }

        // Add relativePath as a field on the node.
        createNodeField({ node, name: `relativePath`, value: relativePath });
    }
};



const { createFilePath } = require(`gatsby-source-filesystem`)

exports.onCreateNode = ({ node, getNode, boundActionCreators }) => {
    const { createNodeField } = boundActionCreators;
    if (node.internal.type === `MarkdownRemark`) {
        const relativePath = createFilePath({ node, getNode, basePath: `pages` });
        createNodeField({
            node,
            name: `relativePath`,
            value: relativePath,
        })
    }
};

exports.createPages = ({ graphql, boundActionCreators }) => {
    const { createPage } = boundActionCreators;
    return new Promise((resolve, reject) => {
        graphql(`
      {
        allMarkdownRemark {
          edges {
            node {
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
                path: node.fields.relativePath,
                component: path.resolve(`./src/templates/post.jsx`),
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
