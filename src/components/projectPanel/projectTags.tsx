import * as React from "react";
import styled from "styled-components";
import Link from "gatsby-link";

import { colors } from "../../utils/colorTable";
import { TagID } from "../../types/tags";
import { tagInfos } from "../../utils/tagInfo";
import { translations } from "../../utils/translations";

// If tagId is null, it means "show all"
function buildTag(tagId?: TagID) {
  const { color, tagName } = (() => {
    if (tagId) {
      const tag = tagInfos[tagId];
      return {
        color: tag.color,
        tagName: translations["en"][tagId]
      };
    } else {
      return {
        color: colors.white,
        tagName: translations["en"]["showall"]
      };
    }
  })();

  const TagItem = styled.li`
    margin-bottom: 0.3rem;
  `;

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
    font-size: 11px;

    border-radius: 0.28571429rem;

    &:hover {
      background-color: ${color.hover};
    }
  `;

  return (
    <TagItem key={tagId}>
      <Link to={tagId ? `/projects/${tagId}/en` : `/projects/en`}>
        <TagBox>{tagName}</TagBox>
      </Link>
    </TagItem>
  );
}

interface TagsProp {
  tags: string[];
  showAll?: boolean;
}

const Tags = ({ tags, showAll }: TagsProp) => {
  const Ul = styled.ul`
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    margin: 18px 0 0 0;
  `;

  return (
    <Ul>
      {showAll && buildTag()}
      {tags && tags.map(buildTag)}
    </Ul>
  );
};

export default Tags;
