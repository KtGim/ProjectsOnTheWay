import { OPERATIONS } from './componentConfig';
const { error } = console;

const saveEvent = (container, cb) => {
    container.addEventListener('keydown', (e) => {
        const keyCode = e.keyCode || e.which || e.charCode;
        const ctrlKey = e.ctrlKey || e.metaKey;
        if (ctrlKey && keyCode === 83) {
            cb && cb(OPERATIONS.SAVE);
        }
        e.preventDefault();
    });
};

const undoEvent = (container, cb) => {
    container.addEventListener('keydown', (e) => {
        const keyCode = e.keyCode || e.which || e.charCode;
        const ctrlKey = e.ctrlKey || e.metaKey;
        if (ctrlKey && keyCode === 83) {
            cb && cb(OPERATIONS.UNDO);
        }
        e.preventDefault();
    });
};

const ActionsMap = {
    [OPERATIONS.SAVE]: {
        func: saveEvent,
        keyCodeList: [83]
    },
    [OPERATIONS.UNDO]: undoEvent
};

/**
 * 某一个元素添加监听内容
 * @param {string} operationList OPERATIONS 的枚举
 * @param {object} subscriber 具体需要的操作
 * @param {dom} subscriber.container 需要挂在的事件
 * @param {function} subscriber.cb 回调函数
 * @returns
 */
const subscribeList = (operationList, subscriber) => {
    if(!operationList || !subscriber) { return; }
    const { container, cb } = subscriber;
    if(!container) {
        error('Actions need a parent container.');
        return;
    }
    operationList.forEach((operation) => {
        if(ActionsMap[operation]) {
            ActionsMap[operation](container, cb);
        }
    });
};

export {
    subscribeList
};

