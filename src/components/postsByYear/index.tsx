import Link from "gatsby-link";
import { groupBy } from "lodash";
import * as React from "react";

import TagsList from "../tagsList";

import { Language } from "../../utils/translations";
import Post from "../../types/Post";

const css = require("./posts.module.css");

const groupPosts = (posts: Post[]) =>
  groupBy(posts, post => new Date(post.frontmatter.create).getFullYear());

interface ArchiveEntryProps {
  post: Post;
  lang: Language;
  excludeTag?: string;
}

const ArchiveEntry = (props: ArchiveEntryProps) => {
  const { id, lang, title, create, categories } = props.post.frontmatter;
  const options = { month: "long", day: "numeric", timeZone: "UTC" };
  const createFormated = new Intl.DateTimeFormat(lang, options).format(create);

  return (
    <li className={css.entry}>
      <Link to={`/${lang}/${id}`} className={css.entryTitle}>
        {title}
      </Link>
      <span className={css.date}> — {createFormated}</span>
      <TagsList
        className={css.archiveTags}
        tags={categories}
        exclude={props.excludeTag}
        lang={lang}
      />
    </li>
  );
};

const PostsByYear = (props: { posts: Post[]; lang: Language; excludeTag?: string }) => {
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
                post={post}
                lang={props.lang}
                key={post.frontmatter.id}
                excludeTag={excludeTag}
              />
            ))}
          </ul>
        </article>
      ))}
    </section>
  );
};

export default PostsByYear;
