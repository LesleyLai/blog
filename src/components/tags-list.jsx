import React from 'react';

const TagsList = ({ tags }) => (
    <span>Topics:{' '}
      {
          tags.map((tag,index)=> (
              <span>
                <a href={`/category/${tag}/`}>{tag}</a>
                {index < tags.length - 1 ? ', ' : ''}
              </span>
          ))
      }
  </span>
);

export default TagsList;
