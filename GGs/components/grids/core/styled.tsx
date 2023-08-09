import styled from 'styled-components';

import { ItemType } from './interface';

import { gridBodyLayout } from './utils';

import { initList } from './layout';

const outLineTpl = (
  r: number,
  cols: number,
  itemsTpl?: string,
  rowGap: string = '0',
  colGap: string = '0',
) => {
  return styled.div`
    display: grid;
    grid-template-columns: ${gridBodyLayout(cols)};
    grid-template-rows: ${gridBodyLayout(r)};
    grid-row-gap: ${rowGap};
    grid-column-gap: ${colGap};
    height: 100%;

    .item {
      text-align: center;
      border: 1px solid #e5e4e9;
    }

    ${itemsTpl}
  `;
};
// 计算列表元素的样式
const initCurTpl = (idx: number, rs: number, re: number, cs: number, ce: number) => {
  return `
    .item-${idx} {
      background-color: #fff;
      grid-row-start: ${rs};
      grid-row-end: ${re}; 
      grid-column-start: ${cs};
      grid-column-end: ${ce};
    }
  `;
};

/**
 * grid-auto-flow: column | row    先行后列还是先列后行
 * grid-row-start
 * grid-row-end
 * grid-column-start
 * grid-column-end
 *
 */

export const GridsContainer = (
  list: ItemType[],
  cols: number = 3,
  rowGap?: string,
  colGap?: string,
  hasSet?: boolean,
) => {
  let itemsTpl = '';
  const listTemp: ItemType[] = JSON.parse(JSON.stringify(list));
  let layoutList: ItemType[] = listTemp;

  const listObj = initList(listTemp, cols, hasSet || false);
  layoutList = listObj.layoutList;

  // 计算 样式信息
  layoutList.forEach((li, idx) => {
    const { weight, rs = 1, cs = 1 } = li;
    itemsTpl += initCurTpl(idx, rs, rs + weight, cs, cs + weight);
  });

  // console.log(itemsTpl);
  return {
    layout: outLineTpl(listObj.rows, cols, itemsTpl, rowGap, colGap),
    layoutList,
  };
};
