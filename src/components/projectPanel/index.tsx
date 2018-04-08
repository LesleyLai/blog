import * as React from "react";

const css = require("./projectPanel.module.css");

interface ProjectPenalProps extends React.HTMLProps<HTMLDListElement> {
  name: string;
  url: string;
  image?: string;
}

const ProjectPanel = (props: ProjectPenalProps) => {
  return (
    <article className={css.panel}>
      <ProjectPanelHeader url={props.url} image={props.image} />

      <div className={css.content}>
        <h3>
          <a className={css.name} href={props.url}>
            {props.name}
          </a>
        </h3>
        {props.children}
      </div>
    </article>
  );
};

// Header of the project panel (an image of the project or empty)
interface HeaderProps extends React.HTMLProps<HTMLDListElement> {
  url: string;
  image?: string;
}

const ProjectPanelHeader = (props: HeaderProps) => {
  const headerBg = (function() {
    if (props.image) {
      const image: string = props.image;
      return {
        backgroundImage: `url(${image})`,
        backgroundPosition: "center",
        backgroundSize: "cover"
      };
    } else {
      return {};
    }
  })();

  return <a href={props.url} className={css.header} style={headerBg} />;
};

export default ProjectPanel;
