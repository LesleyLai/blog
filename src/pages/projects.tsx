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

const ProjectsPage = () => (
  <div>
    <h1>My projects</h1>
    <ul>
      <Project
        name="Bolder Game Engine"
        url="https://github.com/LesleyLai/Bolder-Game-Engine">
        Bolder Game Engine is an experimental game engine using C++.
      </Project>
      <Project
        name="Bolder Game Engine"
        url="https://github.com/LesleyLai/Bolder-Game-Engine">
        Bolder Game Engine is an experimental game engine using C++.
      </Project>
    </ul>
  </div>
);

export default ProjectsPage;
