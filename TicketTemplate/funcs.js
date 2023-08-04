import { COMMON_ELEMENTS, DEFAULT_STYLE, ICON_SCRIPT_ID, SHOW_ELEMENTS, icon_src } from './componentConfig';
import View from './components/View';
import { BASE_DISTANCE, LAYOUT_INDEX, LINE_POSITION, SOURCE_BTN_TYPE, TEMPLATE_SOURCE_ID, UNIT, VIEW_PRINT_TEMPLATE_ID } from './const';
import TicketTemplate from './index';

const isHttp = (url) => {
    return /^http(s)?:\/\//.test(url);
};

const isChinese = (str) => {
    return /[\u4e00-\u9fa5]/.test(str);
};

const setUnit = (num, unit) => {
    return unit ? `${num}${unit}` : num;
};

const setDotsStyle = ({left: leftChar, top: topChar, width: widthChar, height: heightChar}, unit) => {
    const left = parseFloat(leftChar);
    const top = parseFloat(topChar);
    const width = parseFloat(widthChar);
    const height = parseFloat(heightChar);
    return {
        [LINE_POSITION.TOP]: {
            top: setUnit(top, unit),
            left: setUnit(left, unit),
            width: setUnit(width, unit),
            height: setUnit(2, unit),
            zIndex: LAYOUT_INDEX.PROPERTY_IN_DRAW_DRAG_LINE
        },
        [LINE_POSITION.RIGHT]: {
            top: setUnit(top, unit),
            left: setUnit(left + width - 1, unit),
            width: setUnit(2, unit),
            height: setUnit(height, unit),
            zIndex: LAYOUT_INDEX.PROPERTY_IN_DRAW_DRAG_LINE
        },
        [LINE_POSITION.BOTTOM]: {
            top: setUnit(top + height - 2, unit),
            left: setUnit(left, unit),
            width: setUnit(width, unit),
            height: setUnit(2, unit),
            zIndex: LAYOUT_INDEX.PROPERTY_IN_DRAW_DRAG_LINE
        },
        [LINE_POSITION.LEFT]: {
            top: setUnit(top, unit),
            left: setUnit(left, unit),
            width: setUnit(2, unit),
            height: setUnit(height, unit),
            zIndex: LAYOUT_INDEX.PROPERTY_IN_DRAW_DRAG_LINE
        }
    };
};

const setDotsStylePosition = ({left: leftChar, top: topChar, width: widthChar, height: heightChar}, unit) => {
    const left = parseFloat(leftChar);
    const top = parseFloat(topChar);
    const width = parseFloat(widthChar);
    const height = parseFloat(heightChar);

    return {
        [LINE_POSITION.TOP]: {
            top: setUnit(top, unit),
            left: setUnit(left, unit)
        },
        [LINE_POSITION.RIGHT]: {
            top: setUnit(top, unit),
            left: setUnit(left + width - 1, unit)
        },
        [LINE_POSITION.BOTTOM]: {
            top: setUnit(top + height - 2, unit),
            left: setUnit(left, unit)
        },
        [LINE_POSITION.LEFT]: {
            top: setUnit(top, unit),
            left: setUnit(left, unit)
        }
    };
};

const setDragBarPosition = ({left: leftChar, top: topChar, width: widthChar, height: heightChar, fixPosition = 0}, unit) => {
    const left = parseFloat(leftChar);
    const top = parseFloat(topChar);
    const width = parseFloat(widthChar);
    const height = parseFloat(heightChar);
    return {
        top: setUnit(top + height - fixPosition, unit),
        left: setUnit(left + width - fixPosition, unit)
    };
};

/**
 * 计算四个拖拽按钮的位置
 * @param {被包裹元素的宽度} offsetWidth
 * @param {被包裹元素的高度} offsetHeight
 * @returns
 */
const calculatePosition = (offsetWidth, offsetHeight) => {
    return [
        {
            left: BASE_DISTANCE,
            top: BASE_DISTANCE
        }, // left_top
        {
            left: offsetWidth + BASE_DISTANCE,
            top: BASE_DISTANCE
        }, // right_top
        {
            left: BASE_DISTANCE,
            top: offsetHeight + BASE_DISTANCE
        }, // left_bottom
        {
            left: offsetWidth + BASE_DISTANCE,
            top: offsetHeight + BASE_DISTANCE
        } // rignt_bottom
    ];
};

