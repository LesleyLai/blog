import Link from "gatsby-link";
import * as React from "react";

import TagsList from "../tagsList";

import { TagID } from "../../types/tags";
import { Language, translations } from "../../utils/translations";

export interface PostMeta {
  frontmatter: {
    id: number;
    title: string;
    lang: Language;
    create: string;
    categories: TagID[];
  };
  timeToRead: number;
  excerpt: string;
}

export default class RecentPosts extends React.Component {
  public props: { posts: PostMeta[]; lang: Language };

  public render() {
    const posts = this.props.posts;
    const style = require("./recentPosts.module.css");

    const lang = this.props.lang;

    return (
      <div>
        {posts.map(post => {
          return (
            <article key={post.frontmatter.title} className={style.post}>
              <h3 className={style.header}>
                <Link to={`/${post.frontmatter.lang}/${post.frontmatter.id}`}>
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
                className={style.readmore}
                to={`/${post.frontmatter.lang}/${post.frontmatter.id}`}
              >
                {translations[lang]["readmore"]}
                {lang === "en" && ` | ${post.timeToRead} minutes`}
              </Link>
            </article>
          );
        })}
      </div>
    );
  }
}
