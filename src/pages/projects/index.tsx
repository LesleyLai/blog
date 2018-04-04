import * as React from "react";
import Helmet from "react-helmet";

interface ProjectProps extends React.HTMLProps<HTMLDListElement> {
  name: string;
  url: string;
}

const Project = (prop: ProjectProps) => {
  const css = require("./project.module.css");
  return (
    <div className={css.project}>
      <h3><a href={prop.url} > <b>{prop.name}</b> </a></h3>
      <p>
        {prop.children}
      </p>
    </div>
  )
}

const ProjectsPage = () => {
  const title = "My projects";
  const rayTracerImg = require("./raytracer.png");
  const css = require("./projects.module.css");

  return (<div>
    <Helmet>
      <title>{"Lesley Lai | " + title}</title>
    </Helmet>
    <h1>{title}</h1>
    <ul className={css.projectsList}>
      <Project
        name="Reversi-Elm"
        url="https://github.com/LesleyLai/Reversi-Elm">
        A purely functional implementation of the classic board game Reversi. You can play the game <a href="https://lesleylai.github.io/Reversi-Elm/">here</a>.
        </Project>
      <Project
        name="Ray tracer"
        url="https://github.com/LesleyLai/RayTracer">
        A recursive <a href="https://en.wikipedia.org/wiki/Ray_tracing_(graphics)">ray tracer</a> in C++. It can handle ray-sphere and ray-triangle intersection.
          <img src={rayTracerImg} alt="Ray tracer" />
      </Project>
    </ul>
  </div>
  )
};

export default ProjectsPage;
