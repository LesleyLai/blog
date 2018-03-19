import * as React from "react";
import * as PropTypes from 'prop-types';
import * as groupBy from 'lodash/groupBy';
import * as last from 'lodash/last';
import Link from 'gatsby-link';

import { rhythm } from "../utils/typography.js";
import TagsList from "./tags-list";

function splitDate(post: { node: Post }) {
  return post.node.frontmatter.create.split(' ');
};


const groupPosts = (posts: { node: Post }[]) => groupBy(posts,
  post => last(splitDate(post)));

const Posts = ({ posts }) => {
  const grouped = groupPosts(posts);
  const years = Object.keys(grouped).sort().reverse();
  return (
    <section>
      {years.map(year => (
        <section key={year}>
          <h2>{year}</h2>
          {grouped[year].map(post => (
            <section style={{ marginBottom: '1rem', }}>
              <h3 style={{ marginBottom: rhythm(1 / 4), }}>
                <Link to={'/' + post.node.frontmatter.id + '/' + post.node.frontmatter.lang + '/'} >
                  {post.node.frontmatter.title}
                </Link>
                <span> — {splitDate(post)[0]} {splitDate(post)[1]}</span>
              </h3>
              <p style={{ marginBottom: '0.3rem', }}>{post.node.excerpt}</p>
              <TagsList tags={post.node.frontmatter.categories} />
            </section>
          ))}
        </section>
      ))}
    </section>
  );
};

export default Posts;
