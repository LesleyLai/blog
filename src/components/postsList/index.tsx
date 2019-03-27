import Link from "gatsby-link";
import { groupBy, last } from "lodash";
import * as React from "react";

import TagsList from "../tagsList";

import Post from "../../types/Post";

const css = require("./posts.module.css");

function splitDate(date: string) {
  return date.split(" ");
}

const groupPosts = (posts: Array<{ node: Post }>) =>
  groupBy(posts, post => last(splitDate(post.node.frontmatter.create)));

interface ArchiveEntryProps {
  post: Post;
  excludeTag?: string;
}

const ArchiveEntry = (props: ArchiveEntryProps) => {
  const post = props.post;
  const frontmatter = post.frontmatter;
  const id = frontmatter.id;
  const lang = frontmatter.lang;
  const title = frontmatter.title;
  const create = frontmatter.create;

  return (
    <li className={css.entry}>
      <Link to={"/" + id + "/" + lang + "/"} className={css.entryTitle}>
        {props.post.frontmatter.title}
      </Link>
      <span>
        {" "}
        — {splitDate(create)[0]} {splitDate(create)[1]}{" "}
      </span>
      <TagsList
        className={css.archiveTags}
        tags={frontmatter.categories}
        exclude={props.excludeTag}
      />
    </li>
  );
};

const Posts = (props: {
  posts: Array<{ node: Post }>;
  excludeTag?: string;
}) => {
  const posts = props.posts;
  const excludeTag = props.excludeTag;

  const grouped = groupPosts(posts);
  const years = Object.keys(grouped) // Categorize posts accord to years
    .sort()
    .reverse();
  return (
    <section>
      {years.map(year => (
        <article key={year}>
          <h2 className={css.year}>{year}</h2>
          <ul>
            {grouped[year].map(post => (
              <ArchiveEntry
                post={post.node}
                key={post.node.frontmatter.id}
                excludeTag={excludeTag}
              />
            ))}
          </ul>
        </article>
      ))}
    </section>
  );
};

export default Posts;
