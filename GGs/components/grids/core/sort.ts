export const dragItem = (ev: React.DragEvent<HTMLDivElement>, position: number) => {
  ev.dataTransfer.setData('position', `${position}`);
};

export const allowDrop = (ev: React.DragEvent<HTMLDivElement>) => {
  ev.preventDefault();
};

export const drop = (ev: React.DragEvent<HTMLDivElement>) => {
  ev.preventDefault();
  // 获取移动和目标信息
  const from: string = ev.dataTransfer.getData('position');
  const to: string = ev.currentTarget.getAttribute('data-position') as string;
  return [+from, +to];
};
