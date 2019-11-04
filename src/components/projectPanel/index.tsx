import * as React from "react";
import * as ReactTooltip from "react-tooltip";
import { Color, colors } from "../../utils/colorTable";

import Img, { FluidObject } from "gatsby-image";

const PlayIcon = require("react-icons/lib/fa/play");
const GithubIcon = require("react-icons/lib/fa/github");
const LinkIcon = require("react-icons/lib/go/link");

const css = require("./projectPanel.module.css");

interface ProjectPenalProps extends React.HTMLProps<HTMLDListElement> {
  name: string;
  github?: string; // link to github
  website?: string; // link to website
  demo?: string; // link to demo

  // A reference to image
  image?: FluidObject;
  // Prevent the panel to show only part of the image, but the image may not fill the panel this way
  imageContain?: boolean;

  // Year of doing that project
  year: string;
  tags?: string[];
}

interface ProjectTag {
  key: string;
  en: string;
  zh?: string;
  color: Color; // Color of the tag box
}

const tagInfos: { [id: string]: ProjectTag } = {
  cpp: { key: "cpp", en: "C++", color: colors.blue },
  library: { key: "library", en: "Library", color: colors.white },
  graphics: { key: "graphics", en: "Graphics", color: colors.red },
  GI: { key: "gi", en: "Global Illumination", color: colors.yellow },
  GL: { key: "gl", en: "OpenGL", color: colors.teal },
  functional: { key: "fp", en: "Functional", color: colors.black },
  elm: { key: "elm", en: "Elm", color: colors.teal },
  game: { key: "game", en: "Game", color: colors.orange },
  web: { key: "web", en: "Web", color: colors.pink },
  python: { key: "python", en: "Python", color: colors.blue },
  pl: { key: "pl", en: "Programming Language", color: colors.red },
  "type erasure": { key: "type erasure", en: "Type Erasure", color: colors.red }
};

function buildTag(tagId: string) {
  const tag = tagInfos[tagId];
  const color: Color = tag ? tag.color : colors.white;

  return (
    <li className={css.tag} style={{ color: color.fg, background: color.bg }}>
      {tag ? tag.en : tagId}
    </li>
  );
}

const ProjectPanel = (props: ProjectPenalProps) => {
  const tags = props.tags;

  return (
    <article className={css.panel}>
      {props.image && <Img fluid={props.image} />}

      <div className={css.content}>
        <div className={css.title}>
          <h3 className={css.name}>
            {" "}
            {props.name}
            <span className={css.year}> ({props.year})</span>
          </h3>
          <span style={{ flexGrow: 100 }} />

          {props.website && (
            <a href={props.website}>
              <LinkIcon data-tip="Website" size={16} className={css.link} />
              <ReactTooltip place="right" effect="solid" />
            </a>
          )}

          {props.demo && (
            <a href={props.demo}>
              <PlayIcon data-tip="Live demo" size={16} className={css.link} />
              <ReactTooltip place="right" effect="solid" />
            </a>
          )}

          {props.github && (
            <a href={props.github}>
              <GithubIcon
                data-tip="Source repository"
                size={16}
                className={css.link}
              />
              <ReactTooltip place="right" effect="solid" />
            </a>
          )}
        </div>

        <div className={css.description}>{props.children}</div>

        <ul className={css.tags}>{tags && tags.map(buildTag)}</ul>
      </div>
    </article>
  );
};

export default ProjectPanel;
