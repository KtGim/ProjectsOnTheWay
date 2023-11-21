import { OPERATIONS } from './componentConfig';
const { error } = console;

const keyDown = (cb, e) => {
    const keyCode = e.keyCode || e.which || e.charCode;
    const code = e.code;
    const ctrlKey = e.ctrlKey || e.metaKey;
    const altKey = e.altKey;
    const shiftKey = e.shiftKey;
    let params = {
        altKey,
        shiftKey,
        ctrlKey,
        keyCode,
        code
    };
    if (ctrlKey) {
        switch(code) {
            case 'KeyZ':
                params.operation = OPERATIONS.UNDO;
                break;
            case 'KeyY':
                params.operation = OPERATIONS.REDO;
                break;
        }
        if(!params.operation) {
            switch(keyCode) {
                case 83:
                    params.operation = OPERATIONS.SAVE;
                    break;
                case 90:
                    params.operation = OPERATIONS.UNDO;
                    break;
                case 89:
                    params.operation = OPERATIONS.REDO;
                    break;
            }
        }
        if(altKey) {
            switch(code) {
                case 'KeyS':
                    params.operation = OPERATIONS.SAVE;
                    break;
                case 'KeyA':
                    params.operation = OPERATIONS.SELECT_ALL;
                    break;
            }
            if(!params.operation) {
                switch(keyCode) {
                    case 83:
                        params.operation = OPERATIONS.SAVE;
                        break;
                    case 65:
                        params.operation = OPERATIONS.SELECT_ALL;
                        break;
                }
            }
        }
    } else {
        switch(code) {
            case 'Delete':
                params.operation = OPERATIONS.DELETE;
                break;
        }
        if(!params.operation) {
            switch(keyCode) {
                case 46:
                    params.operation = OPERATIONS.DELETE;
                    break;
            }
        }
    }
    cb && cb(params);
};
const subscribersOfKeyDown = {};

// 监听按键操作
const collectKeyDownEvents = (containerId, cb) => {
    if(!containerId) {
        error('TicketTemplate.add: need a containerId.');
        return;
    }
    subscribersOfKeyDown[containerId] = keyDown.bind(null, cb);
    document.addEventListener('keydown', subscribersOfKeyDown[containerId]);
};

const removeKeyDownEvents = (containerId) => {
    if(!containerId) {
        error('TicketTemplate.remove: need a containerId.');
        return;
    }
    document.removeEventListener('keydown', subscribersOfKeyDown[containerId]);
    subscribersOfKeyDown[containerId] = null;
};

// 缓存操作
const stepCache = (max = 30) => {
    const cacheList = [];
    let current = -1;

    const push = (data) => {
        cacheList.push({
            time: Date.now(),
            content: JSON.stringify(data || {})
        });
        if(cacheList.length > max) {
            cacheList.shift();
        }
        current = cacheList.length - 1;
    };

    const undo = () => {
        if(current > 0) {
            return getCacheByIndex(--current);
        } else {
            return getCacheByIndex(0);
        }
    };

    const redo = () => {
        if(current < cacheList.length - 1) {
            return getCacheByIndex(++current);
        } else {
            return getCacheByIndex(cacheList.length - 1);
        }
    };

    const getCacheByIndex = (current) => {
        let cache = cacheList[current];
        return {
            time: cache.time,
            content: JSON.parse(cache.content || '{}')
        };
    };

    const getCurrent = () => {
        return {
            current,
            max: cacheList.length - 1
        };
    };

    return {
        push,
        undo,
        redo,

        getCacheByIndex,
        getCurrent
    };
};

// 鼠标操作
const mouseDownEventName = 'mouse_down_event_';
const mouseMoveEventName = 'mouse_move_event_';
const mouseUpEventName = 'mouse_up_event_';
let maskContainer = null;
let maskQueryArea = null;

