import * as React from "react";

import Link from "gatsby-link";
import styled from "styled-components";

type SeriesEntry = {
  title: string;
  slug?: string;
};

function romanize(num: number) {
  // http://blog.stevenlevithan.com/archives/javascript-roman-numeral-converter
  if (isNaN(num)) throw new Error("Invalid number");

  // prettier-ignore
  const digits = String(+num).split(""),
        key = ["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM",
               "","X","XX","XXX","XL","L","LX","LXX","LXXX","XC",
               "","I","II","III","IV","V","VI","VII","VIII","IX"];
  let roman = "",
    i = 3;
  while (i--) roman = (key[+digits.pop() + i * 10] || "") + roman;
  return Array(+digits.join("") + 1).join("M") + roman;
}

const Container = styled.div`
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #dbdbdb;
  width: 92%;
  max-width: 500px;
  margin: calc(1.1vw + 5px) auto 1vw;
  box-shadow: 1px 1px 0px #c2c2c2;
`;

const Title = styled.p`
  margin: 0px auto;
  padding: calc(0.1vw + 9px);
  font-weight: bold;
  font-size: 0.96em;
`;

const ItemLink = styled(Link)`
  color: #0a0a0a;
  padding: calc(0.1vw + 9px);
  display: block;
  position: relative;
  z-index: 4;
  border-top: 1px solid #dbdbdb;
  font-size: 0.88em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  :hover {
    background: #f9f9fa;
  }
`;

const ItemNoLink = styled.div`
  color: #0a0a0a;
  padding: calc(0.1vw + 9px);
  display: block;
  position: relative;
  z-index: 4;
  border-top: 1px solid #dbdbdb;
  font-size: 0.88em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

interface ItemProps {
  to?: string;
}

const Item: React.FunctionComponent<ItemProps> = props => {
  if (props.to) {
    return <ItemLink to={props.to}> {props.children} </ItemLink>;
  } else {
    return <ItemNoLink>{props.children}</ItemNoLink>;
  }
};

const Series = (props: { seriesTitle: string; entries: SeriesEntry[] }) => {
  const { seriesTitle, entries } = props;
  return (
    <Container>
      <Title>
        This post is a part of {seriesTitle} ({entries.length} parts series)
      </Title>
      {entries.map((e, i) => {
        const title = `${e.title}`;
        return (
          <Item to={e.slug} key={i}>
            {romanize(i + 1)} {title}
          </Item>
        );
      })}
    </Container>
  );
};

export const Empty = () => <Series seriesTitle="Empty Series" entries={[]} />;

const eight: SeriesEntry[] = [
  {
    title: "Judgements and Inference Rules",
    slug: "/judgements-inference-rules",
  },
  { title: "Static", slug: "/static" },
  { title: "Dynamic Semantics", slug: "/dynamic" },
  { title: "Type Safety", slug: "/type-safety" },
  { title: "Lambda Calculus" },
  { title: "Functions and System T" },
  { title: "Product and Sum Types" },
  { title: "Inductive Types" },
];

export const Eight = () => (
  <Series seriesTitle="Fundamental of Programming Languages" entries={eight} />
);

export default {
  title: "Series",
  component: Series,
};
