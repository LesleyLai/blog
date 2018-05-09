import * as React from "react";

const css = require("./projectPanel.module.css");

interface ProjectPenalProps extends React.HTMLProps<HTMLDListElement> {
  name: string;
  url: string;

  // A reference to image
  image?: string;
  // Prevent the panel to show only part of the image, but the image may not fill the panel this way
  imageContain?: boolean;

  // Year of doing that project
  year: string;
}

const ProjectPanel = (props: ProjectPenalProps) => {
  return (
    <article className={css.panel}>
      <ProjectPanelHeader
        url={props.url}
        image={props.image}
        imageContain={props.imageContain}
      />

      <div className={css.content}>
        <h3>
          <a className={css.name} href={props.url}>
            {props.name}
          </a>{" "}
          ({props.year})
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
  imageContain?: boolean;
}

const ProjectPanelHeader = (props: HeaderProps) => {
  const headerBg = (function() {
    if (props.image) {
      const image: string = props.image;
      return {
        backgroundImage: `url(${image})`,
        backgroundPosition: "center",
        backgroundSize: props.imageContain ? "contain" : "cover",
        backgroundRepeat: "no-repeat"
      };
    } else {
      return {};
    }
  })();

  return <a href={props.url} className={css.header} style={headerBg} />;
};

export default ProjectPanel;