// 移除所有的监听事件监听
const mouseUp = (containerId, cb, startEvent, e) => {
    const container = document.querySelector(`#${containerId}`);
    if(!container || !maskContainer) return;
    const { clientX, clientY } = e;
    const { clientX: startX, clientY: startY } = startEvent;
    const width = clientX - startX;
    const height = clientY - startY;
    cb && cb(maskQueryArea, {
        startX,
        startY,
        endX: clientX,
        endY: clientY,
        width,
        height
    });
    Object.keys(subscribersOfKeyDown).forEach(key => {
        if(key.includes(mouseMoveEventName)) {
            maskContainer.removeEventListener('mousemove', subscribersOfKeyDown[key]);
            document.removeEventListener('mouseup', subscribersOfKeyDown[key]);
            subscribersOfKeyDown[key] = null;
        }
        if(key.includes(mouseUpEventName)) {
            maskContainer.removeEventListener('mouseup', subscribersOfKeyDown[key]);
            document.removeEventListener('mouseup', subscribersOfKeyDown[key]);
            subscribersOfKeyDown[key] = null;
        }
    });
    maskContainer.removeChild(maskQueryArea);
    container.removeChild(maskContainer);
    maskQueryArea = null;
    maskContainer = null;
};

const mouseMove = (startEvent, e) => {
    const { clientX, clientY } = e;
    const { clientX: startX, clientY: startY } = startEvent;
    const width = clientX - startX;
    const height = clientY - startY;
    maskQueryArea.style.width = (width) + 'px';
    maskQueryArea.style.height = (height) + 'px';
};

const mouseDown = (containerId, cb, e) => {
    if(e.ctrlKey && !maskContainer && !maskQueryArea) {
        const container = document.querySelector(`#${containerId}`);
        maskContainer = document.createElement('div');
        maskContainer.style.position = 'absolute';
        maskContainer.style.top = '0';
        maskContainer.style.left = '0';
        maskContainer.style.width = container.offsetWidth + 'px';
        maskContainer.style.height = container.offsetHeight + 'px';
        maskContainer.style.zIndex = 999;
        maskContainer.style.cursor = 'crosshair';
        // maskContainer.style.backgroundColor = 'rgba(0,0,0,0.1)';
        maskQueryArea = document.createElement('div');
        maskQueryArea.style.position = 'fixed';
        maskQueryArea.style.border = '2px solid yellow';
        maskQueryArea.style.borderRadius = '3px';
        maskQueryArea.style.top = (e.clientY) + 'px';
        maskQueryArea.style.left = (e.clientX) + 'px';
        maskQueryArea.style.zIndex = 1000;
        maskContainer.appendChild(maskQueryArea);
        container.appendChild(maskContainer);

        const eventKey = `${mouseMoveEventName}${containerId}`;
        subscribersOfKeyDown[eventKey] = mouseMove.bind(null, e);
        maskContainer.addEventListener('mousemove', subscribersOfKeyDown[eventKey]);
        const removeKey = `${mouseUpEventName}${containerId}`;
        subscribersOfKeyDown[removeKey] = mouseUp.bind(null, containerId, cb, e);
        maskContainer.addEventListener('mouseup', subscribersOfKeyDown[removeKey]);
    }
};

// 鼠标画画布操作
const mouseEvents = (containerId, cb) => {
    if(!containerId) {
        error('TicketTemplate.add: need a containerId.');
        return;
    }
    const eventKey = `${mouseDownEventName}${containerId}`;
    let container = document.querySelector(`#${containerId}`);
    subscribersOfKeyDown[eventKey] = mouseDown.bind(null, containerId, cb);
    container.addEventListener('mousedown', subscribersOfKeyDown[eventKey]);
};

const removeMouseDownEvent = (containerId) => {
    if(!containerId) {
        error('TicketTemplate.add: need a containerId.');
        return;
    }
    const container = document.querySelector(`#${containerId}`);
    if(container && subscribersOfKeyDown[`${mouseDownEventName}${containerId}`]) {
        container.removeEventListener('mousedown', subscribersOfKeyDown[`${mouseDownEventName}${containerId}`]);
    }
};

export {
    collectKeyDownEvents,
    removeKeyDownEvents,

    stepCache,
    mouseEvents,
    removeMouseDownEvent,
    mouseUp
};

