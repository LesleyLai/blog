import * as React from "react";
import Link from 'gatsby-link';

const IndexPage = () => (
    <article>
        <h1>Hello</h1>
        <p>
            Hello, I'm Lesley Lai, a Computer Science student.
        </p>
        <p>Read <Link to="/about">about</Link> page to find more.</p>
    </article>
);

export default IndexPage;
