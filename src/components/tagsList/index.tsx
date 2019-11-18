import Link from "gatsby-link";
import * as React from "react";
import styled from "styled-components";

import { Language, translations } from "../../utils/translations";
import { TagID } from "../../types/tags";
import { tagInfos } from "../../utils/tagInfo";

interface TagsProps {
  lang: Language;
  tags: TagID[];
  className?: string;
  exclude?: string;
}

const Li = styled.li`
  display: inline-block;
  line-height: 1;
  margin: 0.2em 0.5em 0.2em 0;
`;

const Ul = styled.ul`
  margin-left: 0;
  margin-bottom: 0;
  font-size: 12px;
`;

const TagsList = (props: TagsProps) => {
  const tags = props.tags;
  const lang = props.lang;

  return (
    <Ul className={props.className}>
      {tags
        .filter(tag => {
          return tag !== props.exclude;
        })
        .map(tag => {
          const tagName = translations[lang][tag];
          const color = tagInfos[tag].color;

          const TagBox = styled.span`
            padding: 0.4em 0.5em;
            text-transform: none;
            font-weight: 700;
            font-size: 10px;
            border-radius: 0.28571429rem;
            color: ${color.fg};
            background-color: ${color.bg};
            &:hover {
              background-color: ${color.hover};
            }
          `;

          return (
            <Li key={tag}>
              <Link to={`/archive/${tag}/${lang}`}>
                <TagBox>{tagName}</TagBox>
              </Link>
            </Li>
          );
        })}
    </Ul>
  );
};

export default TagsList;
