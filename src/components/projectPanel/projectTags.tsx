import * as React from "react";
import styled from "styled-components";

import { Color, colors } from "../../utils/colorTable";

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
  GL: { key: "gl", en: "OpenGL", color: colors.teal },
  functional: { key: "fp", en: "Functional Programming", color: colors.black },
  elm: { key: "elm", en: "Elm", color: colors.teal },
  game: { key: "game", en: "Game", color: colors.orange },
  opengl: { key: "opengl", en: "OpenGL", color: colors.typescript },
  python: { key: "python", en: "Python", color: colors.blue },
  pl: { key: "pl", en: "Programming Language", color: colors.red },
  react: { key: "react", en: "React", color: colors.react },
  rt: { key: "rt", en: "Ray tracing", color: colors.yellow },
  typescript: { key: "typescript", en: "Typescript", color: colors.typescript },
  web: { key: "web", en: "Web", color: colors.pink }
};

function buildTag(tagId: string) {
  const tag = tagInfos[tagId];
  const color: Color = tag ? tag.color : colors.white;

  const Tag = styled.li`
    color: ${color.fg};
    background-color: ${color.bg};

    display: inline-block;
    line-height: 1;
    margin-right: 0.6em;
    margin-bottom: 0;
    padding: 0.5833em 0.833em;

    background-color: #e8e8e8;
    padding: 0.5833em 0.833em;
    color: rgba(0, 0, 0, 0.6);

    text-transform: none;
    font-weight: 700;
    font-size: 10px;

    border-radius: 0.28571429rem;

    opacity: 0.8;
  `;

  return (
    <Tag key={tagId} style={{ color: color.fg, background: color.bg }}>
      {tag ? tag.en : tagId}
    </Tag>
  );
}

interface TagsProp {
  tags: string[];
}

const Tags = ({ tags }: TagsProp) => {
  const Ul = styled.ul`
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    margin: 18px 0 0 0;
  `;

  return <Ul>{tags && tags.map(buildTag)}</Ul>;
};

export default Tags;
