import * as React from "react";
import styled from "styled-components";
import Link from "gatsby-link";

import { Color, colors } from "../../utils/colorTable";
import { TagID, TagItem } from "../../types/tags";
import { tagInfos } from "../../utils/tagInfo";
import { Language, translations } from "../../utils/translations";

const TagItemWrapper = styled.li`
  margin-bottom: 0.3rem;
`;

const TagBox = styled.span<{ colors: Color }>(
  props => `
    color: ${props.colors.fg};
    background-color: ${props.colors.bg};

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
      background-color: ${props.colors.hover};
    }
`
);

const CountBox = styled.span`
  font-size: 10px;
  margin-left: 5px;
  opacity: 90%;
`;

// If tagId is null, it means "show all"
function buildTag(lang: Language, tag?: TagItem, showCounts?: boolean) {
  const { color, count, tagName } = (() => {
    if (tag && tag.id) {
      const tagId = tag.id;
      const tagInfo = tagInfos[tagId];
      return {
        color: tagInfo.color,
        count: tag.totalCount,
        tagName: translations[lang][tagId],
      };
    } else {
      return {
        color: colors.white,
        count: 0,
        tagName: translations[lang]["showall"],
      };
    }
  })();

  return (
    <TagItemWrapper key={tag?.id}>
      <Link to={tag ? `/${lang}/projects/${tag.id}` : `/${lang}/projects`}>
        <TagBox colors={color}>
          {tagName}
          {showCounts && <CountBox>{count}</CountBox>}
        </TagBox>
      </Link>
    </TagItemWrapper>
  );
}

interface TagsProp {
  lang: Language;
  tags: TagItem[];
  showAll?: boolean;
  showCounts?: boolean;
}

const Ul = styled.ul`
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  margin: 18px 0 0 0;
`;

const ProjectTags = ({ lang, tags, showAll, showCounts }: TagsProp) => {
  if (showCounts) {
    tags = tags.sort((lhs: TagItem, rhs: TagItem) => rhs.totalCount - lhs.totalCount);
    console.log("Sort tags");
  }

  return (
    <Ul>
      {showAll && buildTag(lang)}
      {tags && tags.map(t => buildTag(lang, t, showCounts))}
    </Ul>
  );
};

export default ProjectTags;
