import * as classNames from "classnames";
import Link from "gatsby-link";
import * as React from "react";

import { Color, colors } from "../../utils/colorTable";

interface TagsProps {
  tags: string[];
  className?: string;
}

interface Tag {
  en: string;
  zh?: string;
  color: Color; // Color of the tag box
}

const tagInfos: { [id: string]: Tag } = {
  cpp: { en: "C++", color: colors.red },
  cmake: { en: "CMake", color: colors.green },
  test: { en: "Test", zh: "测试", color: colors.orange },
  resource: {
    en: "Resource Management",
    zh: "资源管理",
    color: colors.white
  }
};

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
