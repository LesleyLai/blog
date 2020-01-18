import Img, { FluidObject } from "gatsby-image";
import * as React from "react";

import ProjectTags from "./projectTags";
import { Language, translations } from "../../utils/translations";
import { TagID } from "../../types/tags";

import { FaPlay as PlayIcon, FaGithub as GithubIcon } from "react-icons/fa";
import { GoLink as LinkIcon } from "react-icons/go";

interface ProjectPenalProps extends React.HTMLProps<HTMLDListElement> {
  name: string;
  github?: string; // link to github
  website?: string; // link to website
  demo?: string; // link to demo

  // A reference to image
  image?: FluidObject | string;
  // Prevent the panel to show only part of the image, but the image may not fill the panel this way
  imageContain?: boolean;

  lang: Language;

  // Year of doing that project
  year: string;
  tags?: TagID[];
}

function isString(image: FluidObject | string): image is string {
  return typeof image === "string";
}

const ProjectPanel = (props: ProjectPenalProps) => {
  const css = require("./projectPanel.module.css");

  const tags = props.tags.map(tagID => ({
    id: tagID,
    totalCount: 0,
  }));

  return (
    <article className={css.panel}>
      <div className={css.content}>
        <div className={css.title}>
          <h2 className={css.name}>
            {" "}
            {props.name}
            <span className={css.year}> ({props.year})</span>
          </h2>
          <span style={{ flexGrow: 100 }} />
        </div>

        <div>{props.children}</div>

        <ul className={css.links}>
          {props.website && (
            <li>
              <LinkIcon className={css.icon} data-tip="Website" size={20} />
              <a href={props.website}>
                <span>{translations[props.lang]["website"]}</span>
              </a>
            </li>
          )}

          {props.demo && (
            <li>
              <PlayIcon className={css.icon} data-tip="Live demo" size={20} />
              <a href={props.demo}>
                <span>Web App</span>
              </a>
            </li>
          )}

          {props.github && (
            <li>
              <GithubIcon className={css.icon} data-tip="Source repository" size={20} />
              <a href={props.github}>
                <span>Github</span>
              </a>
            </li>
          )}
        </ul>

        <ProjectTags tags={tags} lang={props.lang} />
      </div>

      <span style={{ flexGrow: 100 }} />

      {props.image &&
        (isString(props.image) ? (
          <img src={props.image} className={css.image} />
        ) : (
          <Img fluid={props.image} className={css.image} />
        ))}
    </article>
  );
};

export default ProjectPanel;
