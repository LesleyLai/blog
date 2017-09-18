import React from 'react';
import PropTypes from 'prop-types';
import groupBy from 'lodash/groupBy';
import last from 'lodash/last';

import { rhythm } from "../utils/typography";
import TagsList from "./tags-list.jsx";

function splitDate(post) {
    return post.node.frontmatter.create.split(' ');
};

const groupPosts = posts => groupBy(posts,
                                   post => last(splitDate(post)));

const Posts = ({posts}) => {
    console.log(posts);
    const grouped = groupPosts(posts);
    const years = Object.keys(grouped).sort().reverse();
    return (
        <section>
          {years.map(year => (
              <section key={year}>
                <h2>{year}</h2>
                {grouped[year].map(post => (
                  <section style={{marginBottom: '1rem',}}>
                  <h3 marginBottom={rhythm(1 / 4)} style={{marginBottom: '0.3rem',}}>
                    {post.node.frontmatter.title}
                    <span> — {splitDate(post)[0]} {splitDate(post)[1]}</span>
                  </h3>
                  <p style={{marginBottom: '0.3rem',}}>{post.node.excerpt}</p>
                  <TagsList tags={post.node.frontmatter.categories} />
                  </section>
                ))}
              </section>
          ))}
        </section>
    );
};

export default Posts;
