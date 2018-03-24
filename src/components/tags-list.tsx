import * as React from "react";
import Link from "gatsby-link";
import { Label } from "semantic-ui-react";

interface TagsProps {
  tags: string[]
};

interface Tag {
  en: string
  zh?: string
  color: string // Color of the tag box
}

const tag_infos: { [id: string]: Tag } = {
  "cpp": { en: "C++", color: "red" },
  "cmake": { en: "CMake", color: "green" },
  "test": { en: "Test", zh: "测试", color: "yellow" },
  "resource": { en: "Resource Management", zh: "资源管理", color: "white" }
};

const TagsList = ({ tags }: TagsProps) => {

  const css = require("./tags-list.module.css");

  return (
    <span>
      {
        tags.map((tag, index) => {
          const info: Tag = tag_infos[tag];
          const tag_name: string = info ? info.en : tag;
          const color: string = info ? info.color : "white";
          return (
            <span className={css.tag}>
              <Label
                as={Link}
                to={`/category/${tag}/`}
                size="small"
                color={color}>
                {tag_name}
              </Label>
            </span>
          );
        })
      }
    </span>
  );
}

export default TagsList;
