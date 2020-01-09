const siteMetadata = {
  title: `Lesley Lai's Blog`,
  description: `A personal website and blog for Lesley Lai`,
  siteUrl: `http://www.lesleylai.info`
};

const createFeed = (title, output, lang) => {
  let siteUrl = siteMetadata.siteUrl;
  if (lang !== "en") {
    siteUrl += `/${lang}`;
  }

  return {
    serialize: ({ query: { site, posts } }) => {
      return posts.edges.map(edge => {
        const url = site.siteMetadata.siteUrl + "/"
              + edge.node.frontmatter.lang + "/" + edge.node.frontmatter.id;
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
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        extensions: [`.mdx`, `.md`],
        excerpt_separator: `<!-- end -->`,
        gatsbyRemarkPlugins: [
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
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: "UA-137818218-1"
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
    'gatsby-plugin-robots-txt'
  ]
};
