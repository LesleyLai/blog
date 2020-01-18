import * as React from "react";
import Link from "gatsby-link";
import {
  InstantSearch,
  Hits,
  Highlight,
  Snippet,
  Pagination
} from "react-instantsearch-dom";
import algoliasearch from "algoliasearch/lite";
import styled from "styled-components";

import { Language } from "../../utils/translations";
import { TagID } from "../../types/tags";
import TagsList from "../tagsList";

import SearchBox from "./input";

type ClickHandlerType = (event: React.MouseEvent<HTMLAnchorElement>) => void;

interface PostHitProps {
  hit: {
    id: string;
    title: string;
    lang: Language;
    create: string;
    tags: TagID[];
    content: string;
  };
}

const PostHit = (clickHandler: ClickHandlerType) => ({ hit }: PostHitProps) => {
  const Div = styled.div`
    border-bottom: 1px solid red;
  `;

  console.log(hit.content);

  return (
    <Div>
      <Link to={`/${hit.lang}/${hit.id}`} onClick={clickHandler}>
        <h4>
          <Highlight attribute="title" hit={hit} tagName="mark" />
        </h4>
      </Link>
      <Highlight attribute="create" hit={hit} tagName="mark" />
      <TagsList tags={hit.tags} lang={hit.lang} />
      <Highlight attribute="content" hit={hit} tagName="mark" />
    </Div>
  );
};

interface SearchProps {
  indices: any[];
  collapse: boolean;
  hitsAsGrid?: boolean;
}

interface HitWrapperProps {
  show: boolean;
}

const HitWrapper = styled.div<HitWrapperProps>`
  display: ${props => (props.show ? `grid` : `none`)};
  max-height: 80vh;
  overflow: scroll;
  z-index: 2;
  position: absolute;
  right: 0;
  top: 62px;
  width: 100vw;
  max-width: 40em;
  box-shadow: 0px 0px 5px 0px;
  padding: 0.7em 1em 0.4em;
  background: white none repeat scroll 0% 0%;
  .ais-Hits-list {
    list-style: none;
    margin-left: 0;
  }
`;

export default function Search({ indices, collapse }: SearchProps) {
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
      <HitWrapper show={query.length > 0 && focus}>
        <Hits hitComponent={PostHit(() => setFocus(false))} />
      </HitWrapper>

      <SearchBox onFocus={() => setFocus(true)} {...{ collapse, focus }} />
    </InstantSearch>
  );
}
