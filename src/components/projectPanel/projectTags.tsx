import * as React from "react";
import styled from "styled-components";
import Link from "gatsby-link";

import { Color, colors } from "../../utils/colorTable";
import { projectsTagInfos } from "../../utils/tagInfo";

function buildTag(tagId: string) {
  const tag = projectsTagInfos[tagId];
  const color: Color = tag ? tag.color : colors.white;

  const TagBox = styled.span`
    color: ${color.fg};
    background-color: ${color.bg};

    display: inline-block;
    line-height: 1;
    margin-right: 0.6em;
    margin-bottom: 0;
    padding: 0.5833em 0.833em;

    text-transform: none;
    font-weight: 700;
    font-size: 12px;

    border-radius: 0.28571429rem;

    opacity: 0.8;

    &:hover {
      background-color: ${color.hover};
    }
  `;

  return (
    <li key={tagId}>
      <Link to={`/projects/${tagId}/`}>
        <TagBox>{tag ? tag.en : tagId}</TagBox>
      </Link>
    </li>
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
