import {Actions} from './type';
const { done, warn, danger } = require('./chalkLog');

const modifyActions: Actions = {
  INITIAL: {
    text: '初始化',
    log: done
  },
  CREATED: {
    text: '创建',
    log: done
  },
  MODIFIED: {
    text: '更新',
    log: warn
  },
  MOVED: {
    text: '移除',
    log: danger
  },
}

export {
  modifyActions
};