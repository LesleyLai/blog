import * as React from "react";
import { connectSearchBox } from "react-instantsearch-dom";
import styled from "styled-components";

import { MdSearch } from "react-icons/lib/md";

const Input = styled.input`
  outline: none;
  border: none;
  font-size: 1em;
  background: white;
  /* background: transparent; */
  transition: 0.3;
  border-radius: 3px;
  {highlight-next-line}
`;

const Form = styled.form`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0;
`;

const SearchIcon = styled(MdSearch)`
  color: hsla(0, 0%, 100%, 0.7);
  margin: 0 5px;
`;

interface SearchBoxProps {
  refine: (...args: any[]) => any;
  onFocus: () => void;
}

const SearchBox = ({ refine, ...rest }: SearchBoxProps) => (
  <Form>
    <Input
      type="text"
      placeholder="Search"
      aria-label="Search"
      onChange={e => refine(e.target.value)}
      {...rest}
    />
    <SearchIcon size={20} />
  </Form>
);

export default connectSearchBox(SearchBox);
