import React from 'react';
import renderer from 'react-test-renderer';

import A from './index';
console.log(A);
it('renders correctly', () => {
    const tree = renderer
      .create(<A />)
      .toJSON();
    expect(tree).toMatchSnapshot();
});