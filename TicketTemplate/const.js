const CANVAS_ID = 'ticket-main';

// 拖拽元素的基础样式，注意顺序
const DRAG_ITEM_BASE_CLASS = ['left_top', 'right_top', 'left_bottom', 'right_bottom'];
const BASE_DISTANCE = -10;

/**
 *  拖拽的按钮交互模式
 *  SHOW: 一直展示拖拽的按钮
 *  SWITCH: 鼠标移入展示，移出隐藏
 *  HOVER: 鼠标移入展示，移出隐藏
 */
const MODES = {
    SHOW: 'SHOW',
    SWITCH: 'SWITCH',
    HOVER: 'HOVER'
};

/**
 * 使用 $ 进行链接主要是为了保证不会和数据元素的名称重复
 */
const ELEMENTS = {
    LAYOUT: 'LAYOUT',                       // 画布背景 固定大小
    MAIN: 'MAIN',                           // 面单画布 最终打印出来的区域
    PROPERTY: 'FUNC$PROPERTY',              // 组件属性元素通用名称
    PROPERTY_IN_DRAW: 'PROPERTY$IN$DRAW',   // 画布中的属性元素通用名称
    DATA: 'DATA$PROPERTY',                  // 数据元素通用名称
    PROPERTY_LINNER: 'PROPERTY$LINNER',      // 元素的边框线，业务暂时未使用
    MASK: 'MASK'                          // 遮罩层
};

// 缓存步骤信息
const SAVE_STEP_BY_TIMELINE = 'SAVE_STEP_BY_TIMELINE';

const LAYOUT_INDEX = {
    MAIN: 1,
    PROPERTY_IN_DRAW: 2,
    DATA: 3,
    PROPERTY_IN_DRAW_DRAG_LINE: 3,
    DRAG_ITEM: 1000,
    PRINT_TICKET: -100   // 默认打印时不能出现在页面上
};

const LINE_POSITION = {
    LEFT: 'LEFT',
    RIGHT: 'RIGHT',
    BOTTOM: 'BOTTOM',
    TOP: 'TOP',
    BAR: 'BAR', // 拖拽标记 id
    ACTIVE_INFO: 'ACTIVE_INFO', // 拖拽标记旁边的 数据信息
    DRAG_LINNER_LEFT: 'DRAG_LINNER_LEFT',     // 拖拽元素的左边框线
    DRAG_LINNER_BOTTOM: 'DRAG_LINNER_BOTTOM', // 拖拽元素的下边框线
    ACTIVE_INFO_BOTTOM: 'ACTIVE_INFO_BOTTOM',  // 拖拽元素的上边展示信息区域
    ACTIVE_INFO_LEFT: 'ACTIVE_INFO_LEFT'      // 拖拽元素的左边展示信息区域
};

const HOVER_ACTION = {
    IN: 'IN',
    OUT: 'OUT'
};

// 主要是拖拽元素的距离
const BAR_FIX_POSITION = 5;

const SPLITOR = '_';
const PRE_FIX_KEY = 'DRAW_ELEMENT';

// 默认可以展示组件的页码
const DEFAULT_SHOW_PAGE = 0;

const LANGUAGE_KEY = {
    EN: 'en_US',
    ZH: 'zh_CN'
};

const UNIT = {
    MM: 'mm',
    CM: 'cm',
    PX: 'px'
};

/**
 * 更改这些ID 时注意样式的变动
 */
const TEMPLATE_PREFIX = 'TEMPLATE_ID';
const VIEW_PRINT_TEMPLATE_ID = 'ticket-view-root';
const TEMPLATE_SOURCE_ID = 'template-source-edit';
const SOURCE_BTN_TYPE = {
    cancel: 'SOURCE_BTN_TYPE_CANCEL',
    confirm: 'SOURCE_BTN_TYPE_CONFIRM'
};
// 包含以下字符串的 prop 默认是 图片类型的
const LICK_IMAGE_PROP_KEYS = ['image', 'logo', 'img', 'url', 'icon'];
const LICK_BAR_CODE_PROP_KEYS = ['barcode'];

export {
    CANVAS_ID,
    DRAG_ITEM_BASE_CLASS,
    BASE_DISTANCE,
    MODES,
    LICK_IMAGE_PROP_KEYS,
    LICK_BAR_CODE_PROP_KEYS,

    SAVE_STEP_BY_TIMELINE,

    ELEMENTS,
    LAYOUT_INDEX,

    SPLITOR,
    PRE_FIX_KEY,

    LINE_POSITION,
    HOVER_ACTION,

    BAR_FIX_POSITION,
    DEFAULT_SHOW_PAGE,
    LANGUAGE_KEY,

    TEMPLATE_PREFIX,
    VIEW_PRINT_TEMPLATE_ID,
    TEMPLATE_SOURCE_ID,
    SOURCE_BTN_TYPE,
    UNIT
};