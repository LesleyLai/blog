import { graphql } from "gatsby";
import * as React from "react";
import Helmet from "react-helmet";

import { TagItem } from "../types/tags";
import Layout from "../components/layout";
import { Language, translations } from "../utils/translations";

interface NotFoundProps {
  data: {
    posts: {
      tags: TagItem[];
      totalCount: number;
    };
  };
  pageContext: { lang: Language };
  location: {
    pathname: string;
  };
}

const NotFoundPage = ({ data, pageContext, location }: NotFoundProps) => {
  const tags = data.posts.tags;
  const lang = pageContext.lang;

  const title = translations[lang]["page_not_found"];

  return (
    <Layout
      location={location}
      tags={tags}
      lang={lang}
      otherLangs={[]}
      postsTotalCount={data.posts.totalCount}
    >
      <div>
        <Helmet>
          <title>{`${title} | ${translations[lang]["title"]}`}</title>
          <meta name="Description" content={title} />
        </Helmet>
        <h1>{title}</h1>
        <p>{translations[lang]["page_not_found_text"]}</p>
        <p>{translations[lang]["return_to_home"]}</p>
      </div>
    </Layout>
  );
};

export default NotFoundPage;

export const query = graphql`
  query notFoundQuery($lang: String!) {
    posts: allMdx(
      filter: {
        fileAbsolutePath: { regex: "//contents/blog//" }
        frontmatter: { lang: { eq: $lang } }
      }
    ) {
      totalCount
      ...Tags
    }
  }
`;
