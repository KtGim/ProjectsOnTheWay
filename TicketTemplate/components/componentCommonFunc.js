import { filterProps } from '../funcs';
import { BORDER_STYLE_ITEMS, CUSTOMERS, FONT_COLOR_ITEMS, FONT_ITEMS, FONT_SIZE_ITEMS, ITEMS_STYLE, STYLE_ITEMS, TEXT_ALIGN_ITEMS, TEXT_DECORATION_ITEMS } from './OperationBar/const';

/**
 * 获取当前操作组件的数据和标题
 * @param {当前组件的数据} elementInfo
 * @param {语言包} textInfo
 * @param {操作组件的类型} type
 * @returns
 */
const getCurrentStyleOrProps = (elementInfo, textInfo, type) => {
    const {
        fontSize,
        bold,
        italic,
        underline,
        lineThrough,
        alignLeft,
        alignCenter,
        alignRight,
        width,
        height,
        left,
        top,
        boldDesc,
        italicDesc,
        underlineDesc,
        lineThroughDesc,
        alignLeftDesc,
        alignCenterDesc,
        alignRightDesc,
        fontColorDesc,
        alignMiddleText,
        alignMiddleDesc,
        showBarcodeText,
        borderDesc,
        custom
    } = textInfo || {};
    const { style, componentProps = {} } = elementInfo || { style: {}};
    switch (type) {
        case CUSTOMERS.CUSTOM:
            return {
                value: filterProps(componentProps, [CUSTOMERS.DATA_KEY], false),
                title: custom
            };
        case FONT_ITEMS.SIZE:
            return {
                value: style.fontSize || FONT_SIZE_ITEMS[0],
                title: fontSize
            };
        case BORDER_STYLE_ITEMS.BORDER:
            return {
                value: filterProps(style, Object.values(BORDER_STYLE_ITEMS), false),
                title: borderDesc
            };
        case FONT_ITEMS.COLOR:
                return {
                    value: style.color || FONT_COLOR_ITEMS[0],
                    desc: fontColorDesc
                };
        case FONT_ITEMS.BOLD:
            return {
                value: style.fontWeight,
                desc: boldDesc, // 操作栏按钮的 title 描述
                title: bold     // 如果 OperationBar.renderSvg 有对应的 icon 就会展示 icon，没有的话就会展示这个 title
            };
        case TEXT_DECORATION_ITEMS.ITALIC:
            return {
                value: style.fontStyle,
                desc: italicDesc,
                title: italic
            };
        case TEXT_DECORATION_ITEMS.UNDERLINE:
            return {
                value: style.textDecoration,
                desc: underlineDesc,
                title: underline
            };
        case TEXT_DECORATION_ITEMS.DELETE:
            return {
                value: style.textDecoration,
                desc: lineThroughDesc,
                title: lineThrough
            };
        case TEXT_ALIGN_ITEMS.ALIGN_LEFT:
        case TEXT_ALIGN_ITEMS.ALIGN_CENTER:
        case TEXT_ALIGN_ITEMS.ALIGN_RIGHT:
            return {
                value: style.textAlign || STYLE_ITEMS.LEFT,  // 没有专门定义 align 的样式，所以用 style 代替
                desc: type === TEXT_ALIGN_ITEMS.ALIGN_LEFT ? alignLeftDesc : (type === TEXT_ALIGN_ITEMS.ALIGN_CENTER ? alignCenterDesc : alignRightDesc),
                title: type === TEXT_ALIGN_ITEMS.ALIGN_LEFT ? alignLeft : (type === TEXT_ALIGN_ITEMS.ALIGN_CENTER ? alignCenter : alignRight)
            };
        case TEXT_ALIGN_ITEMS.ALIGN_VERTICAL:
            return {
                value: componentProps.alignMiddle,
                desc: alignMiddleDesc,
                title: alignMiddleText
            };
        case STYLE_ITEMS.WIDTH:
            return {
                value: style.width || 0,
                title: width
            };
        case STYLE_ITEMS.HEIGHT:
            return {
                value: style.height || 0,
                title: height
            };
        case STYLE_ITEMS.LEFT:
            return {
                value: style.left || 0,
                title: left
            };
        case STYLE_ITEMS.TOP:
            return {
                value: style.top || 0,
                title: top
            };
        case ITEMS_STYLE.BARCODE_TEXT_DISPLAY:
            return {
                value: componentProps.displayValue,
                title: showBarcodeText
            };
        default:
            return {};
    }
};

/**
 * 格式化时间
 * @param {Date} date 时间对象
 * @param {string} format 默认 yyyy-MM-dd hh:mm:ss
 * @returns string
 */
const DEFAULT_DATE_FORMAT = 'yyyy-MM-dd hh:mm:ss';
const getDateByFormat = (date, format = DEFAULT_DATE_FORMAT) => {
    const o = {
        'M+': date.getMonth() + 1, //月份
        'd+': date.getDate(), //日
        'H+': date.getHours(), //小时
        'h+': date.getHours(), //小时
        'm+': date.getMinutes(), //分
        's+': date.getSeconds(), //秒
        'q+': Math.floor((date.getMonth() + 3) / 3), //季度
        'S': date.getMilliseconds() //毫秒
    };
    let returnValue = format;
    if (/(y+)/.test(returnValue)) {
        returnValue = returnValue.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp('(' + k + ')').test(returnValue)) {
            returnValue = returnValue.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
        }
    }
    return returnValue;
};

/**
 * 是否是空对象
 */
const isEmptyObject = (obj) => {
    if (!obj) return true;
    return Object.keys(obj).length === 0;
};


export {
    getCurrentStyleOrProps,
    getDateByFormat,
    isEmptyObject
};