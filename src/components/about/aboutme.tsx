import * as React from "react";
import { Rail } from "semantic-ui-react";

const AboutMe = () => {
  const currentYear = new Date().getFullYear();
  const portrait = require("./portrait.jpg");

  const css = require("./about.module.css");

  return (
    <div className={css.about}>
      <img src={portrait} alt="Lesley Lai Protrait" id={css.portrait} />

      <article>
        <p>
          Hi, I am <strong>Lesley Lai</strong>, a Computer Science undergraduate
          student at the{" "}
          <a href="http://www.colorado.edu/">
            {" "}
            University of Colorado at Boulder
          </a>.
        </p>
        <p>
          My primary interests are{" "}
          <a href="https://en.wikipedia.org/wiki/Computer_graphics">
            Computer Graphics
          </a>{" "}
          and the <a href="https://isocpp.org/">C++</a> programming language.
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

      <p>
        This blog is built by <a href="https://www.gatsbyjs.org/">Gatsby</a>.
        The source repo for it is{" "}
        <a href="https://github.com/LesleyLai/blog">here</a>.
      </p>

      <p className={css.copyright}>©2015-{currentYear} Lesley Lai</p>
    </div>
  );
};

export default AboutMe;
