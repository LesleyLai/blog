import * as React from "react";
import Link from "gatsby-link";
import styled from "styled-components";

import { IconContext } from "react-icons";
import { FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";

import { Language } from "../../utils/translations";

interface PrevNextInfo {
  id: string;
  title: string;
}

interface PrevNextLinksProps {
  lang: Language;
  previousInfo?: PrevNextInfo;
  nextInfo?: PrevNextInfo;
}

const Container = styled.div`
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  margin-bottom: 2rem;
  display: grid;
  grid-template-columns: repeat(2, 50%);
`;

const LinkBox = styled.div`
  padding: 20px 0;
  display: block;

  svg {
    vertical-align: text-bottom;
  }
`;

const Left = styled(LinkBox)`
  border-right: 1px solid #eee;
  grid-column: 1;
  padding-right: 20px;
`;

const Right = styled(LinkBox)`
  grid-column: 2;
  text-align: right;
  padding-left: 20px;
`;

const PostLink = styled(Link)`
  font-size: 15px;
  font-weight: 600;
  margin: 0 4px;
  vertical-align: middle;

  @media (min-width: 500px) {
    font-size: 17px;
  }
`;

const PrevNextLinks = ({ lang, previousInfo, nextInfo }: PrevNextLinksProps) => (
  <Container>
    <IconContext.Provider value={{ style: { verticalAlign: "middle" } }}>
      <Left>
        {previousInfo && (
          <>
            <FaAngleDoubleLeft size={17} />
            <PostLink to={`/${lang}/${previousInfo.id}`}>{previousInfo.title}</PostLink>
          </>
        )}
      </Left>
      <Right>
        {nextInfo && (
          <>
            <PostLink to={`/${lang}/${nextInfo.id}`}>{nextInfo.title}</PostLink>
            <FaAngleDoubleRight size={17} />
          </>
        )}
      </Right>
    </IconContext.Provider>
  </Container>
);

export default PrevNextLinks;
