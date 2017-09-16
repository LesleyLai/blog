module.exports = {
    siteMetadata: {
        title: `Lesley Lai's Website`,
    },
    plugins: [`gatsby-plugin-react-helmet`,
              `gatsby-transformer-remark`,
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
             ],
    
};
