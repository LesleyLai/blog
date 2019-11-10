import { graphql, Link, StaticQuery } from "gatsby";
import Img, { FluidObject } from "gatsby-image";
import * as React from "react";
import { TagID } from "../../utils/tagInfo";
import { translations } from "../../utils/translations";

interface TagItem {
  id: TagID;
  totalCount: number;
}

interface AboutMeData {
  allMarkdownRemark: {
    group: TagItem[];
  };
  portrait: {
    childImageSharp: {
      fluid: FluidObject;
    };
  };
}

class AboutMe extends React.PureComponent {
  public render() {
    const helper = (data: AboutMeData) => {
      const currentYear = new Date().getFullYear();

      const css = require("./about.module.css");
      return (
        <nav className={css.about}>
          <Img
            className={css.portrait}
            fluid={data.portrait.childImageSharp.fluid}
            alt="Lesley Lai Protrait"
            fadeIn={false}
          />

          <article>
            <p>
              Hi, I am <strong>Lesley Lai</strong>, a Software Engineering
              Intern at <a href="https://www.sketchup.com/">Trimble SketchUp</a>{" "}
              and a Computer Science and Applied Mathematics undergraduate
              student at the{" "}
              <a href="http://www.colorado.edu/">
                {" "}
                University of Colorado at Boulder
              </a>
              .
            </p>
            <p>
              My primary interests include{" "}
              <a href="https://en.wikipedia.org/wiki/Computer_graphics">
                Computer Graphics
              </a>
              {" and "}
              <a href="https://en.wikipedia.org/wiki/Programming_language_theory">
                Programming Language theories
              </a>
              . I love to code in various programming languages, though I am
              particularly fond of <a href="https://isocpp.org/">C++</a>.
            </p>
          </article>

          <h3 className={css.subtitle}>Elsewhere</h3>
          <ul>
            <li>
              Code at <a href="https://github.com/LesleyLai">Github</a>
            </li>
            <li>
              Profile on{" "}
              <a href="https://www.linkedin.com/in/lesley-lai/">LinkedIn</a>
            </li>
            <li>
              Shaders on{" "}
              <a href="https://www.shadertoy.com/user/lesleylai">Shadertoy</a>
            </li>
            <li>
              Tweets at <a href="https://twitter.com/LesleyLai6">Twitter</a>
            </li>
            <li>
              Wikipedia user page at{" "}
              <a href="https://en.wikipedia.org/wiki/User:LesleyLai">here</a>
            </li>
          </ul>

          <h3 className={css.subtitle}>Categories</h3>
          <ul className={css.tags}>
            {data.allMarkdownRemark.group
              .slice()
              .sort(
                (tag1: TagItem, tag2: TagItem) =>
                  tag2.totalCount - tag1.totalCount // Descends by posts counts
              )
              .map((tag: TagItem) => (
                <li key={tag.id} className={css.tagitem}>
                  <Link to={"/archive/" + tag.id + "/en"}>
                    {translations["en"][tag.id]}
                  </Link>
                  <span className={css.postcount}>{tag.totalCount}</span>
                </li>
              ))}
          </ul>
          <p className={css.archive}>
            All{" "}
            <Link to={`archive`}>
              {data.allMarkdownRemark.group.length} posts
            </Link>
          </p>

          <p className={css.info}>
            This blog is built by <a href="https://www.gatsbyjs.org/">Gatsby</a>
            . The source repo for it is{" "}
            <a href="https://github.com/LesleyLai/blog">here</a>.
          </p>

          <p className={css.copyright}>
            © 2015-
            {currentYear} Lesley Lai
          </p>
        </nav>
      );
    };

    return (
      <StaticQuery
        query={graphql`
          query AboutMeQuery {
            site {
              siteMetadata {
                title
              }
            }
            allMarkdownRemark(
              filter: {
                fields: { relativePath: { regex: "/blog/" } }
                frontmatter: { lang: { eq: "en" } }
              }
            ) {
              group(field: frontmatter___categories) {
                id: fieldValue
                totalCount
              }
            }
            portrait: file(relativePath: { eq: "imgs/portrait.jpg" }) {
              childImageSharp {
                fluid(maxWidth: 700) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
          }
        `}
        render={helper}
      />
    );
  }
}

export default AboutMe;
