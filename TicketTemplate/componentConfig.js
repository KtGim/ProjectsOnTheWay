import { CUSTOMERS, DEFAULT_DISPLAY_ITEMS, DISPLAY_ITEMS, ITEMS_STYLE } from './components/OperationBar/const';
import * as components from './components/common/index';

/**
 * 数据组件类型
 *
 * 具体用途和使用方法查看  https://best-inc.feishu.cn/wiki/HGVCwr8IqifzPYkG5lpc0IBpn6e
 *
 * ./components/common/ 下的组件
 */
const SHOW_ELEMENTS = {
    IMAGE: 'IMAGE',     // 图片, 服务端也会定义
    // TABLE: 'TABLE',     // 明细, 服务端也会定义
    LABEL: 'LABEL',
    BARCODE: 'BARCODE',
    QRCode: 'QRCode',  // 二维码
    TEXT: 'TEXT'        // 动态展示文本, 服务端也会定义
};

/**
 * 通用组件类型
 *
 * 具体用途和使用方法查看  https://best-inc.feishu.cn/wiki/HGVCwr8IqifzPYkG5lpc0IBpn6e
 *
 * ./components/common/ 下的组件
 */
const COMMON_ELEMENTS = {
    DATE: 'DATE',       // 日期
    PAGE_HEADER: 'PAGE_HEADER', // 页眉
    PAGE_FOOTER: 'PAGE_FOOTER', // 页脚
    PAGINATION: 'PAGINATION', // 分页
    CUSTOM: 'CUSTOM' // 自定义组件
};

/**
 * 组件 key 和 组件的映射关系
 */
const SHOW_ELEMENTS_KEY_TO_COMPONENT = {
    [SHOW_ELEMENTS.BARCODE]: components.BarCode,
    [SHOW_ELEMENTS.QRCode]: components.QrCode,
    [SHOW_ELEMENTS.IMAGE]: components.ImageContainer,
    [SHOW_ELEMENTS.TEXT]: components.TextDisplay,
    [SHOW_ELEMENTS.LABEL]: components.Label,
    [COMMON_ELEMENTS.DATE]: components.DateInfo,
    [COMMON_ELEMENTS.PAGINATION]: components.DateInfo
};

/**
 * 不同组件的操作栏是不一样的
 */
const BASE_DISPLAY_ITEMS = [
    DISPLAY_ITEMS.WIDTH,
    DISPLAY_ITEMS.HEIGHT,
    DISPLAY_ITEMS.LEFT,
    DISPLAY_ITEMS.TOP
];
// 二维码的操作栏
const QRCODE_DISPLAY_ITEMS = [
    ...BASE_DISPLAY_ITEMS
];

// 条形码的操作栏
const BARCODE_DISPLAY_ITEMS = [
    ITEMS_STYLE.BARCODE_TEXT_DISPLAY,
    ...BASE_DISPLAY_ITEMS
];

// 图片的操作栏
const IMAGE_DISPLAY_ITEMS = [
    ...BASE_DISPLAY_ITEMS
];

// 文本的操作栏, 使用默认的
// const TEXT_DISPLAY_ITEMS = [
//     ...BASE_DISPLAY_ITEMS
// ];

/**
 * 根据不同的组件展示不同的操作菜单
 */

const CUSTOM_BARS = [...DEFAULT_DISPLAY_ITEMS];
    CUSTOM_BARS.splice(2, 0, CUSTOMERS.CUSTOM); // 插入自定义组件的Icon

const COMPONENT_DISPLAY_ITEMS = {
    [SHOW_ELEMENTS.QRCode]: QRCODE_DISPLAY_ITEMS,
    [SHOW_ELEMENTS.BARCODE]: BARCODE_DISPLAY_ITEMS,
    [SHOW_ELEMENTS.IMAGE]: IMAGE_DISPLAY_ITEMS,
    // 标签自适应大小，不需要垂直居中
    [SHOW_ELEMENTS.LABEL]: DEFAULT_DISPLAY_ITEMS.filter(item => item !== DISPLAY_ITEMS.ALIGN_VERTICAL),
    [CUSTOMERS.CUSTOM]: CUSTOM_BARS
};

const OPERATIONS = {
    VIEW: 'VIEW',
    EDIT: 'EDIT',
    DELETE: 'DELETE',
    COPY: 'COPY',
    UNDO: 'UNDO',
    SETTING: 'SETTING',
    CLOSE: 'CLOSE',
    PRINT: 'PRINT',
    SAVE: 'SAVE'
};

