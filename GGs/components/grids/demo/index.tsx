import React from 'react';

import Grids, { ItemType } from 'ggs-ui/lib/grids';
import 'ggs-ui/lib/grids/style';

const list: ItemType[] = [
  {
    name: '3',
    weight: 3,
    rs: 1,
    cs: 1,
  },
  {
    name: '1',
    weight: 1,
    rs: 1,
    cs: 4,
  },
  {
    name: '2',
    weight: 2,
    rs: 4,
    cs: 1,
  },
];

const initContent = (gridInfo: ItemType) => {
  const { weight, isBlank, isFill } = gridInfo;
  if (isFill || isBlank) {
    return <div style={{ height: '100%', backgroundColor: 'red' }} />;
  }
  return <div style={{ height: '100%' }}>{weight}</div>;
};

export default () => (
  <Grids
    list={list}
    cols={4}
    rowGap="10px"
    colGap="10px"
    initGridContent={(gridInfo) => initContent(gridInfo)}
    hasSetPositions
    draggable
  />
);
