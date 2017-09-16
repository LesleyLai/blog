import React from 'react';
import PropTypes from 'prop-types';
import Link from 'gatsby-link';
import Helmet from 'react-helmet';

import Header from '../components/header.jsx';

const TemplateWrapper = ({ children }) => (
    <div>
      <Helmet
      title="Lesley Lai's Website"
      meta={[
          { name: 'description', content: 'Sample' },
          { name: 'keywords', content: 'sample, something' },
      ]}
      />
      <Header />
     1 <div
        style={{
            margin: '0 auto',
            maxWidth: 960,
            padding: '0px 1.0875rem 1.45rem',
            paddingTop: 0,
        }}
        >
        {children()}
      </div>
    </div>
)

TemplateWrapper.propTypes = {
    children: PropTypes.func,
};

export default TemplateWrapper;
