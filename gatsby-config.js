module.exports = {
    siteMetadata: {
      title: `Lesley Lai's Blog`,
      siteUrl: `https://www.lesleylai.info`,
    },
    plugins: [`gatsby-plugin-react-helmet`,
              {
                  resolve: `gatsby-transformer-remark`,
                  options: {
                      plugins: [
                          {
                              resolve: `gatsby-remark-prismjs`,
                              options: {
                                  // Class prefix for <pre> tags containing syntax highlighting;
                                  // defaults to 'language-' (eg <pre class="language-js">).
                                  // If your site loads Prism into the browser at runtime,
                                  // (eg for use with libraries like react-live),
                                  // you may use this to prevent Prism from re-processing syntax.
                                  // This is an uncommon use-case though;
                                  // If you're unsure, it's best to use the default value.
                                  classPrefix: 'language-',
                              },
                          },
                      ]
                  }
              },
              {
                  resolve: `gatsby-source-filesystem`,
                  options: {
                      name: `src`,
                      path: `${__dirname}/src/`,
                  },
              },
              {
                  resolve: `gatsby-plugin-typography`,
                  options: {
                      pathToConfigModule: `src/utils/typography.js`,
                  },
              },
              `gatsby-plugin-typescript`,
              {
                resolve: `gatsby-plugin-sitemap`
              },
              `gatsby-transformer-sharp`,
              `gatsby-plugin-sharp`,
              `gatsby-plugin-postcss`,
             ],
    
};
