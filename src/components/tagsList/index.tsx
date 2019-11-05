import Link from "gatsby-link";
import * as React from "react";
import styled from "styled-components";

import { Color, colors } from "../../utils/colorTable";
import { Tag, tagInfos } from "../../utils/tagInfo";

interface TagsProps {
  tags: string[];
  className?: string;
  exclude?: string;
}

const Li = styled.li`
  display: inline-block;
  line-height: 1;
  margin: 0.5em 0.5em 0.8em 0;
`;

const Ul = styled.ul`
  margin-left: 0;
  margin-bottom: 0;
  font-size: 12px;
`;

const TagsList = (props: TagsProps) => {
  const tags = props.tags;

  return (
    <Ul className={props.className}>
      {tags
        .filter(tag => {
          return tag !== props.exclude;
        })
        .map(tag => {
          const info: Tag = tagInfos[tag];
          const tagName: string = info ? info.en : tag;
          const color: Color = info ? info.color : colors.white;

          const TagBox = styled.span`
            padding: 0.4em 0.5em;
            text-transform: none;
            font-weight: 700;
            border-radius: 0.28571429rem;
            color: ${color.fg};
            background-color: ${color.bg};
            &:hover {
              background-color: ${color.hover};
            }
          `;

          return (
            <Li key={tag}>
              <Link to={`/archive/${tag}/`}>
                <TagBox>{tagName}</TagBox>
              </Link>
            </Li>
          );
        })}
    </Ul>
  );
};

export default TagsList;
