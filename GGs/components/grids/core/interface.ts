export type gridBodyLayoutType = (num: number, fixedOutline?: string) => string;

export interface CardType {
  [key: number]: number;
}

export type ItemType = {
  key?: string | number;
  name: string;
  weight: WeightTypes; // 卡片权重
  rs?: number;
  cs?: number;
  isBlank?: boolean;
  isFill?: boolean;
};

export type WeightTypes = 1 | 2 | 3 | 4;

export type GridType = {
  sortIndex: number;
  reSort: (from: number, to: number) => void;
};

export type MapComponentsType = {
  [key in WeightTypes]?: (isFill: boolean) => React.ReactNode;
};
