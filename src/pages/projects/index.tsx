import * as React from "react";
import Helmet from "react-helmet";

import Layout from "../../components/layout";
import ProjectPanel from "../../components/projectPanel";

interface ProjectsPageProps {
  location: {
    pathname: string;
  };
}

const ProjectsPage = (props: ProjectsPageProps) => {
  const title = "My projects";
  const css = require("./projects.module.css");

  const reversiImage = require("./reversi.png");
  const raytracerImage = require("./raytracer.png");
  const pathTracingImage = require("./pathtracing.png");
  const tetrisImage = require("./tetris.png");
  const grassImage = require("./grass.gif");

  return (
    <Layout location={props.location}>
      <div>
        <Helmet>
          <title>{"Lesley Lai | " + title}</title>
        </Helmet>
        <h1>{title}</h1>
        <h2>Graphics</h2>
        <ul className={css.projectsList}>
          <ProjectPanel
            name="OpenGL Grass Renderer"
            github="https://github.com/LesleyLai/GLGrassRenderer"
            image={grassImage}
            year="2019"
            tags={["cpp", "graphics", "GL"]}
          >
            This project is my implementation of the paper{" "}
            <a href="https://www.cg.tuwien.ac.at/research/publications/2017/JAHRMANN-2017-RRTG/JAHRMANN-2017-RRTG-draft.pdf">
              Responsive Real-Time Grass Rendering for General 3D Scenes
            </a>
            . This project uses a combination of compute and tessellation
            shaders.
          </ProjectPanel>

          <ProjectPanel
            name="Path Tracer"
            github="https://github.com/LesleyLai/Bolder-Render-Engine"
            image={pathTracingImage}
            year="2018"
            tags={["cpp", "graphics", "GI"]}
          >
            A Monte-Carlo Method based path tracing program for my own learning
            purpose. It is loosely based on Peter Shirley's{" "}
            <a href="http://in1weekend.blogspot.lt/">
              Ray Tracing in One Weekend
            </a>{" "}
            mini book and its sequels.
          </ProjectPanel>

          <ProjectPanel
            name="Ray tracer"
            github="https://github.com/LesleyLai/RayTracer"
            image={raytracerImage}
            year="2016"
            tags={["cpp", "graphics"]}
          >
            This is a toy{" "}
            <a href="https://en.wikipedia.org/wiki/Ray_tracing_(graphics)">
              ray tracer
            </a>{" "}
            for the Edx's{" "}
            <a href="https://www.edx.org/course/computer-graphics-uc-san-diegox-cse167x-3">
              Computer Graphics
            </a>{" "}
            Course. It can handle ray-sphere and ray-triangle intersection.
          </ProjectPanel>
        </ul>
        <h2>Programming languages</h2>
        <ul className={css.projectsList}>
          <ProjectPanel
            name="Embedded ML"
            github="https://github.com/LesleyLai/eml"
            year="2018"
            tags={["cpp", "pl", "functional"]}
          >
            Embedded ML is a static-typed scripting language. This project
            includes a compiler and a bytecode interpreter runtime.
          </ProjectPanel>
        </ul>
        <h2>Libraries</h2>
        <ul className={css.projectsList}>
          <ProjectPanel
            name="elm-grid"
            github="https://github.com/LesleyLai/elm-grid"
            year="2019"
            tags={["elm", "library", "functional"]}
          >
            A 2 dimensional Grid library in Elm.
          </ProjectPanel>
        </ul>

        <h2>Games</h2>
        <ul className={css.projectsList}>
          <ProjectPanel
            name="Reversi-Elm"
            github="https://github.com/LesleyLai/Reversi-Elm"
            link="https://lesleylai.github.io/Reversi-Elm/"
            image={reversiImage}
            year="2018"
            tags={["elm", "game", "web", "functional"]}
          >
            A browser based clone of the classic board game Reversi.
          </ProjectPanel>

          <ProjectPanel
            name="Tetris"
            github="https://github.com/LesleyLai/Tetris"
            image={tetrisImage}
            imageContain
            year="2017"
            tags={["python", "game", "GUI"]}
          >
            A simple Tetris clone in Python and{" "}
            <a href="https://en.wikipedia.org/wiki/Tk_(software)">Tk</a>{" "}
            library.
          </ProjectPanel>
        </ul>
      </div>
    </Layout>
  );
};

export default ProjectsPage;
