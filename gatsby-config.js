module.exports = {
  siteMetadata: {
    title: `Lesley Lai's Blog`,
    description: `A personal website and blog for Lesley Lai`,
    siteUrl: `https://www.lesleylai.info`
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
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
              classPrefix: "language-"
            }
          }
        ]
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `src`,
        path: `${__dirname}/src/`
      }
    },
    {
      resolve: `gatsby-plugin-typography`,
      options: {
        pathToConfigModule: `src/utils/typography.js`
      }
    },
    `gatsby-plugin-typescript`,
    {
      resolve: `gatsby-plugin-sitemap`
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    `gatsby-plugin-postcss`,
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
        {
          site {
            siteMetadata {
              title
              description
              siteUrl
              site_url: siteUrl
            }
          }
        }
      `,
        feeds: [
          {
            serialize: ({ query: { site, allMarkdownRemark } }) => {
              return allMarkdownRemark.edges.map(edge => {
                return Object.assign({}, edge.node.frontmatter, {
                  description: edge.node.excerpt,
                  date: edge.node.frontmatter.create,
                  language: edge.node.frontmatter.lang,
                  url:
                    site.siteMetadata.siteUrl + edge.node.fields.relativePath,
                  guid:
                    site.siteMetadata.siteUrl + edge.node.fields.relativePath,
                  custom_elements: [{ "content:encoded": edge.node.html }]
                });
              });
            },
            query: `
{
  allMarkdownRemark(limit: 1000,
    sort: {order: DESC, fields: [frontmatter___create]},
    filter: {frontmatter: {lang: {eq: "en"}}}) {
    edges {
      node {
        excerpt
        fields {
          relativePath
        }
        html
        frontmatter {
          title
          create
          lang
        }
      }
    }
  }
}
          `,
            output: "/rss.xml",
            title: "Lesley Lai's Blog Rss Feed"
          }
        ]
      }
    }
  ]
};
