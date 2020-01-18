import * as React from "react";
import Link from "gatsby-link";
import { InstantSearch, Hits, Highlight } from "react-instantsearch-dom";
import algoliasearch from "algoliasearch/lite";

import { TagID } from "../../types/tags";

import SearchBox from "./input";

type ClickHandlerType = (event: React.MouseEvent<HTMLAnchorElement>) => void;

interface PostHitProps {
  hit: {
    id: string;
    title: string;
    lang: string;
    create: string;
    tags: TagID[];
    excerpt: string;
  };
}

const PostHit = (clickHandler: ClickHandlerType) => ({ hit }: PostHitProps) => (
  <div>
    <Link to={`/${hit.lang}/${hit.id}`} onClick={clickHandler}>
      <h4>
        <Highlight attribute="title" hit={hit} />
      </h4>
    </Link>
  </div>
);

interface SearchProps {
  indices: any[];
  collapse: boolean;
  hitsAsGrid?: boolean;
}

export default function Search({
  indices,
  collapse,
  hitsAsGrid = false
}: SearchProps) {
  const [focus, setFocus] = React.useState(false);
  const [query, setQuery] = React.useState(``);

  const searchClient = algoliasearch(
    process.env.GATSBY_ALGOLIA_APP_ID,
    process.env.GATSBY_ALGOLIA_SEARCH_KEY
  );
  return (
    <InstantSearch
      searchClient={searchClient}
      indexName={indices[0].name}
      onSearchStateChange={({ query }) => setQuery(query)}
    >
      <Hits hitComponent={PostHit(() => setFocus(false))} />

      <SearchBox onFocus={() => setFocus(true)} {...{ collapse, focus }} />
    </InstantSearch>
  );
}
