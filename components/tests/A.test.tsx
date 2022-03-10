import React from 'react';
import renderer from 'react-test-renderer';

import A from '../business/A/index';
it('renders correctly', () => {
    const tree = renderer
      .create(<A />)
      .toJSON();
    expect(tree).toMatchSnapshot();
});
test('A is running', () => {
  const component = renderer.create(
    <A />,
  );

  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
})