require('source-map-support').install();
require('ts-node').register({
  compilerOptions: {
    module: 'commonjs',
    target: 'es2017',
  },
});

const queries = require("./src/utils/algolia").default;
require("dotenv").config();

const siteMetadata = {
  title: `Lesley Lai's Blog`,
  description: `A personal website and blog for Lesley Lai`,
  siteUrl: `https://www.lesleylai.info`
};

const createFeed = (title, output, lang) => {
  let siteUrl = siteMetadata.siteUrl;
  if (lang !== "en") {
    siteUrl += `/${lang}`;
  }

  return {
    serialize: ({ query: { site, posts } }) => {
      return posts.edges.map(edge => {
        const { id, lang } = edge.node.frontmatter;
        const url = `${site.siteMetadata.siteUrl}/${lang}/${id}`;
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
  posts: allMdx(
    sort: {order: DESC, fields: [frontmatter___create]},
    filter: {
      fileAbsolutePath: { regex: "//contents/blog//" }
      frontmatter: {lang: {eq: "${lang}"}}
    }) {
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
    output: output,
    title: title,
    language: lang,
    site_url: siteUrl,
  };
};

module.exports = {
  siteMetadata: siteMetadata,
  plugins: [
    {
      resolve: `gatsby-plugin-algolia`,
      options: {
        appId: process.env.GATSBY_ALGOLIA_APP_ID,
        apiKey: process.env.ALGOLIA_ADMIN_KEY,
        queries,
        chunkSize: 10000 // default: 1000
      },
    },
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        extensions: [`.mdx`, `.md`],
        excerpt_separator: `<!-- end -->`,
        gatsbyRemarkPlugins: [
          `gatsby-remark-autolink-headers`,
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
            }
          },
          {
            resolve: `gatsby-remark-katex`,
            options: {
              // Add any KaTeX options from https://github.com/KaTeX/KaTeX/blob/master/docs/options.md here
              strict: `ignore`
            }
          },
          {
            resolve: `gatsby-remark-copy-linked-files`,
            options: {
              ignoreFileExtensions: [`png`, `jpg`, `jpeg`, `bmp`, `tiff`],
            },
          },
        ]
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
      resolve: `gatsby-plugin-feed-mdx`,
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
          createFeed("Lesley Lai's Blog", "/rss.xml", "en"),
          createFeed("赖思理的博客", "/zh/rss.xml", "zh")
        ]
      }
    },
    `gatsby-plugin-styled-components`,
    `gatsby-plugin-netlify`,
    {
      resolve: `gatsby-plugin-nprogress`,
      options: {
        // Setting a color is optional.
        color: "#8f6d3d",
        // Disable the loading spinner.
        showSpinner: false
      }
    },
    {
      resolve: 'gatsby-plugin-robots-txt',
      options: {
        host: 'https://lesleylai.info',
        sitemap: 'https://lesleylai.info/sitemap.xml',
        policy: [{ userAgent: '*', allow: '/' }]
      }
    },
    `gatsby-plugin-twitter`
  ]
};
