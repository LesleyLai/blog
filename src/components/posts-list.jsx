import React from 'react';
import PropTypes from 'prop-types';
import groupBy from 'lodash/groupBy';
import last from 'lodash/last';

import { rhythm } from "../utils/typography";
import TagsList from "./tags-list.jsx";

const groupPosts = posts => groupBy(posts,
                                   post => last(post.node.frontmatter.create.split(' ')));

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
                    <span> — {post.node.frontmatter.create}</span>
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
