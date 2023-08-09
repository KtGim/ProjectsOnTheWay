import React, { useState, useEffect } from 'react';

import { dragItem, allowDrop, drop } from './sort';

import { GridsContainer } from './styled';

import { CardType, ItemType } from './interface';

const prefixCls = 'ggs-grids';

interface GridsProps extends CardType {
  auto?: boolean; // 是否自动设置位置，true 会重置之前的位置信息
  cols?: number; // 列数
  colGap?: string; // 列间距
  rowGap?: string; // 行间距
  list: ItemType[];
  initGridContent: (gridInfo: ItemType) => JSX.Element;
  hasSetPositions?: boolean;
  draggable?: boolean;
}

const Grids: React.FC<GridsProps> = ({
  cols = 1,
  rowGap,
  colGap,
  list,
  initGridContent,
  hasSetPositions,
  draggable,
}) => {
  const [Container, initContainer] = useState<any>(null);
  const [layoutList, initLayoutList] = useState<ItemType[]>(list);
  const [hasSet, initHasSet] = useState<boolean>(hasSetPositions || false);

  const buildGrids = () => {
    const layoutObj = GridsContainer(layoutList, cols, rowGap, colGap, hasSet);
    const { layout, layoutList: newList } = layoutObj;
    initContainer(layout);
    initLayoutList([...newList]);
  };

  const reSort = (from: number, to: number) => {
    const temp: ItemType = layoutList[from];
    layoutList[from] = layoutList[to];
    layoutList[to] = temp;
    buildGrids();
  };

  useEffect(() => {
    buildGrids();
    initHasSet(false);
  }, []);

  return (
    Container && (
      <Container className={prefixCls}>
        {layoutList.map((li, index) => {
          return (
            <div
              key={li.key}
              className={`item item-${index}`}
              data-position={index}
              draggable={draggable}
              onDragStart={(e) => {
                dragItem(e, index);
              }}
              onDragOver={allowDrop}
              onDrop={(e) => {
                const [from, to] = drop(e);
                if (from === to) {
                  return;
                }
                reSort(from, to);
              }}
            >
              {initGridContent(li)}
            </div>
          );
        })}
      </Container>
    )
  );
};

export default Grids;
