module.exports = {
  siteMetadata: {
    title: `Lesley Lai's Blog`,
    description: `A personal website and blog for Lesley Lai`,
    siteUrl: `http://www.lesleylai.info`
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        excerpt_separator: `<!-- end -->`,
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
          },
          {
            resolve: `gatsby-remark-images`,
            options: {
              // It's important to specify the maxWidth (in pixels) of
              // the content container as this plugin uses this as the
              // base for generating different widths of each image.
              maxWidth: 590,
            },
          },
          {
            resolve: `gatsby-remark-katex`,
            options: {
              // Add any KaTeX options from https://github.com/KaTeX/KaTeX/blob/master/docs/options.md here
              strict: `ignore`
            }
          },
          `gatsby-remark-reading-time`,
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
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `contents`,
        path: `${__dirname}/contents/`
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
                const url = site.siteMetadata.siteUrl + '/' + edge.node.frontmatter.id + '/' + edge.node.frontmatter.lang;
                return Object.assign({}, edge.node.frontmatter, {
                  description: edge.node.excerpt,
                  date: edge.node.frontmatter.create,
                  language: edge.node.frontmatter.lang,
                  url: url,
                  guid: url,
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
        html
        frontmatter {
          title
          create
          lang
          id
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
    },
    {
      resolve: 'gatsby-plugin-google-fonts',
      options: {
        fonts: [
          'material icons',
          'roboto:300,400,500,700',
        ],
      },
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: "UA-137818218-1",
      },
    },
    `gatsby-plugin-styled-components`,
  ]
};
