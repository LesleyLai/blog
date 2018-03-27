import * as React from "react";

interface ProjectProps extends React.HTMLProps<HTMLDListElement> {
  name: string;
  url: string;
}

const Project = (prop: ProjectProps) => {
  return (
    <li>
      <a href={prop.url} > <b>{prop.name}</b> </a>
      <p>
        {prop.children}
      </p>
    </li>
  )
}

const ProjectsPage = () => {
  const rayTracerImg = require("./raytracer.png")

  return (<div>
    <h1>My projects</h1>
    <ul>
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
