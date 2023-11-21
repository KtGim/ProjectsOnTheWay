import React, { PureComponent } from 'react';

import { DEFAULT_DISPLAY_ITEMS, DISPLAY_ITEMS, FONT_ITEMS, ITEMS_STYLE, OPERATION_BAR_ID, STYLE_ITEMS, TEXT_ALIGN_ITEMS, TEXT_DECORATION_ITEMS, alignMiddleStyle, renderElementComponentProps, renderStyle } from './const';
import CommonSelector from './CommonSelector';
import TextDecoration from './TextDecoration';
import InputChange from './InputChange';
import { COMPONENT_DISPLAY_ITEMS, SHOW_ELEMENTS, iconNameMap, ICON_PREFIX, OPERATIONS } from '../../componentConfig';
import { getCurrentStyleOrProps } from '../componentCommonFunc';
import Border from './BorderEditor/index';
import Custom from './Custom';

import './index.less';
import { UNIT } from '../../const';

class OperationBar extends PureComponent {

    renderItems = (items) => {
        return items.map(this.renderItem);
    }

    /**
     * 点击操作栏之后，组件的样式或者参数需要更改
     * 有一些操作可以直接印象属性的变化如 width 或者 height
     * 有一些操作只能通过值来更正样式的变化 如 文本垂直居中
     * ========================
     *      props.handleStyleChange 也可以改变组件的属性
     * ========================
     * @param {string} info 更改后的值
     * @param {string} type 当前的操作类型 DISPLAY_ITEMS 的枚举
     */
    handleStyleChange = (info, type) => {
        const { elementInfo } = this.props;
        const { handleStyleChange } = this.props;
        const newElementInfo = JSON.parse(JSON.stringify(elementInfo || {})) || {};
        const styleInfo = renderStyle(type, info);              // 根据样式类型来渲染样式
        const componentProps = renderElementComponentProps(type, info);    // 根据组件类型来渲染组件的属性
        // 根据组件类型来更改元素样式
        switch (elementInfo.field) {
            case SHOW_ELEMENTS.QRCode:
                if(type === DISPLAY_ITEMS.WIDTH) {
                    styleInfo.height = styleInfo.width;
                } else if(type === DISPLAY_ITEMS.HEIGHT) {
                    styleInfo.width = styleInfo.height;
                }
                break;
        }
        newElementInfo.style = {
            ...(newElementInfo.style || {}),
            ...styleInfo
        };
        // 根据操作类型来更改元素样式
        switch (type) {
            case TEXT_ALIGN_ITEMS.ALIGN_VERTICAL: // 文本垂直居中
                {
                    if(componentProps.alignMiddle) {
                        newElementInfo.style = {
                            ...newElementInfo.style,
                            ...alignMiddleStyle
                        };
                    } else {
                        newElementInfo.style.display = undefined;
                        newElementInfo.style.verticalAlign = undefined;
                    }
                }
                break;
        }

        newElementInfo.componentProps = {
            ...(newElementInfo.componentProps || {}),
            ...componentProps
        };
        handleStyleChange && handleStyleChange(newElementInfo);
    }
    /**
     * 用于更改组件的属性值
     *  props.handleStyleChange 也可以改变组件的属性
     * 可以通过具体的 type 来改变组件的属性
     */
    // eslint-disable-next-line no-unused-vars
    handlePropertyChange = (propValue = {}, type) => {
        const { elementInfo } = this.props;
        const { handleStyleChange } = this.props;
        handleStyleChange && handleStyleChange({...elementInfo, ...propValue});
    }
    /**
     * @param {string} type 组件展示的类型，iconNameMap 的 key 值
     * @param {string} value 默认展示的数值，如果 iconNameMap 中不存在则展示这个值
     * @param {boolean} showIcon 是否展示 icon
     * @param {string} title svg 的 title 属性
     * @param {object} style svg 的样式,只有在 svg 能渲染时才生效
     * @returns {React.Component | string}
     */
    static renderSvgIcon = (type, value, showIcon = false, title, style) => {
        return (iconNameMap[type] && showIcon) ? <svg style={style ? style : undefined} className="icon" aria-hidden="true">
            {title ? <title>{title}</title> : null}
            <use xlinkHref={`${ICON_PREFIX}${iconNameMap[type]}`}></use>
        </svg> : value || title;
    }

