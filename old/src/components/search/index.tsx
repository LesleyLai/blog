import * as React from "react";
import { useState, useEffect } from "react";
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
import styled from "styled-components";

import { Language } from "../../utils/translations";
import { TagID } from "../../types/tags";
import TagsList from "../tagsList";

import { MdSearch as SearchIcon } from "react-icons/md";

import SearchBox from "./input";

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

const PostHit = ({ hit }: PostHitProps) => {
  const Div = styled.div`
    color: #333;
    background: white;
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(77, 128, 114, 0.3);
    margin-bottom: 24px !important;
    padding: 12px 24px;
  `;

  return (
    <Div>
      <Link to={`/${hit.lang}/${hit.id}`}>
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
  hitsAsGrid?: boolean;
}

const HitWrapper = styled.div`
  .ais-Hits-list {
    list-style: none;
    margin-left: 0;
  }
`;

const Button = styled.button`
  color: hsla(0, 0%, 100%, 0.7);
  background: transparent;
  border: none;
  :hover {
    color: #fff;
  }

  svg {
    margin-right: 2px;
  }

  @media (min-width: 769px) {
    order: 2;
  }

  @media (max-width: 992px) {
    svg {
      display: none;
    }
  }
`;

const SearchArea = styled.div`
  margin: auto 0;
  margin-bottom: auto !important;

  @media (max-width: 992px) {
    margin: 10px 12px;
  }
`;

const SearchOverlay = styled.div`
  position: fixed;
  overflow-x: hidden;
  top: 0;
  left: 0;
  z-index: 1;
  width: 100%;
  height: 100vh;
  padding: 100px 0;
  background-color: #fbfaf7;
  color: #000;
`;

const SearchContainer = styled.div`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
`;

const SearchBoxRow = styled.div`
  display: flex;
  margin-bottom: 24px;
`;

export default function Search({ indices }: SearchProps) {
  const searchClient = algoliasearch(
    process.env.GATSBY_ALGOLIA_APP_ID,
    process.env.GATSBY_ALGOLIA_SEARCH_KEY
  );
  const [display, setDisplay] = useState(false);

  useEffect(() => {
    if (display) {
      document.documentElement.classList.add("modal-open");
    } else {
      document.documentElement.classList.remove("modal-open");
    }
  });

  return (
    <SearchArea>
      <Button onClick={() => setDisplay(!display)}>
        <SearchIcon size={20} style={{ verticalAlign: "middle" }} />
        Search
      </Button>
      {display && (
        <SearchOverlay>
          <SearchContainer>
            <InstantSearch searchClient={searchClient} indexName={indices[0].name}>
              <Stats />
              <SearchBoxRow>
                <SearchBox />
                <button onClick={() => setDisplay(!display)}>Back</button>
              </SearchBoxRow>
              <HitWrapper>
                <Hits hitComponent={PostHit} />
              </HitWrapper>
            </InstantSearch>
          </SearchContainer>
        </SearchOverlay>
      )}
    </SearchArea>
  );
}
