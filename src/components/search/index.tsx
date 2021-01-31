import * as React from "react";
import Link from "gatsby-link";
import {
  InstantSearch,
  Stats,
  Configure,
  Hits,
  Highlight,
  Snippet,
  Pagination,
} from "react-instantsearch-dom";
import algoliasearch from "algoliasearch/lite";
import styled, { createGlobalStyle } from "styled-components";

import { Language } from "../../utils/translations";
import { TagID } from "../../types/tags";
import TagsList from "../tagsList";

import { MdSearch as SearchIcon } from "react-icons/md";

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

const SearchLabel = ({ htmlFor }: { htmlFor: string }) => {
  const Style = styled.label`
    color: hsla(0, 0%, 100%, 0.7);
    background: transparent;
    height: 100px;
    :hover {
      color: #fff;
    }

    @media (min-width: 769px) {
      order: 2;
    }
  `;

  return (
    <Style htmlFor={htmlFor}>
      <SearchIcon size={20} style={{ verticalAlign: "middle" }} /> <span>Search</span>
    </Style>
  );
};

const GlobalSearchStyle = createGlobalStyle`
  input#search {
    display: none;
  }

  .search-overlay {
    display: none;
    opacity: 0;
    position: fixed;
    overflow-x: hidden;
    top: 0;
    left: 0;
    z-index: 1;
    width: 100%;
    height: 100vh;
    padding: 100px 0;
    background-color: #222;
    color: #fff;
  }

  input#search:checked ~ .search-overlay {
    display: block;
    opacity: 0.9;
  }

  input#search:checked
`;

const SearchArea = styled.div`
  margin: auto 0;
  margin-bottom: auto !important;

  @media (max-width: 992px) {
    margin: 10px 20px;
  }
`;

export default function Search({ indices, collapse }: SearchProps) {
  const searchClient = algoliasearch(
    process.env.GATSBY_ALGOLIA_APP_ID,
    process.env.GATSBY_ALGOLIA_SEARCH_KEY
  );
  return (
    <SearchArea>
      {/* <GlobalSearchStyle />
          <SearchLabel htmlFor="search" />
          <input type="checkbox" name="" id="search"></input>
          <div className="search-overlay">
          <label htmlFor="search">
          <p>Back</p>
          </label>
          <InstantSearch searchClient={searchClient} indexName={indices[0].name}>
          <Stats />
          <SearchBox />
          <Hits hitComponent={PostHit(() => setFocus(false))} />
          </InstantSearch>
          </div> */}
    </SearchArea>
  );
}

/*
     <InstantSearch searchClient={searchClient} indexName={indices[0].name}>
        <Configure distinct />

       <SearchButton />

<SearchBox />
        <Hits />

<HitWrapper show={query.length > 0 && focus}>
        <Hits hitComponent={PostHit(() => setFocus(false))} />
        </HitWrapper>

<SearchBox onFocus={() => setFocus(true)} {...{ collapse, focus }} />
 </InstantSearch>
*/
