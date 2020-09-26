import Link from "gatsby-link";
import * as React from "react";
import styled from "styled-components";

import { Language, translations } from "../../utils/translations";
import { TagID } from "../../types/tags";
import { tagInfos } from "../../utils/tagInfo";
import { Color } from "../../utils/colorTable";

interface TagsProps {
  lang: Language;
  tags: TagID[];
  className?: string;
  exclude?: string;
}

const Li = styled.li`
  display: inline-block;
  margin: 0.2em 0.5em 0.2em 0;
`;

const Ul = styled.ul`
  margin-left: 0;
  margin-bottom: 0;
  font-size: 12px;
`;

const TagBox = styled.span<{ colors: Color }>(
  props => `
            padding: 0.4em 0.5em;
            text-transform: none;
            font-weight: 700;
            font-size: 10px;
            border-radius: 0.28571429rem;
            color: ${props.colors.fg};
            background-color: ${props.colors.bg};
            &:hover {
              background-color: ${props.colors.hover};
            }
`
);

const TagsList = (props: TagsProps) => {
  const tags = props.tags;
  const lang = props.lang;

  return (
    <Ul className={props.className}>
      {tags
        .filter(tag => tag !== props.exclude)
        .map(tag => (
          <Li key={tag}>
            <Link to={`/${lang}/archive/${tag}`}>
              <TagBox colors={tagInfos[tag].color}>
                {translations[lang][tag]}
              </TagBox>
            </Link>
          </Li>
        ))}
    </Ul>
  );
};

export default TagsList;
