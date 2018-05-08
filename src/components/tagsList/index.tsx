import Link from "gatsby-link";
import * as React from "react";

import * as classNames from "classnames";

interface TagsProps {
  tags: string[];
  className?: string;
}

interface TagColor {
  bg: string;
  fg: string;
}

interface Tag {
  en: string;
  zh?: string;
  color: TagColor; // Color of the tag box
}

/*
 * A table that transfer from color string to actual color
 */
const colorTable: { [key: string]: TagColor } = {
  red: { bg: "#db2828", fg: "#fff" },
  green: { bg: "#21ba45", fg: "#fff" },
  orange: { bg: "#fbbd08", fg: "#fff" },
  white: { bg: "#e8e8e8", fg: "rgba(0,0,0,.6)" }
};

const tagInfos: { [id: string]: Tag } = {
  cpp: { en: "C++", color: colorTable.red },
  cmake: { en: "CMake", color: colorTable.green },
  test: { en: "Test", zh: "测试", color: colorTable.orange },
  resource: {
    en: "Resource Management",
    zh: "资源管理",
    color: colorTable.white
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
        const color: TagColor = info ? info.color : colorTable.white;
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
