import React, { PureComponent } from 'react';
import { BORDER_STYLE_ITEMS, CUSTOMERS, FONT_COLOR_ITEMS, FONT_ITEMS, FONT_SIZE_ITEMS } from './const';
import { STYLE_ITEMS } from './BorderEditor/ItemDisplay';
import { SHOW_ELEMENTS } from '../../componentConfig';

/**
 * 原本只用来做字体样式的选择器
 * 也可用作通用的选择器
 */
class CommonSelector extends PureComponent {

    handleChange = (e) => {
        const { type, handleChange } = this.props;
        let val = e.target.value;
        if(type == FONT_ITEMS.SIZE) {
            val = Number(val);
        }
        handleChange && handleChange(val, type);
    }

    renderItems = (type, desc) => {
        switch (type) {
            case FONT_ITEMS.SIZE:   // 修改字体大小
                return FONT_SIZE_ITEMS.map((item) => <option key={item} value={item}>{item}</option>);
            case FONT_ITEMS.COLOR:  // 修改字体颜色
                return FONT_COLOR_ITEMS.map((item) => <option key={item} title={desc} value={item} style={{color: item}}>A</option>);
            case BORDER_STYLE_ITEMS.BORDER_STYLE:   // 修改边框相关样式
                return STYLE_ITEMS.map((item) => <option key={item} value={item}>{item}</option>);
            case CUSTOMERS.FIELD: // 自定义组件选择器
                return (Object.values(SHOW_ELEMENTS)).map((item) => <option key={item} value={item}>{item}</option>);
            default:
        }
    }

    render() {
        const { value, title, desc, type } = this.props;
        return (
            <span className="font-size-selector" key={type}>
                {title ? <span>{title}</span> : null}
                <select onChange={this.handleChange} value={value} style={{ color: value || FONT_COLOR_ITEMS[0]}}>
                    {this.renderItems(type, desc)}
                </select>
            </span>
        );
    }
}

export default CommonSelector;
