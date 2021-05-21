// components 文件操作类型 初始化 | 创建 | 更新 | 移除
export type actionTypeEnum = {
  INITIAL: '初始化',
  CREATED: '创建',
  MODIFIED: '更新',
  MOVED: '移除',
};

export enum transformModifyType {
  initial = 'INITIAL',
  created = 'CREATED',
  modified = 'MODIFIED',
  moved = 'MOVED'
}

export type actionType = keyof actionTypeEnum;

export type originType = keyof typeof transformModifyType;

// diff 文件结果类型 添加 | 删除
export type fileChangedType = 'added' | 'removed';

export type Actions = {
  [key in actionType]: {
    text: actionTypeEnum[key],
    log: Function
  }
}


export type cacheFiles = {
  [key in string]?: string;
}