/**
 * 设置样式单位
 * @param {样式} style
 * @param {单位} unit
 * @returns
 */
const getUnitStyle = (style, unit = UNIT.MM) => {
    return Object.keys(style).reduce((acc, key) => {
        acc[key] = setUnit(style[key], unit);
        return acc;
    }, {});
};

// 节流函数
const debounce = (fn, wait = 300) => {
    let timer = null;
    return (args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn(args);
        }, wait);
    };
};

/**
 * 1. 二维码的宽高应该保持一致 获取最终的高度
 * 2. 条形码设置一下默认高度，美观
 * @param {string} 组件的类型 field
 * @param {number} 当前拖拽元素 高 height
 * @param {number} 当前拖拽元素 宽 width
 * @param {number} 当前画布的宽 baseWidth
 * @param {number} 当前画布的高 baseHeight
 * @param {boolean} init 是否是初始化
 * @returns {number}
 */
// eslint-disable-next-line no-unused-vars
const getFinalHeight = ({field, height, width, baseWidth, baseHeight, init = true}) => {
    switch (field) {
        case SHOW_ELEMENTS.QRCode:
            return width;
        case SHOW_ELEMENTS.BARCODE:
            return DEFAULT_STYLE.BARCODE_HEIGHT;
        case COMMON_ELEMENTS.DATE:
            return init ? DEFAULT_STYLE.COMMON_HEIGHT : height;
        default:
            return height;
    }
};

/**
 * 1. 条形码宽度是条形的总和，不能手动修改；
 * @param {string} 组件的类型 field
 * @param {number} 当前拖拽元素 高 height
 * @param {number} 当前拖拽元素 宽 width
 * @param {number} 当前画布的宽 baseWidth
 * @param {number} 当前画布的高 baseHeight
 * @param {boolean} init 是否是初始化
 * @returns {number}
 */
// eslint-disable-next-line no-unused-vars
const getFinalWidth = ({field, height, width, baseWidth, baseHeight, init = true}) => {
    switch (field) {
        case SHOW_ELEMENTS.BARCODE:
            return 1;
        case COMMON_ELEMENTS.DATE:
            return baseWidth;
        case SHOW_ELEMENTS.LABEL:
        case SHOW_ELEMENTS.TEXT:
            return DEFAULT_STYLE.TEXT_WIDTH;
        default:
            return width;
    }
};

/**
 * 获取元素初始化的 top
 * @param {string} field SHOW_ELEMENTS 和 COMMON_ELEMENTS 的枚举值
 * @param {number} top 通用计算的高度
 * @param {object} baseInfo 画布的信息，可通过长宽高计算出最终的位置
 * @param {boolean} init 是否是初始化
 * @returns {number}
 */
// eslint-disable-next-line no-unused-vars
const getFinalTop = ({field, top, baseInfo, init = true}) => {
    switch (field) {
        case COMMON_ELEMENTS.DATE:
            return baseInfo.height - DEFAULT_STYLE.BASE_DISTANCE; // 20 是日期组件的高度
        default:
            return top;
    }
};

/**
 * 获取元素初始化的 left
 * @param {string} field SHOW_ELEMENTS 和 COMMON_ELEMENTS 的枚举值
 * @param {number} top 通用计算的高度
 * @param {object} baseInfo 画布的信息，可通过长宽高计算出最终的位置
 * @param {boolean} init 是否是初始化
 * @returns {number}
 */
// eslint-disable-next-line no-unused-vars
const getFinalLeft = ({field, left, baseInfo, init = true}) => {
    switch (field) {
        case COMMON_ELEMENTS.DATE:
            return DEFAULT_STYLE.FIXED_LEFT;
        default:
            return left;
    }
};

/**
 * 该组件是否支持绑定动态数据
 * @param {string} field SHOW_ELEMENTS 和 COMMON_ELEMENTS 的枚举值
 * @returns boolean
 */
const isNotBindField = (field) => {
    return [...Object.values(COMMON_ELEMENTS), SHOW_ELEMENTS.LABEL].includes(field);
};

/**
 * 隐藏拖拽按钮
 * @param {string} field SHOW_ELEMENTS 和 COMMON_ELEMENTS 的枚举值
 * @returns boolean
 */
const doNotShowDragBar = (field) => {
    return [SHOW_ELEMENTS.BARCODE].includes(field);
};

