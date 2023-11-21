const FONT_ITEMS = {
    BOLD: 'bold',
    COLOR: 'color',
    SIZE: 'fontSize'
};

const TEXT_DECORATION_ITEMS = {
    ITALIC: 'italic',
    UNDERLINE: 'underline',
    DELETE: 'line-through'
};

const STYLE_ITEMS = {
    WIDTH: 'width',
    HEIGHT: 'height',
    LEFT: 'left',
    TOP: 'top'
};

const BORDER_STYLE_ITEMS = {
    BORDER: 'border',
    BORDER_STYLE: 'borderStyle',
    BORDER_WIDTH: 'borderWidth',
    BORDER_COLOR: 'borderColor',
    BORDER_RADIUS: 'borderRadius'
};

const TEXT_ALIGN_ITEMS_VALUE = {
    LEFT: 'left',
    CENTER: 'center',
    RIGHT: 'right'
};

const TEXT_ALIGN_ITEMS = {
    ALIGN_LEFT: 'align_left',
    ALIGN_CENTER: 'align_center',
    ALIGN_RIGHT: 'align_right',
    ALIGN_VERTICAL: 'align_vertical'  // 文本垂直居中
};

/**
 * templateRenderedProperties 里面的动态属性都可以进行修改
 * 自定义的项目
 */
const CUSTOMERS = {
    CUSTOM: 'CUSTOM',
    FIELD: 'field',
    SHOW_DATA: 'showData',
    DATA_KEY: 'dataKey',
    DATA_KEY_LABEL: 'dataKeyLabel'
};

const alignMiddleStyle = {
    display: 'table-cell',
    verticalAlign: 'middle'
};

// 字体下拉框的字体大小选项
const FONT_SIZE_ITEMS = [ 12, 14, 16, 18, 20, 22, 24, 26, 28, 30 ];
const FONT_COLOR_ITEMS = [ '#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff', 'red', 'blue', 'yellow' ];

// 文案修饰样式
const FONT_DESC_ITEMS = [ FONT_ITEMS.BOLD, ...Object.values(TEXT_DECORATION_ITEMS), ...Object.values(TEXT_ALIGN_ITEMS)];
// 元素位置样式
const STYLE_DESC_ITEMS = Object.values(STYLE_ITEMS);

const DEFAULT_DISPLAY_ITEMS = [FONT_ITEMS.SIZE, ...FONT_DESC_ITEMS, ...STYLE_DESC_ITEMS];

/**
 * 各个组件的特殊操作
 */
const ITEMS_STYLE = {
    BARCODE_TEXT_DISPLAY: 'BARCODE_TEXT_DISPLAY' // 条形码文本是否显示
};

// 用于展示的操作组件
const DISPLAY_ITEMS = {
    FONT_SIZE: FONT_ITEMS.SIZE,
    BORDER: BORDER_STYLE_ITEMS.BORDER,
    BOLD: FONT_ITEMS.BOLD,
    COLOR: FONT_ITEMS.COLOR,
    ITALIC: TEXT_DECORATION_ITEMS.ITALIC,
    UNDERLINE: TEXT_DECORATION_ITEMS.UNDERLINE,
    DELETE: TEXT_DECORATION_ITEMS.DELETE,
    ALIGN_LEFT: TEXT_ALIGN_ITEMS.ALIGN_LEFT,
    ALIGN_CENTER: TEXT_ALIGN_ITEMS.ALIGN_CENTER,
    ALIGN_RIGHT: TEXT_ALIGN_ITEMS.ALIGN_RIGHT,
    ALIGN_VERTICAL: TEXT_ALIGN_ITEMS.ALIGN_VERTICAL,
    WIDTH: STYLE_ITEMS.WIDTH,
    HEIGHT: STYLE_ITEMS.HEIGHT,
    LEFT: STYLE_ITEMS.LEFT,
    TOP: STYLE_ITEMS.TOP,
    CUSTOM: CUSTOMERS.CUSTOM
};

/**
 * 通过传入的 type 生成对应的样式，渲染组件的样式 style
 * @param {string} type DISPLAY_ITEMS 操作组件
 * @param {string} value 操作组件的值
 */
const renderStyle = (type, value) => {
    if(!type || typeof type !== 'string') return {};
    switch(type) {
        case BORDER_STYLE_ITEMS.BORDER:
            return value;
        case DISPLAY_ITEMS.FONT_SIZE:
            return {
                fontSize: value < FONT_SIZE_ITEMS[0] ? FONT_SIZE_ITEMS[0] : (value > FONT_SIZE_ITEMS[FONT_SIZE_ITEMS.length - 1] ? FONT_SIZE_ITEMS[FONT_SIZE_ITEMS.length - 1] : value)
            };
        case DISPLAY_ITEMS.BOLD:
            return {
                fontWeight: value == 'bold' ? 'normal' : 'bold'
            };
        case DISPLAY_ITEMS.COLOR:
            return {
                color: value
            };
        case DISPLAY_ITEMS.ITALIC:
            return {
                fontStyle: value == 'italic' ? 'normal' : 'italic'
            };
        case DISPLAY_ITEMS.UNDERLINE:
            return {
                textDecoration: value == 'underline' ? 'none' : 'underline'
            };
        case DISPLAY_ITEMS.DELETE:
            return {
                textDecoration: value == 'line-through' ? 'none' : 'line-through'
            };
        case DISPLAY_ITEMS.ALIGN_LEFT:
            return {
                textAlign: value == 'left' ? 'none' : 'left'
            };
        case DISPLAY_ITEMS.ALIGN_CENTER:
            return {
                textAlign: value == 'center' ? 'none' : 'center'
            };
        case DISPLAY_ITEMS.ALIGN_RIGHT:
            return {
                textAlign: value == 'right' ? 'none' : 'right'
            };
        case DISPLAY_ITEMS.WIDTH:
            return {
                width: value
            };
        case DISPLAY_ITEMS.HEIGHT:
            return {
                height: value
            };
        case DISPLAY_ITEMS.LEFT:
            return {
                left: value
            };
        case DISPLAY_ITEMS.TOP:
            return {
                top: value
            };
        default:
    }
};

/**
 * 通过传入的 type 生成对应的样式,渲染组件的属性 props
 * @param {string} DISPLAY_ITEMS操作组件 type
 * @param {string} 操作组件的当前值 value
 */
const renderElementComponentProps = (type, value) => {
    if(!type || typeof type !== 'string') return {};
    switch(type) {
        case ITEMS_STYLE.BARCODE_TEXT_DISPLAY:
            return {
                displayValue: !value // boolean 类型
            };
        case TEXT_ALIGN_ITEMS.ALIGN_VERTICAL:
            // 选中就替换样式否则清空样式
            return {
                alignMiddle: !value
            };
    }
};

const preventFunc = (e) => {
    e.preventDefault();
    e.stopPropagation();
};

const OPERATION_BAR_ID = 'operation_bar';

export {
    CUSTOMERS,

    FONT_ITEMS,
    BORDER_STYLE_ITEMS,
    TEXT_DECORATION_ITEMS,
    STYLE_ITEMS,
    TEXT_ALIGN_ITEMS_VALUE,
    TEXT_ALIGN_ITEMS,

    FONT_SIZE_ITEMS,
    FONT_DESC_ITEMS,

    DEFAULT_DISPLAY_ITEMS,
    DISPLAY_ITEMS,

    FONT_COLOR_ITEMS,
    OPERATION_BAR_ID,
    ITEMS_STYLE,

    alignMiddleStyle,

    renderStyle,
    renderElementComponentProps,
    preventFunc
};