import * as React from "react";
import { Label } from "semantic-ui-react";

interface TagsProps {
  tags: string[]
};

interface Tag {
  en: string
  zh?: string
  color: string // Color of the tag box
}

interface TagMap {
  [id: string]: Tag;
}

const tag_infos: TagMap = {
  "cpp": { en: "C++", color: "red" },
  "cmake": { en: "CMake", color: "green" },
  "test": { en: "Test", zh: "测试", color: "yellow" },
  "resource": { en: "Resource Management", zh: "资源管理", color: "white" }
};

const TagsList = ({ tags }: TagsProps) => {

  return (
    <p>Topics:{' '}
      {
        tags.map((tag, index) => {
          const info: Tag = tag_infos[tag];
          const tag_name: string = info ? info.en : tag;
          const color: string = info ? info.color : "white";
          return (
            <span>
              <Label as='a'
                href={`/category/${tag}/`}
                tag
                size="mini"
                color={color}>
                {tag_name}
              </Label>
            </span>
          );
        })
      }
    </p>
  );
}

export default TagsList;