/**
 * 过滤对象的属性
 * @param {Object} obj 被过滤的对象
 * @param {Array} props 需要过滤的属性
 * @param {Boolean} exclude 是否排除, true 排除传入的属性, false 只保留传入的属性
 * @returns Object
 */
const filterProps = (obj = {}, props = [], exclude = true) => {
    const excludeObj = {};
    const includeObj = {};
    for (let key in obj) {
        if (props.indexOf(key) === -1) {
            excludeObj[key] = obj[key];
        } else {
            includeObj[key] = obj[key];
        }
    }
    return exclude ? excludeObj : includeObj;
};

/**
 * 根据组件类型设置组件的展示值,或者设置组件的默认值
 * @param {object} elementInfo 当前对象的信息
 * @param {string} labelKey 数据源绑定的字段，可根据接口数据动态展示文本信息
 * @param {number} total 分页的总页数,组件渲染时传入
 * @param {number} current 当前页数，组件渲染时传入
 * @returns {{field: string, info: string, componentProps: object}}}
 * 这里的方法的功能，可以在各自组件的内部实现
 * 这里只是做一下简单数据的封装或者拼接，复杂逻辑还是回归到各自的组件内部实现
 * 可以查看  components/common/DateInfo.jsx 的备注
 */
const renderInitData = (elementInfo, labelKey = 'name', total = 1, current = 1) => {
    const { showData, dataKeyLabel, field, componentProps = {} } = elementInfo;
    // 首先展示 showData，如果没有展示 dataKeyLabel (组件的名称)，如果没有展示 elementInfo[labelKey]
    let info = showData || dataKeyLabel || elementInfo[labelKey];
    // 每个组件都会保存这个两个属性，用于分页
    // TODO: 根据当前页数来决定组件是否展示，只在首页展示的功能 showPageNumber
    switch (field) {
        case COMMON_ELEMENTS.PAGINATION:
            info = `${current}/${total}`;
            break;
    }
    return {
        field,
        info,
        componentProps
    };
};

const injectIcon = () => {
    let scriptElement = document.querySelector(`#${ICON_SCRIPT_ID}`);
    /**
     * 阿里妈妈 iconfont svg
     */
    if(!scriptElement) {
        scriptElement = document.createElement('script');
        scriptElement.type = 'text/javascript';
        scriptElement.id = ICON_SCRIPT_ID;
        scriptElement.src = icon_src;
        document.querySelector('body').appendChild(scriptElement);
    }
};

const createViewRoot = (id = VIEW_PRINT_TEMPLATE_ID, containerTag = 'body') => {
    let viewRoot = document.querySelector(`#${id}`);
    if(!viewRoot) {
        viewRoot = document.createElement('div');
        viewRoot.id = id;
        document.querySelector(containerTag).appendChild(viewRoot);
    }
    return viewRoot;
};


/**
 * 批量打印面单
 * @param {Object}      param0
 * @param {Object}      param0.ticketTemplateInfo   模板信息
 * @param {Array}       param0.list                 打印数据
 * @param {Object}      param0.socket               打印机
 * @param {string}      param0.printer              打印机类型
 * @param {boolean}     param0.isHide               是否隐藏打印面单 默认隐藏 true
 * @param {Array}       param0.actionItems          操作按钮图标（ACTIONS_TYPE） 默认不展示
 * @param {Function}    [param0.handleActions]      操作按钮的事件 可选
 * @param {Function}    [param0.successFunc]        打印完成的回调 可选
 * @param {number}      [param0.index=0]            当前打印的索引 默认 0
 * @returns
 */
const printTickets = ({
    ticketTemplateInfo,
    list,
    socket,
    printer,
    isHide = true,
    actionItems = [],
    handleActions,
    successFunc,
    index = 0
}) => {
    if(!ticketTemplateInfo) {
        console.error('未传入模板信息');
        return;
    }
    if(!socket) {
        console.error('未传入打印机');
        return;
    }
    if(!printer) {
        console.error('未传入打印机类型');
        return;
    }
    const props = list[index];
    if(!props) {
        if(index > 0) {
            console.log('打印完成');
            if(isHide) { // 未展示的时候，打印完成后直接关闭掉，移除dom
                View.closeView();
            }
            successFunc && successFunc();
        } else {
            console.error('未传入打印数据');
        }
        return;
    }
    View.openView({
        ...ticketTemplateInfo,
        total: list.length,
        current: index + 1,
        dataSource: props,
        actionItems,
        isHide,  // 隐藏打印面单
        handleActions,
        print: () => {
            TicketTemplate.toImage(ticketTemplateInfo.baseInfo, socket, printer).then(() => {
                printTickets({
                    ticketTemplateInfo,
                    list,
                    socket,
                    printer,
                    isHide,
                    actionItems,
                    handleActions,
                    successFunc,
                    index: index + 1
                });
            });
        }
    });
};

