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
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  list-style: none;
  padding: 0;
  width: fit-content;
  margin: auto;
`;

const Li = styled.li`
  margin: 0;
`;

const PaginationLink = styled(Link)`
  padding: 6px 12px;
  textdecoration: none;
  border: 1px solid #ddd;

  :hover {
    background: #eee;
  }
`;

const PaginationDisabled = styled.span`
  padding: 6px 12px;
  textdecoration: none;
  border: 1px solid #ddd;
`;

const Pagination = ({ lang, currentPage, pagesCount }: PaginationProps) => {
  const isFirst = currentPage == 1;
  const isLast = currentPage == pagesCount;
  const linkAt = (pageIndex: number) =>
    pageIndex !== 1 ? `/${lang}/${pageIndex}` : lang == "en" ? "/" : `/${lang}`;

  const previousPage = linkAt(currentPage - 1);
  const nextPage = linkAt(currentPage + 1);

  return (
    <Container id="pagination">
      <Li key="pagination-previous">
        {isFirst ? (
          <PaginationDisabled>Previous</PaginationDisabled>
        ) : (
          <PaginationLink to={previousPage} rel="prev">
            Previous
          </PaginationLink>
        )}
      </Li>
      {Array.from({ length: pagesCount }, (_, i) => (
        <Li key={`pagination-number${i + 1}`}>
          {(() => {
            const isCurrent = i + 1 === currentPage;
            return (
              <PaginationLink
                to={linkAt(i + 1)}
                style={{
                  color: isCurrent ? "#ffffff" : "",
                  background: isCurrent ? "#007acc" : "",
                }}
              >
                {i + 1}
              </PaginationLink>
            );
          })()}
        </Li>
      ))}
      <Li key="pagination-next">
        {isLast ? (
          <PaginationDisabled>Next</PaginationDisabled>
        ) : (
          <PaginationLink to={nextPage} rel="next">
            Next
          </PaginationLink>
        )}
      </Li>
    </Container>
  );
};

export default Pagination;
