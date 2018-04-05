import * as React from "react";

interface ProjectPenalProps extends React.HTMLProps<HTMLDListElement> {
  name: string;
  url: string;
  image?: string;
}

const ProjectPanel = (prop: ProjectPenalProps) => {
  const css = require("./projectPanel.module.css");
  const image = require(prop.image);
  return (
    <article className={css.panel}>
      <div className={css.header}
        style={{ backgroundImage: `url(${image})`, backgroundPosition: "center" }} />
      <div className={css.content} >
        <h3><a className={css.name} href={prop.url}>{prop.name}</a></h3 >
        {prop.children}
      </div>

    </article>
  )
}

export default ProjectPanel;
