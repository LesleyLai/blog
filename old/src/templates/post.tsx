import { graphql } from "gatsby";
import React, { useEffect } from "react";
import { MDXRenderer } from "gatsby-plugin-mdx";
import PrevNextLinks from "../components/prevnextlinks";
import Socials from "../components/socials";
import Layout from "../components/layout";
import TagsList from "../components/tagsList";

import SEO from "../components/seo";

import { TagID, TagItem } from "../types/tags";
import { Language, translations } from "../utils/translations";

const css = require("./post.module.css");
require(`katex/dist/katex.min.css`);

export interface PostData {
  body: string;
  frontmatter: {
    id: string;
    lang: Language;
    title: string;
    create: string;
    lastModify: string;
    categories: TagID[];
  };
  excerpt: string;
}

interface PostTitleInfo {
  frontmatter: {
    title: string;
  };
}

interface PostProps {
  pageContext: {
    previousId?: string;
    nextId?: string;
  };
  data: {
    site: {
      siteMetadata: {
        siteUrl: string;
      };
    };
    post: PostData;
    prevPost: PostTitleInfo;
    nextPost: PostTitleInfo;
    otherLangs: {
      edges: Array<{
        node: {
          frontmatter: {
            lang: Language;
          };
        };
      }>;
    };
    allPosts: {
      totalCount: number;
      tags: TagItem[];
    };
  };
}

// Helper to add scripts to our page
const insertScript = (src: string, id: string, parentElement: HTMLElement) => {
  const script = window.document.createElement("script");
  script.async = true;
  script.src = src;
  script.id = id;
  parentElement.appendChild(script);
  return script;
};
// Helper to remove scripts from our page
const removeScript = (id: string, parentElement: HTMLElement) => {
  const script = window.document.getElementById(id);
  if (script) {
    parentElement.removeChild(script);
  }
};
// The actual component
const Commento = ({ id }: { id: string }) => {
  useEffect(() => {
    // If there's no window there's nothing to do for us
    if (!window) {
      return;
    }
    const document = window.document;
    // In case our #commento container exists we can add our commento script
    if (document.getElementById("commento")) {
      insertScript(`https://cdn.commento.io/js/commento.js`, `commento-script`, document.body);
    }
    // Cleanup; remove the script from the page
    return () => removeScript(`commento-script`, document.body);
  }, [id]);

  return <div id={`commento`} />;
};

class PostTemplate extends React.Component<PostProps> {
  public handleNewComment() {
    /* noop now */
  }

  public render() {
    const data = this.props.data;
    const post = data.post;
    const lang = post.frontmatter.lang;
    const path = "/" + lang + "/" + post.frontmatter.id;

    const tags = data.allPosts.tags;
    const postsTotalCount = data.allPosts.totalCount;

    const otherLangs = data.otherLangs.edges.map(edge => edge.node.frontmatter.lang);

    const create = post.frontmatter.create;
    const lastModify = post.frontmatter.lastModify;

    const absolutePath = data.site.siteMetadata.siteUrl + path;

    const previousId = this.props.pageContext.previousId;
    const nextId = this.props.pageContext.nextId;

    const previousInfo = previousId
      ? { id: previousId, title: data.prevPost.frontmatter.title }
      : null;
    const nextInfo = nextId ? { id: nextId, title: data.nextPost.frontmatter.title } : null;

    return (
      <Layout
        location={{ pathname: path }}
        lang={lang}
        otherLangs={otherLangs}
        tags={tags}
        postsTotalCount={postsTotalCount}
      >
        <div className={css.post}>
          <SEO
            title={post.frontmatter.title}
            lang={lang}
            description={post.excerpt}
            path={path}
            ogType="article"
          />
          <h1 className={css.title}>{post.frontmatter.title}</h1>
          <div className={css.info}>
            <span className={css.date}>
              {create !== lastModify && `${translations[lang]["lastModify"]}: ${lastModify} | `}
              {`${translations[lang]["create"]}: ${create}`}
            </span>
            <TagsList lang={lang} tags={post.frontmatter.categories} className={css.tags} />
          </div>
          <MDXRenderer>{post.body}</MDXRenderer>

          <Socials
            lang={lang}
            shareInfo={{
              title: post.frontmatter.title,
              url: absolutePath,
            }}
          />

          <PrevNextLinks lang={lang} previousInfo={previousInfo} nextInfo={nextInfo} />

          <div className={css.comment}>
            <Commento id={path} />
          </div>
        </div>
      </Layout>
    );
  }
}

export default PostTemplate;

export const query = graphql`
  query BlogPostQuery(
    $id: String!
    $lang: String!
    $dateLocale: String!
    $previousId: String
    $nextId: String
  ) {
    site {
      siteMetadata {
        siteUrl
      }
    }
    post: mdx(frontmatter: { id: { eq: $id }, lang: { eq: $lang } }) {
      body
      frontmatter {
        id
        lang
        title
        create(formatString: "LL", locale: $dateLocale)
        lastModify(formatString: "LL", locale: $dateLocale)
        categories
      }
      excerpt(pruneLength: 200)
    }
    otherLangs: allMdx(filter: { frontmatter: { id: { eq: $id }, lang: { ne: $lang } } }) {
      edges {
        node {
          frontmatter {
            lang
          }
        }
      }
    }
    allPosts: allMdx(
      filter: {
        fileAbsolutePath: { regex: "//contents/blog//" }
        frontmatter: { lang: { eq: $lang } }
      }
    ) {
      totalCount
      ...Tags
    }
    prevPost: mdx(frontmatter: { id: { eq: $previousId }, lang: { eq: $lang } }) {
      frontmatter {
        title
      }
    }
    nextPost: mdx(frontmatter: { id: { eq: $nextId }, lang: { eq: $lang } }) {
      frontmatter {
        title
      }
    }
  }
`;
