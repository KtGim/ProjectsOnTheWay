import { COMMON_ELEMENTS, DEFAULT_STYLE, ICON_SCRIPT_ID, OPERATIONS, SHOW_ELEMENTS, icon_src } from './componentConfig';
import View from './components/View';
import { BAR_FIX_POSITION, BASE_DISTANCE, ELEMENTS, LAYOUT_INDEX, LINE_POSITION, PRE_FIX_KEY, SOURCE_BTN_TYPE, SPLITOR, TEMPLATE_SOURCE_ID, UNIT, VIEW_PRINT_TEMPLATE_ID } from './const';
import html2canvas from 'html2canvas';
import { px2in } from './size';

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
 * @param {object} info
 * @param {string} info.field 组件的类型 field
 * @param {number} info.height 当前拖拽元素 高 height
 * @param {number} info.width 当前拖拽元素 宽 width
 * @param {number} info.baseWidth 当前画布的宽 baseWidth
 * @param {number} info.baseHeight 当前画布的高 baseHeight
 * @param {boolean} info.init 是否是初始化
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
 * @param {string} pageType 页面类型，组件渲染时传入
 * @returns {{field: string, info: string, componentProps: object}}}
 * 这里的方法的功能，可以在各自组件的内部实现
 * 这里只是做一下简单数据的封装或者拼接，复杂逻辑还是回归到各自的组件内部实现
 * 可以查看  components/common/DateInfo.jsx 的备注
 */
const renderInitData = (elementInfo, labelKey = 'name', total = 1, current = 1, pageType = OPERATIONS.EDIT) => {
    const { showData, dataKeyLabel, field, componentProps = {}, isRealData = false } = elementInfo;
    // 首先展示 showData，如果没有展示 dataKeyLabel (组件的名称)，如果没有展示 elementInfo[labelKey]
    const dataComponents = [SHOW_ELEMENTS.BARCODE, SHOW_ELEMENTS.QRCode, SHOW_ELEMENTS.TEXT];
    let info = showData || dataKeyLabel || elementInfo[labelKey];
    if(!isRealData && pageType == OPERATIONS.VIEW && dataComponents.includes(field)) { // 预览模式下数据类型组件全部替换成 XXXX
        info = 'XXXXX';
        // Array.from({length: Math.random() * 10}).fill('X').join('');
    }
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
 * @param {function}    param0.printCb              打印一张后的回调
 * @param {string}      param0.printer              打印机类型
 * @param {boolean}     param0.isHide               是否隐藏打印面单 默认隐藏 true
 * @param {Array}       param0.actionItems          操作按钮图标（ACTIONS_TYPE） 默认不展示
 * @param {Function}    [param0.handleActions]      操作按钮的事件 可选
 * @param {number}      [param0.index=0]            当前打印的索引 默认 0
 * @param {string}      [param0.paper='']           打印纸张类型 默认 '' printer 不存在是，这个字段可以结合 pet 的默认打印机进行起作用
 * @returns
 */
const printTickets = ({
    ticketTemplateInfo,
    list,
    printer,
    isHide = true,
    actionItems = [],
    handleActions,
    index = 0,
    printCb,
    paper = ''
}) => {
    if(!ticketTemplateInfo) {
        console.error('未传入模板信息');
        return;
    }
    const props = list[index];
    if(!props) {
        if(index > 0) {
            if(isHide) { // 未展示的时候，打印完成后直接关闭掉，移除dom
                View.closeView();
            }
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
            toImage(ticketTemplateInfo.baseInfo, printer, paper || props.paper).then((data) => {
                View.closeView();
                // 递归调用自己
                printCb && printCb(data, () => {
                    printTickets({
                        ticketTemplateInfo,
                        list,
                        printer,
                        isHide,
                        actionItems,
                        handleActions,
                        index: index + 1,
                        printCb,
                        paper
                    });
                }, index + 1 == list.length);
            });
        }
    });
};

/**
 * 生成 pdf 并且打印
 * @param {Object}      param0
 * @param {number}      param0.width    模板宽度
 * @param {number}      param0.height   模板高度
 * @param {string}      printer         打印机类型
 * @param {function}    cb              回调函数
 */
