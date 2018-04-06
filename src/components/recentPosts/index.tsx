import Link from 'gatsby-link';
import * as React from "react";

import { Button, Icon } from 'semantic-ui-react';
import TagsList from "../tagsList";

export interface PostMeta {
  frontmatter: {
    id: number,
    title: string,
    lang: string,
    create: string,
    categories: string[]
  },
  excerpt: string
};


export default class RecentPosts extends React.Component {
  public props: { posts: PostMeta[] }

  public render() {
    const posts = this.props.posts;

    const style = require("./recentPosts.module.css");
    console.log(style.post);

    return (
      <div>
        {posts.map(post =>
          <article className={style.post}>
            <h3 className={style.header}>
              {post.frontmatter.title}
            </h3>
            <span className={style.date}>{post.frontmatter.create}</span>
            <TagsList tags={post.frontmatter.categories} />
            <p className={style.excerpt}>{post.excerpt}</p>
            <Button as={Link} basic color="black"
              to={'/' + post.frontmatter.id + '/' + post.frontmatter.lang + '/'}
            >
              READ MORE
            </Button>
          </article>
        )
        }
      </div>
    )
  }
}
