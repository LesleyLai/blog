import Link from "gatsby-link";
import * as React from "react";
import { Language } from "../../utils/translations";
import styled from "styled-components";

interface PaginationProps {
  lang: Language;
  currentPage: number;
  pagesCount: number;
}

const Container = styled.ul`
  display: none;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  list-style: none;
  padding: 0;
  width: fit-content;
  margin: 24px auto 12px;

  li:first-child {
    margin-right: 12px;
  }

  li:last-child {
    margin-left: 12px;
  }
`;

const ContainerLarge = styled(Container)`
  li {
    margin: 0;
  }

  @media (min-width: 576px) {
    display: flex;
  }
`;

const ContainerXs = styled(Container)`
  @media (max-width: 576px) {
    display: flex;
  }
`;

const PaginationLink = styled(Link)`
  padding: 6px 12px;
  text-decoration: none;
  border: 1px solid #ddd;

  :hover {
    background: #eee;
  }
`;

const PaginationDisabled = styled.span`
  padding: 6px 12px;
  text-decoration: none;
  border: 1px solid #ddd;
`;

const PreviousButton = (props: { previousPage: string; isFirst: boolean }) => (
  <li key="pagination-previous">
    {props.isFirst ? (
      <PaginationDisabled>Previous</PaginationDisabled>
    ) : (
      <PaginationLink to={props.previousPage} rel="prev">
        Previous
      </PaginationLink>
    )}
  </li>
);

const NextButton = (props: { nextPage: string; isLast: boolean }) => (
  <li key="pagination-next">
    {props.isLast ? (
      <PaginationDisabled>Next</PaginationDisabled>
    ) : (
      <PaginationLink to={props.nextPage} rel="next">
        Next
      </PaginationLink>
    )}
  </li>
);

const Pagination = ({ lang, currentPage, pagesCount }: PaginationProps) => {
  const isFirst = currentPage == 1;
  const isLast = currentPage == pagesCount;
  const linkAt = (pageIndex: number) =>
    pageIndex !== 1 ? `/${lang}/${pageIndex}` : lang == "en" ? "/" : `/${lang}`;

  const previousPage = linkAt(currentPage - 1);
  const nextPage = linkAt(currentPage + 1);

  return (
    <>
      <ContainerXs id="pagination-xs">
        <PreviousButton previousPage={previousPage} isFirst={isFirst} />
        <li key={`pagination-number${currentPage}`}>
          <PaginationLink
            to={linkAt(currentPage)}
            style={{
              color: "#ffffff",
              background: "#007acc",
            }}
          >
            {currentPage}
          </PaginationLink>
        </li>
        <NextButton nextPage={nextPage} isLast={isLast} />
      </ContainerXs>
      <ContainerLarge id="pagination-large">
        <PreviousButton previousPage={previousPage} isFirst={isFirst} />
        {Array.from({ length: pagesCount }, (_, i) => (
          <li key={`pagination-number${i + 1}`}>
            {(() => {
              const isCurrent = i + 1 === currentPage;
              return (
                <PaginationLink
                  to={linkAt(i + 1)}
                  style={{
                    color: isCurrent ? "#ffffff" : undefined,
                    background: isCurrent ? "#007acc" : undefined,
                  }}
                >
                  {i + 1}
                </PaginationLink>
              );
            })()}
          </li>
        ))}
        <NextButton nextPage={nextPage} isLast={isLast} />
      </ContainerLarge>
    </>
  );
};

export default Pagination;
