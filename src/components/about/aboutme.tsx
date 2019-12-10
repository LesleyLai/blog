import { graphql, Link, StaticQuery } from "gatsby";
import Img, { FluidObject } from "gatsby-image";
import * as React from "react";
import { orderBy } from "lodash";

import { Language, translations } from "../../utils/translations";

import { TagItem } from "../../types/tags";

interface AboutMeData {
  portrait: {
    childImageSharp: {
      fluid: FluidObject;
    };
  };
}

interface AboutMeProp extends React.HTMLProps<HTMLDivElement> {
  lang: Language;
  tags: TagItem[];
  postsTotalCount: number;
}

const AboutMe = ({ lang, tags, postsTotalCount }: AboutMeProp) => {
  const helper = (data: AboutMeData) => {
    const currentYear = new Date().getFullYear();

    const css = require("./about.module.css");

    const sortedTags = orderBy(tags, ["totalCount", "id"], ["desc", "asc"]);

    return (
      <nav className={css.about}>
        <Img
          className={css.portrait}
          fluid={data.portrait.childImageSharp.fluid}
          alt="Lesley Lai Protrait"
          fadeIn={false}
        />

        <article>{translations[lang]["about_content"]}</article>

        <h3 className={css.subtitle}>{translations[lang]["elsewhere"]}</h3>
        <ul>
          <li>{translations[lang]["code_at_github"]}</li>
          <li>{translations[lang]["linkedin"]}</li>
          {lang !== "zh" && (
            <>
              <li>
                Shaders on{" "}
                <a href="https://www.shadertoy.com/user/lesleylai">Shadertoy</a>
              </li>
              <li>
                Tweets at <a href="https://twitter.com/LesleyLai6">Twitter</a>
              </li>
            </>
          )}
        </ul>

        <h3 className={css.subtitle}>{translations[lang]["tags"]}</h3>
        <ul className={css.tags}>
          {sortedTags.map((tag: TagItem) => (
            <li key={tag.id} className={css.tagitem}>
              <Link to={`/${lang}/archive/${tag.id}`}>
                {translations[lang][tag.id]}
              </Link>
              <span className={css.postcount}>{tag.totalCount}</span>
            </li>
          ))}
        </ul>
        <p className={css.archive}>
          {translations[lang]["all_n_posts"](postsTotalCount)}
        </p>

        <p className={css.info}>{translations[lang]["build_using_gatsby"]}</p>

        <p className={css.copyright}>
          © 2015-
          {currentYear} {translations[lang]["myname"]}
        </p>
      </nav>
    );
  };

  return (
    <StaticQuery
      query={graphql`
        query AboutMeQuery {
          portrait: file(relativePath: { eq: "imgs/portrait.jpg" }) {
            childImageSharp {
              fluid(maxWidth: 300) {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
      `}
      render={helper}
    />
  );
};

export const query = graphql`
  fragment Tags on MarkdownRemarkConnection {
    tags: group(field: frontmatter___categories) {
      id: fieldValue
      totalCount
    }
  }
`;

export default AboutMe;
