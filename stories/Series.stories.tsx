import * as React from 'react';
import { action } from '@storybook/addon-actions';

const Series = () => (
  <div>
    <p>Title (8 parts series)</p>
    <div>1) foo</div>
    <div>2) bar</div>

    <div> 3...6 </div>

    <div>7) baz</div>
    <div>8) fiz</div>
  </div>);

export const Eight = () => <Series />;

export default {
  title: 'Series',
  component: Series,
};
