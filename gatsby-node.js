const { createFilePath } = require(`gatsby-source-filesystem`);

require('source-map-support').install()
require('ts-node').register({
  compilerOptions: {
    module: 'commonjs',
    target: 'es2017',
  },
});

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

const gatsby = require('./src/gatsby-node');

exports.onCreatePage = gatsby.onCreatePage;
exports.createPages = gatsby.createPages;
