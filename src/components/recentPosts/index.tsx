import Link from "gatsby-link";
import * as React from "react";

import TagsList from "../tagsList";

import { TagID } from "../../types/tags";
import { Language } from "../../utils/translations";

export interface PostMeta {
  frontmatter: {
    id: number;
    title: string;
    lang: Language;
    create: string;
    categories: TagID[];
  };
  excerpt: string;
}

export default class RecentPosts extends React.Component {
  public props: { posts: PostMeta[] };

  public render() {
    const posts = this.props.posts;
    const style = require("./recentPosts.module.css");

    return (
      <div>
        {posts.map(post => (
          <article key={post.frontmatter.title} className={style.post}>
            <h3 className={style.header}>
              <Link
                to={"/" + post.frontmatter.id + "/" + post.frontmatter.lang}
              >
                {post.frontmatter.title}
              </Link>
            </h3>
            <p className={style.date}>{post.frontmatter.create}</p>
            <TagsList
              tags={post.frontmatter.categories}
              lang={post.frontmatter.lang}
            />
            <p className={style.excerpt}>{post.excerpt}</p>
            <Link
              to={"/" + post.frontmatter.id + "/" + post.frontmatter.lang}
              className={style.readmore}
            >
              READ MORE
            </Link>
          </article>
        ))}
      </div>
    );
  }
}
