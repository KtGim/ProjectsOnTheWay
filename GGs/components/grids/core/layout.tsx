import { ItemType, WeightTypes } from './interface';

type PositionForItemType = { [key: string]: ItemType };
type PositionSet = { [key: string]: boolean };
const initItem = (
  positionForItem: PositionForItemType | undefined,
  setPositions: PositionSet,
  li: Object,
  r: number,
  c: number,
  maxColLine: number,
) => {
  if (c >= maxColLine || setPositions[`ggs_grids_${r}_${c}`]) {
    return;
  }
  if (positionForItem) {
    const tempPF = positionForItem;
    tempPF[`ggs_grids_${r}_${c}`] = {
      ...li,
      key: `ggs_grids_${r}_${c}`,
      rs: r,
      cs: c,
    } as ItemType;
  }
  const tempSP = setPositions;
  tempSP[`ggs_grids_${r}_${c}`] = true;
};

const checkAndSetPositions = (
  weight: WeightTypes,
  positionForItem: PositionForItemType,
  setPositions: PositionSet,
  li: Object,
  r: number,
  c: number,
  maxColLine: number,
  maxLineNumber: number,
) => {
  let positionsHadSet: boolean[] = [];
  let rs = r;
  let cs = c;
  let maxN = maxLineNumber;
  for (let i = 0; i < weight; i += 1) {
    positionsHadSet.push(setPositions[`ggs_grids_${rs}_${cs + i}`]);
  }
  while (positionsHadSet.some((phs) => phs)) {
    cs += 1;
    if (cs + (weight - 1) >= maxColLine) {
      for (let i = cs; i < maxColLine; i += 1) {
        initItem(positionForItem, setPositions, { weight: 1, isBlank: true }, rs, i, maxColLine);
      }
      cs = 1;
      rs += 1;
      maxN = maxN > rs ? maxN : rs;
    }
    positionsHadSet = [];
    for (let i = 0; i < weight; i += 1) {
      positionsHadSet.push(setPositions[`ggs_grids_${rs}_${cs + i}`]);
    }
  }
  initItem(positionForItem, setPositions, li, rs, cs, maxColLine);
  if (weight > 1) {
    for (let i = cs; i < cs + weight; i += 1) {
      for (let j = rs; j < rs + weight; j += 1) {
        initItem(undefined, setPositions, { weight: 1, isBlank: true }, j, i, maxColLine);
      }
      maxN = maxN > rs + (weight - 1) ? maxN : rs + (weight - 1);
    }
  }
  return [rs, cs, maxN];
};

export const fillBlanks = (
  maxLineNumber: number,
  cols: number,
  setPositions: PositionSet,
  positionForItem: PositionForItemType,
  layoutList: ItemType[],
) => {
  // 填补空格区域
  let cN: number = 1;
  let rN: number = 1;
  for (let i = 1; i <= maxLineNumber * cols; i += 1) {
    // 当前位置已经被填充， 就将数据添加进 布局的 list中
    // 有些元素占用多格
    cN = i % cols === 0 ? cols : i % cols;
    rN = Math.ceil(i / cols);
    if (setPositions[`ggs_grids_${rN}_${cN}`]) {
      if (positionForItem[`ggs_grids_${rN}_${cN}`]) {
        layoutList.push(positionForItem[`ggs_grids_${rN}_${cN}`] as ItemType);
      }
    } else {
      layoutList.push({
        key: `ggs_grids_${rN}_${cN}`,
        weight: 1,
        isFill: true,
        rs: rN,
        cs: cN,
      } as ItemType);
    }
  }
};

const initBlanks = (
  item: ItemType,
  positionForItem: PositionForItemType,
  setPositions: PositionSet,
) => {
  const { weight, rs = 0, cs = 0 } = item;
  const tempPF = positionForItem;
  tempPF[`ggs_grids_${rs}_${cs}`] = {
    ...item,
    key: `ggs_grids_${rs}_${cs}`,
  } as ItemType;
  for (let i = cs; i < cs + weight; i += 1) {
    for (let j = rs; j < rs + weight; j += 1) {
      initItem(undefined, setPositions, { weight: 1, isBlank: true }, j, i, cs + weight);
    }
  }
};

// 初始化位置信息
export const initList = (list: ItemType[], cols: number, hasSetPositions: boolean) => {
  let c: number = 1;
  let r: number = 1;
  let maxLineNumber: number = 1;
  const maxColLine: number = cols + 1;
  const layoutList: ItemType[] = [];
  const positionForItem: PositionForItemType = {};
  const setPositions: PositionSet = {};
  if (!hasSetPositions) {
    for (let cur = 0; cur < list.length; cur += 1) {
      const li = list[cur];
      const { weight } = li;
      [r, c, maxLineNumber] = checkAndSetPositions(
        weight,
        positionForItem,
        setPositions,
        li,
        r,
        c,
        maxColLine,
        maxLineNumber,
      );
    }
  } else {
    for (let cur = 0; cur < list.length; cur += 1) {
      const li = list[cur];
      initBlanks(li, positionForItem, setPositions);
      if (cur === list.length - 1) {
        maxLineNumber = (li.rs || 0) - 1 + li.weight;
      }
    }
  }
  // 填补空格区域
  fillBlanks(maxLineNumber, cols, setPositions, positionForItem, layoutList);
  return {
    layoutList,
    rows: maxLineNumber,
  };
};
