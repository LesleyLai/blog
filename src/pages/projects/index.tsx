import * as React from "react";
import Helmet from "react-helmet";

import ProjectPanel from "../../components/projectPanel";

const ProjectsPage = () => {
  const title = "My projects";
  const css = require("./projects.module.css");

  return (
    <div>
      <Helmet>
        <title>{"Lesley Lai | " + title}</title>
      </Helmet>
      <h1>{title}</h1>
      <ul className={css.projectsList}>
        <ProjectPanel
          name="Reversi-Elm"
          url="https://github.com/LesleyLai/Reversi-Elm"
          image="./reversi.png"
        >
          A purely functional implementation of the classic board game Reversi.
          You can play the game{" "}
          <a href="https://lesleylai.github.io/Reversi-Elm/">here</a>.
        </ProjectPanel>
        <ProjectPanel
          name="Ray tracer"
          url="https://github.com/LesleyLai/RayTracer"
          image="./raytracer.png"
        >
          A recursive{" "}
          <a href="https://en.wikipedia.org/wiki/Ray_tracing_(graphics)">
            ray tracer
          </a>{" "}
          in C++. It can handle ray-sphere and ray-triangle intersection.
        </ProjectPanel>
      </ul>
    </div>
  );
};

export default ProjectsPage;
