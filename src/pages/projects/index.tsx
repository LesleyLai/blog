import * as React from "react";
import Helmet from "react-helmet";

import ProjectPanel from "../../components/projectPanel";

const ProjectsPage = () => {
  const title = "My projects";
  const css = require("./projects.module.css");

  const reversiImage = require("./reversi.png");
  const raytracerImage = require("./raytracer.png");
  const pathTracingImage = require("./pathtracing.png");
  const tetrisImage = require("./tetris.png");

  return (
    <div>
      <Helmet>
        <title>{"Lesley Lai | " + title}</title>
      </Helmet>
      <h1>{title}</h1>
      <ul className={css.projectsList}>
        <ProjectPanel
          name="Path tracer"
          github={new URL("https://github.com/LesleyLai/PathTracer")}
          image={pathTracingImage}
          year="2018"
        >
          A Monte-Carlo method based path tracing program for my own learning
          purpose. Loosely based on Peter Shirley's{" "}
          <a href="http://in1weekend.blogspot.lt/">
            Ray Tracing in One Weekend
          </a>{" "}
          mini book and its sequels.
        </ProjectPanel>

        <ProjectPanel
          name="Reversi-Elm"
          github={new URL("https://github.com/LesleyLai/Reversi-Elm")}
          link={new URL("https://lesleylai.github.io/Reversi-Elm/")}
          image={reversiImage}
          year="2018"
        >
          A browser based clone of the classic board game Reversi.
        </ProjectPanel>

        <ProjectPanel
          name="Tetris"
          github={new URL("https://github.com/LesleyLai/Tetris")}
          image={tetrisImage}
          imageContain
          year="2017"
        >
          A simple Tetris clone in Python and{" "}
          <a href="https://en.wikipedia.org/wiki/Tk_(software)">Tk</a> library.
        </ProjectPanel>

        <ProjectPanel
          name="Ray tracer"
          github={new URL("https://github.com/LesleyLai/RayTracer")}
          image={raytracerImage}
          year="2016"
        >
          This is a toy{" "}
          <a href="https://en.wikipedia.org/wiki/Ray_tracing_(graphics)">
            ray tracer
          </a>{" "}
          in C++ for the Edx's{" "}
          <a href="https://www.edx.org/course/computer-graphics-uc-san-diegox-cse167x-3">
            Computer Graphics
          </a>{" "}
          Course. It can handle ray-sphere and ray-triangle intersection.
        </ProjectPanel>
      </ul>
    </div>
  );
};

export default ProjectsPage;
