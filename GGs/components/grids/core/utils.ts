import { gridBodyLayoutType } from './interface';

export const gridBodyLayout: gridBodyLayoutType = (num, fixedOutline) => {
  if (fixedOutline) {
    return `repeat(${num}, ${fixedOutline})`;
  }
  return `repeat(${num}, ${(100 / num).toFixed(2)}%)`;
};
