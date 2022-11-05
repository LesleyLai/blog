import React from "react";

import { Language, translations } from "../utils/translations";

import { Helmet } from "react-helmet";
import { useStaticQuery, graphql } from "gatsby";

type OGType = "website" | "article";

interface SEOProps {
  title: string;
  description?: string;
  path: string;
  lang: Language;
  ogType?: OGType;
}

const query = graphql`
  query SEO {
    site {
      siteMetadata {
        siteUrl
      }
    }
  }
`;

const SEO = ({ title, description, path, lang, ogType = "website" }: SEOProps) => {
  const { site } = useStaticQuery(query);

  const seo = {
    title: `${title} | ${translations[lang]["title"]}`,
    description: description,
    url: site.siteMetadata.siteUrl + path,
    ogType: ogType,
  };

  return (
    <Helmet title={seo.title}>
      {seo.description && <meta name="description" content={seo.description} />}
      <meta property="og:type" content={seo.ogType} />
      <meta property="og:title" content={seo.title} />
      <meta property="og:url" content={seo.url} />
      {seo.description && <meta property="og:description" content={seo.description} />}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content="@LesleyLai6" />
      <meta name="twitter:title" content={seo.title} />
      {seo.description && <meta name="twitter:description" content={seo.description} />}
    </Helmet>
  );
};

export default SEO;
