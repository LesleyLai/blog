import * as classNames from "classnames";
import Link from "gatsby-link";
import * as React from "react";

import { Color, colors } from "../../utils/colorTable";
import { Tag, tagInfos } from "../../utils/tagInfo";

interface TagsProps {
  tags: string[];
  className?: string;
}

const css = require("./tags-list.module.css");

const TagsList = (props: TagsProps) => {
  const tags = props.tags;

  return (
    <ul className={classNames(props.className, css.tags)}>
      {tags.map((tag, index) => {
        const info: Tag = tagInfos[tag];
        const tagName: string = info ? info.en : tag;
        const color: Color = info ? info.color : colors.white;
        // as={Link} to={`/category/${tag}/`}
        return (
          <li
            key={tag}
            className={css.tag}
            style={{ color: color.fg, backgroundColor: color.bg }}
          >
            {tagName}
          </li>
        );
      })}
    </ul>
  );
};

export default TagsList;