    /**
     * 通过类型来渲染组件的样式
     * @param {string} ITEMS_STYLE或者DISPLAY_ITEMS的枚举值 type
     * @returns {React.Component}
     */
    renderItem = (type = FONT_ITEMS.SIZE) => {
        const { elementInfo, txtInfo, restProps = {}, customProps = {}, onElement = false } = this.props;
        let Com = null;
        let unit = UNIT.PX;
        switch (type) {
            case FONT_ITEMS.SIZE:   // 此类修针对单个样式
            case FONT_ITEMS.COLOR:
                Com = CommonSelector;
                break;
            case FONT_ITEMS.BOLD:
            case TEXT_DECORATION_ITEMS.UNDERLINE:
            case TEXT_DECORATION_ITEMS.DELETE:
            case TEXT_DECORATION_ITEMS.ITALIC:
            case TEXT_ALIGN_ITEMS.ALIGN_CENTER:
            case TEXT_ALIGN_ITEMS.ALIGN_LEFT:
            case TEXT_ALIGN_ITEMS.ALIGN_RIGHT:
            case TEXT_ALIGN_ITEMS.ALIGN_VERTICAL:
            case ITEMS_STYLE.BARCODE_TEXT_DISPLAY:
                Com = TextDecoration;
                break;
            case STYLE_ITEMS.LEFT:
            case STYLE_ITEMS.TOP:
            case STYLE_ITEMS.WIDTH:
            case STYLE_ITEMS.HEIGHT:
                unit = UNIT.MM;   // 展示成毫米
                Com = InputChange;
                break;
            case DISPLAY_ITEMS.BORDER:  // 此类修改返回的对象是整个组建的对象,组建中包含多个组成部分
                Com = Border;
                break;
            case DISPLAY_ITEMS.CUSTOM:  // 此类修改返回的对象是整个组建的对象,组建中包含多个组成部分
                Com = Custom;
                break;
        }
        if(Com) {
            const comProps = getCurrentStyleOrProps(elementInfo, txtInfo, type) || {};
            return <Com
                key={type}
                elementInfo={elementInfo}
                textInfo={txtInfo}
                type={type}
                handleChange={this.handleStyleChange}
                handlePropertyChange={this.handlePropertyChange}
                {
                    ...(customProps[elementInfo.field] && customProps[elementInfo.field][type] || {})
                }
                unit={unit} // 可以通过 restProps 来传递
                {...restProps}
                {...comProps}  // 获取当前的属性值：样式属性或者组件属性
                title={onElement && type == FONT_ITEMS.SIZE ? undefined : comProps.title} // 如果是在元素上展示字体大小，则不展示 title
            />;
        }
        return null;
    }

    render() {
        const { style, elementInfo, showDelete, onDelete, onClose, visible = true, onElement = false } = this.props;
        const { field } = elementInfo;
        let showBars = COMPONENT_DISPLAY_ITEMS[field] || DEFAULT_DISPLAY_ITEMS;
        if(!showBars || !showBars.length) return null;
        const className = ['operation-bar'];
        if(!visible) {
            className.push('dis_visible');
        }
        if(onElement && !showBars.includes(DISPLAY_ITEMS.BORDER)) {
            showBars = [...showBars];
            showBars.splice(-4, 0, DISPLAY_ITEMS.BORDER);
        }
        return (
                <div className={className.join(' ')} id={OPERATION_BAR_ID} key="operation-bar" style={style}>
                    {this.renderItems(showBars)}
                    {showDelete && onDelete && <div className="delete" onClick={onDelete}>{OperationBar.renderSvgIcon(OPERATIONS.DELETE, 'X', true)}</div>}
                    {onClose && <div className="delete" onClick={onClose}>{OperationBar.renderSvgIcon(OPERATIONS.CLOSE, 'X', true)}</div>}
                </div>
            );
    }
}

export default OperationBar;