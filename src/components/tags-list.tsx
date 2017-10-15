import * as React from "react";
import { Icon } from "semantic-ui-react";

const TagsList = ({ tags }) => (
    <span>Topics:{' '}
        {
            tags.map((tag, index) => (
                <span>
                    <a href={`/category/${tag}/`}>
                        <Icon name="tag" />
                        {tag}
                    </a>
                    {index < tags.length - 1 ? ', ' : ''}
                </span>
            ))
        }
    </span>
);

export default TagsList;