// 数据图标
const DATA_ICONS = {
    NO_DATA: 'NO_DATA',
    OPEN_EYES: 'OPEN_EYES',
    CLOSE_EYES: 'CLOSE_EYES',
    SOURCE: 'SOURCE'
};

/**
 * 阿里妈妈 iconfont
 *
 * 根据组件类型展示 icon
 */
const icon_src = 'http://at.alicdn.com/t/c/font_4167045_0fcq9e85lwfj.js';
const ICON_SCRIPT_ID = 'iconfont-script';

const iconNameMap = {
    // 编辑器组件
    [DISPLAY_ITEMS.BOLD]: 'bold',
    [DISPLAY_ITEMS.ITALIC]: 'italic',
    [DISPLAY_ITEMS.UNDERLINE]: 'xiahuaxian',
    [DISPLAY_ITEMS.DELETE]: 'shanchuxian',
    [DISPLAY_ITEMS.ALIGN_LEFT]: 'text-align-left',
    [DISPLAY_ITEMS.ALIGN_CENTER]: 'text-align-justify',
    [DISPLAY_ITEMS.ALIGN_RIGHT]: 'text-align-right',
    [DISPLAY_ITEMS.ALIGN_VERTICAL]: 'vertical',
    [DISPLAY_ITEMS.BORDER]: 'border',
    // 元素组件
    [SHOW_ELEMENTS.IMAGE]: 'image',
    [SHOW_ELEMENTS.TEXT]: 'text',
    [SHOW_ELEMENTS.BARCODE]: 'tiaoxingma',
    [SHOW_ELEMENTS.QRCode]: 'erweima',
    [SHOW_ELEMENTS.LABEL]: 'label-o',
    // 通用组件
    [COMMON_ELEMENTS.DATE]: 'dateTimeBox',
    [COMMON_ELEMENTS.PAGE_HEADER]: 'yetou',
    [COMMON_ELEMENTS.PAGE_FOOTER]: 'footprints',
    [COMMON_ELEMENTS.CUSTOM]: 'custom',
    [COMMON_ELEMENTS.PAGINATION]: 'fenyeqi',
    // 操作栏
    [OPERATIONS.VIEW]: 'view',
    [OPERATIONS.EDIT]: 'edit-pencil-line-02',
    [OPERATIONS.DELETE]: 'shanchu',
    [OPERATIONS.COPY]: 'fuzhi',
    [OPERATIONS.UNDO]: 'undo',
    [OPERATIONS.SETTING]: 'shezhi',
    [OPERATIONS.CLOSE]: 'guanbi',
    [OPERATIONS.PRINT]: 'dayinji',
    [OPERATIONS.SAVE]: 'baocun',

    // 条形码 特殊操作 图标
    [ITEMS_STYLE.BARCODE_TEXT_DISPLAY]: 'tiaoxingma',

    // 数据提示
    [DATA_ICONS.NO_DATA]: 'zanwushuju',
    [DATA_ICONS.OPEN_EYES]: 'yanjing',
    [DATA_ICONS.CLOSE_EYES]: 'biyan',
    [DATA_ICONS.SOURCE]: 'moban'
};

// icon 前缀 best-bold
const ICON_PREFIX = '#best-';

const DEFAULT_STYLE = {
    TEXT_WIDTH: 100,
    BASE_DISTANCE: 40,
    COMMON_HEIGHT: 20,
    BARCODE_HEIGHT: 50,
    FIXED_LEFT: 0,
    FIXED_TOP: 0
};

const ACTIONS_TYPE = [OPERATIONS.SAVE, DATA_ICONS.OPEN_EYES, DATA_ICONS.CLOSE_EYES, OPERATIONS.PRINT, OPERATIONS.VIEW, OPERATIONS.EDIT, OPERATIONS.COPY, DATA_ICONS.SOURCE];
export {
    SHOW_ELEMENTS,
    COMMON_ELEMENTS,
    SHOW_ELEMENTS_KEY_TO_COMPONENT,
    COMPONENT_DISPLAY_ITEMS,
    OPERATIONS,

    DATA_ICONS,
    ICON_PREFIX,
    iconNameMap,
    icon_src,
    ICON_SCRIPT_ID,

    DEFAULT_STYLE,

    ACTIONS_TYPE
};