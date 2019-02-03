import { graphql, Link, StaticQuery } from "gatsby";
import * as React from "react";
import { tagInfos } from "../../utils/tagInfo";

interface TagItem {
  fieldValue: string;
  totalCount: number;
}

interface TagsData {
  allMarkdownRemark: {
    group: TagItem[];
  };
}

class AboutMe extends React.PureComponent {
  public render() {
    const helper = (data: TagsData) => {
      const currentYear = new Date().getFullYear();
      const portrait = require("./portrait.jpg");

      const css = require("./about.module.css");
      return (
        <nav className={css.about}>
          <img src={portrait} alt="Lesley Lai Protrait" id={css.portrait} />

          <article>
            <p>
              Hi, I am <strong>Lesley Lai</strong>, a Computer Science
              undergraduate student at the{" "}
              <a href="http://www.colorado.edu/">
                {" "}
                University of Colorado at Boulder
              </a>
            </p>
            <p>
              My primary interests are{" "}
              <a href="https://en.wikipedia.org/wiki/Computer_graphics">
                Computer Graphics
              </a>{" "}
              and the <a href="https://isocpp.org/">C++</a> programming
              language.
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
          </ul>

          <h3 className={css.subtitle}>Categories</h3>
          <ul>
            {data.allMarkdownRemark.group
              .sort(
                (tag1: TagItem, tag2: TagItem) =>
                  tag2.totalCount - tag1.totalCount // Descends by posts counts
              )
              .map((tag: TagItem) => (
                <li key={tag.fieldValue} className={css.tagitem}>
                  <Link to={"/tags/" + tag.fieldValue}>
                    {tagInfos[tag.fieldValue].en}
                  </Link>
                  <span className={css.postcount}>{tag.totalCount}</span>
                </li>
              ))}
          </ul>

          <p>
            This blog is built by <a href="https://www.gatsbyjs.org/">Gatsby</a>
            . The source repo for it is{" "}
            <a href="https://github.com/LesleyLai/blog">here</a>.
          </p>

          <p className={css.copyright}>
            ©2015-
            {currentYear} Lesley Lai
          </p>
        </nav>
      );
    };

    return (
      <StaticQuery
        query={graphql`
          query tagsQuery {
            site {
              siteMetadata {
                title
              }
            }
            allMarkdownRemark(filter: { frontmatter: { lang: { eq: "en" } } }) {
              group(field: frontmatter___categories) {
                fieldValue
                totalCount
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
