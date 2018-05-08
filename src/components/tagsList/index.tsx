import Link from "gatsby-link";
import * as React from "react";
import { Label } from "semantic-ui-react";

interface TagsProps {
  tags: string[];
  className: string;
  tagSize?: string;
}

interface Tag {
  en: string;
  zh?: string;
  color: string; // Color of the tag box
}

const tagInfos: { [id: string]: Tag } = {
  cpp: { en: "C++", color: "red" },
  cmake: { en: "CMake", color: "green" },
  test: { en: "Test", zh: "测试", color: "yellow" },
  resource: { en: "Resource Management", zh: "资源管理", color: "white" }
};

const TagsList = (props: TagsProps) => {
  const tags = props.tags;
  const css = require("./tags-list.module.css");
  const tagSize = props.tagSize ? props.tagSize : "small";

  return (
    <ul className={props.className + " " + css.tags}>
      {tags.map((tag, index) => {
        const info: Tag = tagInfos[tag];
        const tagName: string = info ? info.en : tag;
        const color: string = info ? info.color : "white";
        // as={Link} to={`/category/${tag}/`}
        return (
          <Label
            key={tag}
            as="li"
            className={css.tag}
            size={tagSize}
            color={color}
          >
            {tagName}
          </Label>
        );
      })}
    </ul>
  );
};

export default TagsList;
