import * as React from "react";

const GithubIcon = require("react-icons/lib/fa/github");
const LinkIcon = require("react-icons/lib/go/link");

const css = require("./projectPanel.module.css");

interface ProjectPenalProps extends React.HTMLProps<HTMLDListElement> {
  name: string;
  github?: URL;
  link?: URL;

  // A reference to image
  image?: string;
  // Prevent the panel to show only part of the image, but the image may not fill the panel this way
  imageContain?: boolean;

  // Year of doing that project
  year: string;
  tags?: string[];
}

const ProjectPanel = (props: ProjectPenalProps) => {
  return (
    <article className={css.panel}>
      <img src={props.image} alt={props.name} className={css.image} />

      <div className={css.content}>
        <div className={css.title}>
          <h3 className={css.name}> {props.name} </h3>
          <span className={css.year}> ({props.year})</span>

          <span style={{ flexGrow: 100 }} />

          {props.github && (
            <a href={props.github.toString()}>
              <GithubIcon size={16} className={css.link} />
            </a>
          )}

          {props.link && (
            <a href={props.link.toString()}>
              <LinkIcon size={16} className={css.link} />
            </a>
          )}
        </div>

        {props.children}
      </div>
    </article>
  );
};

export default ProjectPanel;