/** 实时编辑数据源 相关方法开始 */
const createSourceModal = (templateId, templateProperties = []) => {
    if(!templateProperties || !templateProperties.length) {
        console.error('未传入模板信息');
        return;
    }
    const finalProperties = [];
    const needDataKey = [];
    const neeField = [];

    /**
     * 模拟数据源时，需要知道数据的 dataKey 和 field
     * dataKey 用于动态绑定服务端数据
     * field 用于区分组件类型
     */
    templateProperties.forEach((item) => {
        const { dataKey, name, id, field } = item;
        if(!dataKey) {
            needDataKey.push(`${name}(${id})`);
        } else if(!field) {
            neeField.push(`${name}(${id})`);
        }
        if(dataKey && field) {
            finalProperties.push({
                ...item
            });
        }
    });
    if(needDataKey.length) {
        console.error('以下模板信息未绑定数据源', needDataKey.join(' | '));
    }
    if(neeField.length) {
        console.error('以下模板信息未绑定数据源', needDataKey.join(' | '));
    }
    if(!finalProperties.length) {
        console.error('请绑定模板信息的 数据源');
        return;
    }
    const sourceEditElement = createViewRoot(TEMPLATE_SOURCE_ID, `#${templateId}`);
    sourceEditElement.innerHTML = renderCeil(finalProperties);
    return sourceEditElement;
};

const renderCeil = (list) => {
    return list.map((item) => {
        const { dataKey, name, id } = item;
        return `<div class="template-source-edit-item" id="${id}" key="${id}" data-key="${dataKey}" data-id="${id}">
            <p class="title">${name}(${dataKey})</p>
            <p><input data-key="${dataKey}" type="text" /></p>
        </div>`;
    }).concat([
        `<div>
            <p id="${SOURCE_BTN_TYPE.cancel}" class="cancel">X</p>
            <p id="${SOURCE_BTN_TYPE.confirm}" class="confirm">√</p>
        </div>`
    ]).join('');
};

// 获取编辑数据源 modal 框里的 inputs 里面的数据
// 不会对数据的准确性进行校验，例如， 图片组件如果传入的是非图片链接，会导致打印失败，这不会做校验，但是图片组件内部的 error 时间会响应
const getSourceByInputs = (inputs) => {
    if(!inputs || inputs.length === 0) {
        console.error('未传入数据源');
        return;
    }
    const source = {};
    inputs.forEach((item) => {
        const dataKey = item.getAttribute('data-key');
        const value = item.value;
        source[dataKey] = value || 'XXXX';
    });
    return source;
};

const sourceModalEdit = (templateId, templateRenderedProperties, templateInfo) => {
    const sourceModal = createSourceModal(templateId, templateRenderedProperties);
    sourceModal.addEventListener('click', (e) => {
        const targetId = e.target && e.target.id;
        switch (targetId) {
            case SOURCE_BTN_TYPE.cancel:
                sourceModal.remove();
                View.closeView();
                break;
            case SOURCE_BTN_TYPE.confirm:
                {
                    const inputs = sourceModal.querySelectorAll('input');
                    const dataSource = getSourceByInputs(inputs);
                    if(dataSource) {
                        View.openView({
                            ...templateInfo,
                            actionItems: [],
                            dataSource: getSourceByInputs(inputs)
                        });
                    }
                }
                break;
        }
    });
    return sourceModal;
};

/** 实时编辑数据源 相关方法结束 */
export {
    isHttp,
    isChinese,
    isNotBindField,
    doNotShowDragBar,

    setUnit,
    setDotsStyle,
    setDotsStylePosition,
    setDragBarPosition,

    calculatePosition,
    getUnitStyle,
    getFinalHeight,
    getFinalWidth,
    getFinalTop,
    getFinalLeft,

    renderInitData,
    injectIcon,

    createViewRoot,
    sourceModalEdit,

    printTickets,

    filterProps,

    debounce
};