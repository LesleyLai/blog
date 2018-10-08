import Link from "gatsby-link";
import { groupBy, last } from "lodash";
import * as React from "react";

import TagsList from "./tagsList";

import Post from "../types/Post";

function splitDate(date: string) {
  return date.split(" ");
}

const groupPosts = (posts: Array<{ node: Post }>) =>
  groupBy(posts, post => last(splitDate(post.node.frontmatter.create)));

interface ArchiveEntryProps {
  post: Post;
}

const ArchiveEntry = (props: ArchiveEntryProps) => {
  const post = props.post;
  const frontmatter = post.frontmatter;
  const id = frontmatter.id;
  const lang = frontmatter.lang;
  const title = frontmatter.title;
  const create = frontmatter.create;

  return (
    <div>
      <h3>
        <Link to={"/" + id + "/" + lang + "/"}>
          {props.post.frontmatter.title}
        </Link>
        <span>
          {" "}
          — {splitDate(create)[0]} {splitDate(create)[1]}{" "}
        </span>
      </h3>
      <p style={{ marginBottom: "0.3rem" }}>{post.excerpt}</p>
      <TagsList tags={frontmatter.categories} />
    </div>
  );
};

const Posts = ({ posts }: { posts: Array<{ node: Post }> }) => {
  const grouped = groupPosts(posts);
  const years = Object.keys(grouped) // Categorize posts accord to years
    .sort()
    .reverse();
  return (
    <section>
      {years.map(year => (
        <article key={year}>
          <h2>{year}</h2>
          {grouped[year].map(post => (
            <ArchiveEntry post={post.node} key={post.node.frontmatter.id} />
          ))}
        </article>
      ))}
    </section>
  );
};

export default Posts;