const toImage = ({width, height}, printer = '', paper = '') => {
    if(!printer && !paper) {
        console.error('TicketTemplate 未传入打印机类型');
        return Promise.reject('TicketTemplate 未传入打印机类型!!');
    }
    return new Promise(resolve => {
        const templateViewRoot = document.querySelector(`#${VIEW_PRINT_TEMPLATE_ID}`);
        if(!templateViewRoot) {
            console.error('渲染模板不存在!!');
            return Promise.reject('渲染模板不存在!!');
        }
        //为了使图像不模糊，先将canvas画布放大若干倍，放在较小的容器内
        // 热敏打印机对图片像素要求高，增大一些倍数使打印更清晰
        // 不要太大，因为 pet 会报出内存不足
        html2canvas(
            templateViewRoot.querySelector('.ticket-main--content'),
            {
                width,
                height,
                scale: 1
            }
        ).then(function (canvas) {
            const printData = {
                method:'PrintReport',
                orderType: 'WEB_IMAGE',
                printer,
                paper,
                imageStream: canvas.toDataURL().replace('data:image/png;base64,', ''),
                documentName:`ONLINE_PAPER_${new Date().getTime()}`,
                // 注意传进来的 尺寸如果不一致，也会导致渲染失败
                imageWidth: px2in(width),
                imageHeight: px2in(height)
            };
            resolve(JSON.stringify(printData));
        });
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

const sourceModalEdit = (templateId, templateRenderedProperties, templateInfo, handleActions) => {
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
                            actionItems: [OPERATIONS.PRINT],
                            handleActions,
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

/**
 * 拖拽画布元素时，计算元素的位置
 * @param {object} state this.state
 * @param {object} state.layoutInfo 画布的信息
 * @param {object} state.baseInfo 面单的信息
 * @param {object} state.currentDragItemPosition 当前拖拽元素的位置信息
 * @returns {object} baseInfoTemp 新的面单位置信息
 */
const getMainByDrop = (state) => {
    const { layoutInfo, baseInfo, currentDragItemPosition } = state;
    const { startClientX, startClientY, clientX, clientY } = currentDragItemPosition;
    const { left, top, width, height } = baseInfo;
    // 起始拖拽位置 距离画布最左侧的位置， 拖拽最后到达 layout 的距离不能比这个小，否则就去临界值
    const leftDistance = startClientX - left;
    const topDistance = startClientY - top;
    const rightDistance = (left + width) - startClientX;
    const bottomDistance = top + height - startClientY;  // 不使用 baseInfo.bottom 是因为在计算过程中有些步骤 bottom 不会重新赋值
    // 正常移动位置
    const baseInfoTemp = {
        ...baseInfo,
        left: clientX - leftDistance,
        right: clientX - leftDistance + width,
        top: clientY - topDistance,
        bottom: clientY - topDistance + height
    };
    // 临界值处理 左 右 上 下
    if((clientX - layoutInfo.left) < leftDistance) {
        baseInfoTemp.left = layoutInfo.left;
        baseInfoTemp.right = layoutInfo.left + width;
    }
    if((layoutInfo.right - clientX) < rightDistance) {
        baseInfoTemp.left = layoutInfo.right - width;
        baseInfoTemp.right = layoutInfo.right;
    }
    if((clientY - layoutInfo.top) < topDistance) {
        baseInfoTemp.top = layoutInfo.top;
        baseInfoTemp.bottom = layoutInfo.top + height;
    }
    if((layoutInfo.bottom - clientY) < bottomDistance) {
        baseInfoTemp.top = layoutInfo.bottom - height;
        baseInfoTemp.bottom = layoutInfo.bottom;
    }
    return baseInfoTemp;
};

/**
 * 获取拖拽中的元素大小
 * @param {object} draggingElementProperty 拖拽中的元素信息
 * @param {object} activeElementInfo 拖拽中元素的初始信息
 * @param {boolean} dragBar 是否是拖拽右下角
 * @returns {object}
 */
const getDraggingElement = (draggingElementProperty, activeElementInfo, dragBar) => {
    const { draggingLeft, draggingTop, draggingWidth, draggingHeight, isOutOfBase } = draggingElementProperty;
    return {
        ...activeElementInfo,
        isOutOfBase,
        style: !dragBar ? {
            ...activeElementInfo.style,
            left: draggingLeft,
            top: draggingTop
        } : {
            ...activeElementInfo.style,
            width: draggingWidth,
            height: draggingHeight
        }
    };
};

/**
 * 找到带有可识别标记的元素
 * @param {event} target 当前拖拽的元素
 * @returns event
 */
const findParent = (target) => {
    if(target.id && target.id.includes(`${ELEMENTS.PROPERTY_IN_DRAW}${SPLITOR}${PRE_FIX_KEY}`)) {
        return target;
    } else {
        return findParent(target.parentNode);
    }
};

/**
 * 拖拽后的元素操作
 */
const dropProperty = (mainElement, state, elementInfo, element, changeStyle = true, errorFunc) => {
    const { currentDragItemPosition, baseInfo, templateRenderedProperties } = state;
    const elementProperty = element.getBoundingClientRect();
    const { left, top, height, width } = baseInfo;
    const { clientX, clientY, startClientX, startClientY } = currentDragItemPosition;
    const { field, style, id } = elementInfo || {};
    if(elementInfo && left <= clientX && top <= clientY && clientX <= (left + width) && clientY <= (top + height)) {
        const finalHeight = getFinalHeight({field, height: elementProperty.height, width: elementProperty.width});
        const elementRight = clientX + elementProperty.width - (startClientX - elementProperty.left);   // 元素右边
        const elementBottom = clientY + finalHeight - (startClientY - elementProperty.top);  // 元素底边
        const elementLeft = clientX + elementProperty.width - (startClientX - elementProperty.left) - elementProperty.width;   // 元素左边
        const elementTop = clientY + finalHeight - (startClientY - elementProperty.top) - finalHeight;  // 元素上边

        const dragLeft = elementRight > (left + width) ? (clientX - ((clientX + elementProperty.width) - (left + width)) - left): clientX - left - (startClientX - elementProperty.left);
        const dragTop = elementBottom > (top + height) ? (clientY - ((clientY + elementProperty.height) - (top + height)) - top): clientY - top - (startClientY - elementProperty.top);
        const propertyInfo = changeStyle ? {
            ...elementInfo,
            elementRight,
            elementBottom,
            elementLeft,
            elementTop,
            style: {
                position: 'absolute',
                zIndex: LAYOUT_INDEX.PROPERTY_IN_DRAW,
                height: finalHeight,
                width: getFinalWidth({field, height: elementProperty.height, width: elementProperty.width, baseWidth: width, baseHeight: height, init: false}),
                /**
                 * 超过临界值那么取临界值 （鼠标越界直接删除元素）
                 * 否则
                 * 鼠标位置 (clientX)  - 初始画布的左上角位置(left) - 拖拽元素时鼠标停留的距离元素的偏移量位置 (startClientX - elementProperty.left)
                 */
                left: getFinalLeft({field, left: dragLeft, baseInfo, init: false}) + mainElement.scrollLeft,
                top: getFinalTop({field, top: dragTop, baseInfo, init: false}) + mainElement.scrollTop
            }
        } : {
            ...elementInfo,
            elementRight,
            elementBottom,
            elementLeft,
            elementTop,
            style: {
                ...(style || {}),
                // 可以进行宽高的初始设定
                width: getFinalWidth({field, height: (style || {}).height, width: (style || {}).width, baseWidth: width, baseHeight: height, init: true}),
                height: getFinalHeight({field, height: (style || {}).height, width: (style || {}).width, baseWidth: width, baseHeight: height, init: true})
            }
        };
        if(id) { // 移动
            const index = (templateRenderedProperties || []).findIndex(({id: fId}) => fId == id);
            templateRenderedProperties.splice(index, 1, propertyInfo);
        } else { // 创建
            propertyInfo.id = `${PRE_FIX_KEY}${SPLITOR}${new Date().getMilliseconds()}`;
            templateRenderedProperties.push(propertyInfo);
        }
        return {
            currentDragItemPosition: {},
            templateRenderedProperties,
            activeElementInfo: propertyInfo
        };
    } else {
        // 超出范围
        (errorFunc || console.error)('超出范围');
        return  false;
    }
};

/**
 * 获取元素的 id
 */
const getComponentId = (idString='', prefix = '', splitor= SPLITOR) => {
    return idString.replace(`${prefix}${splitor}`, '');
};

/**
 * 移动过程中的属性转变， 返回当前拖拽元素的属性
 * @param {object} props 需要传入的属性
 * @param {object} props.state this.state
 * @param {object} props.mainRef this.mainRef
 * @param {object} props.draggingElementProperty this.draggingElementProperty 拖拽中的元素信息
 * @param {object} props.canDragOut 是否可以拖拽出画布
 * @param {number} props.clientX 鼠标的位置
 * @param {number} props.clientY 鼠标的位置
 * @param {function} props.exceedFunc 超出范围的回调函数
 * @returns {object} draggingElementProperty
 */
const getMoveProperty = ({
    state,
    mainRef,
    clientX,
    clientY,
    draggingElementProperty,
    canDragOut = true,
    exceedFunc
}) => {
    const { activeElementInfo, dragBar, txtInfo, baseInfo, currentDragItemPosition, activeElements } = state;
    const inBatchDragging = activeElements.some(({id}) => id == activeElementInfo.id);
    const element = mainRef[mainRef.getElementKey(activeElementInfo)]; // 当前数据元素
    const elementRef = mainRef.elementRef;
    const barRef = elementRef.doitsRef[elementRef.getDoitKet(LINE_POSITION.BAR)]; // 拖拽移动元素
    const drag_linner_left = elementRef.doitsRef[elementRef.getDoitKet(LINE_POSITION.DRAG_LINNER_LEFT)]; // 标齐线竖线
    const drag_linner_bottom = elementRef.doitsRef[elementRef.getDoitKet(LINE_POSITION.DRAG_LINNER_BOTTOM)]; // 标齐线横线
    const barInfoRef = elementRef.doitsRef[elementRef.getDoitKet(LINE_POSITION.ACTIVE_INFO)]; // 拖拽时展示信息元素
    const drag_linner_left_info_Ref = elementRef.doitsRef[elementRef.getDoitKet(LINE_POSITION.ACTIVE_INFO_LEFT)]; // 拖拽时展示信息元素
    const drag_linner_bottom_info_Ref = elementRef.doitsRef[elementRef.getDoitKet(LINE_POSITION.ACTIVE_INFO_BOTTOM)]; // 拖拽时展示信息元素
    if(!draggingElementProperty) {
        draggingElementProperty = element.getBoundingClientRect();
    }
    /**
     * 计算拖拽中元素的具体位置
     */
    let { left, top, height, width } = baseInfo;
    const { startClientX, startClientY } = currentDragItemPosition;
    const { left:el, top:et, height:eh, width:ew } = draggingElementProperty;
    const absX = startClientX - el;
    const absY = startClientY - et;
    const elementRight = clientX + ew - absX;   // 元素右边  相对base 的位置上， startClientX - el 是移动的距离 + 右移， - 左移
    const elementBottom = clientY + eh - absY;  // 元素底边
    // 左右不做限制，可以随意拖拽，注释部分不能拖出最右和最下边区域
    let draggingLeft = 0;
    let draggingTop = 0;
    const scrollTop = mainRef.mainRef.scrollTop;
    const scrollLeft = mainRef.mainRef.scrollLeft;
    if(canDragOut) {
        draggingLeft = clientX - left - absX + scrollLeft;
        draggingTop = clientY - top - absY + scrollTop;
    } else {
        draggingLeft = (elementRight > (left + width) ? (clientX - ((clientX + ew) - (left + width)) - left): clientX - left - absX) + scrollLeft;
        draggingTop = (elementBottom > (top + height) ? (clientY - ((clientY + eh) - (top + height)) - top): clientY - top - absY) + scrollTop;
    }
    if(dragBar) { // 放大缩小元素时，不能需要移动元素，改变元素宽高
        const { style, field } = activeElementInfo;
        const { left, top, height, width } = style;
        const draggingWidth = draggingLeft - left + width + 1;
        const draggingHeight = getFinalHeight({field, height: draggingTop - top + height, width: draggingWidth, init: false});
        element.style.width = `${draggingWidth}px`;
        element.style.height = `${draggingHeight}px`;
        const dotStyle = setDragBarPosition({...element.style, height: draggingHeight, width: draggingWidth, fixPosition: BAR_FIX_POSITION}, 'px');
        barRef.style.left = dotStyle.left;
        barRef.style.top = dotStyle.top;
        barInfoRef.innerHTML = `${txtInfo.height}: ${draggingHeight.toFixed(1)}<br/> ${txtInfo.width}: ${draggingWidth.toFixed(1)}`;

        draggingElementProperty.draggingWidth = draggingWidth;
        draggingElementProperty.draggingHeight = draggingHeight;
    } else { // 移动元素时，改变元素位置
        element.style.left = `${draggingLeft}px`;
        element.style.top = `${draggingTop}px`;
        const dotStyle = setDragBarPosition({...element.style, fixPosition: BAR_FIX_POSITION}, 'px');
        barRef.style.left = dotStyle.left;
        barRef.style.top = dotStyle.top;
        barInfoRef.innerHTML = `${txtInfo.height}: ${activeElementInfo.style.height.toFixed(1)}<br/> ${txtInfo.width}: ${activeElementInfo.style.width.toFixed(1)}`;
        draggingElementProperty.draggingTop = draggingTop;
        draggingElementProperty.draggingLeft = draggingLeft;
    }
    drag_linner_left_info_Ref.innerHTML = `${txtInfo.left}: ${(draggingElementProperty.draggingLeft || activeElementInfo.style.left).toFixed(1)}`;
    drag_linner_bottom_info_Ref.innerHTML = `${txtInfo.top}: ${(draggingElementProperty.draggingTop || activeElementInfo.style.top).toFixed(1)}`;
    drag_linner_left.style.left = `${draggingElementProperty.draggingLeft}px`;
    drag_linner_bottom.style.top = `${draggingElementProperty.draggingTop}px`;
    // 是否是超出 base 画布
    draggingElementProperty.isOutOfBase = isOutOfBase(activeElementInfo.isOutOfBase, height, width, draggingElementProperty, exceedFunc ? () => {
        exceedFunc(element);
    } : undefined);
    activeElementInfo.isOutOfBase = draggingElementProperty.isOutOfBase;
    // 元素 上下左右 超出画布的 上下左右
    let inBatchDraggingDataInfo = null;
    if(inBatchDragging) {
        inBatchDraggingDataInfo = {};
        const resetElements = activeElements.filter(({id}) => id != activeElementInfo.id);
        const moveX = clientX - startClientX;
        const moveY = clientY - startClientY;
        // TODO: 批量拖拽barcode 时，计算的位置会有些许问题
        resetElements.forEach((item) => {
            const element = mainRef[mainRef.getElementKey(item)];
            const movedX = item.style.left + moveX;
            const movedY = item.style.top + moveY;
            element.style.left = `${movedX}px`;
            element.style.top = `${movedY}px`;
            const isOutOfBaseItem = isOutOfBase(
                item.isOutOfBase,
                height,
                width,
                {draggingLeft: movedX, draggingTop: movedY, draggingHeight: item.style.height, draggingWidth: item.style.width}
            );
            item.isOutOfBase = isOutOfBaseItem;
            inBatchDraggingDataInfo[item.id] = {
                left: movedX,
                top: movedY,
                isOutOfBase: isOutOfBaseItem
            };
            if(isOutOfBaseItem) {
                exceedFunc && exceedFunc(item);
            }
        });
    }
    return {
        draggingElementProperty,
        inBatchDraggingDataInfo
    };
};

// 只要有一条边超出 base 的范围那么就是超出范围
// draggingElementProperty 里面的值是拖拽中的元素的位置信息，相对baseInfo 的距离
const isOutOfBase = (preOutOfBase, height, width, draggingElementProperty, exceedFunc) => {
    const { draggingLeft, draggingTop, draggingHeight, draggingWidth, height:DH, width:DW } = draggingElementProperty;
    const elementBottom = draggingTop + (draggingHeight || DH);
    const elementRight = draggingLeft + (draggingWidth || DW);
    const curOutOfBase = draggingLeft < 0 || draggingTop < 0 || elementBottom > height || elementRight > width;
    if(!preOutOfBase && curOutOfBase) {
        exceedFunc && exceedFunc();
    }
    return curOutOfBase;
};

export {
    isHttp,
    isChinese,
    isNotBindField,
    doNotShowDragBar,
    toImage,

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
    getMainByDrop,
    getDraggingElement,
    dropProperty,
    getMoveProperty,
    getComponentId,

    renderInitData,
    injectIcon,

    createViewRoot,
    sourceModalEdit,

    printTickets,

    filterProps,
    findParent,

    debounce
};