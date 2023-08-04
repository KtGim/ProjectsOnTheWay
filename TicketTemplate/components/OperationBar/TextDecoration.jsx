import React, { PureComponent } from 'react';
import { FONT_ITEMS, ITEMS_STYLE, TEXT_ALIGN_ITEMS, TEXT_ALIGN_ITEMS_VALUE, TEXT_DECORATION_ITEMS } from './const';
import OperationBar from './index';

class TextDecoration extends PureComponent {

    handleClick = () => {
        const { type, value, handleChange } = this.props;
        handleChange && handleChange(value, type);
    }

    getStyle = () => {
        const { value, type } = this.props;
        const returnValue = {};
        switch (type) {
            case TEXT_DECORATION_ITEMS.UNDERLINE:
                returnValue.active = value === TEXT_DECORATION_ITEMS.UNDERLINE;
                returnValue.textDecoration = value;
                break;
            case TEXT_DECORATION_ITEMS.DELETE:
                returnValue.active = value === TEXT_DECORATION_ITEMS.DELETE;
                returnValue.textDecoration = value;
                break;
            case TEXT_DECORATION_ITEMS.ITALIC:
                returnValue.active = value === TEXT_DECORATION_ITEMS.ITALIC;
                returnValue.fontStyle = value;
                break;
            case FONT_ITEMS.BOLD:
                returnValue.active = value === FONT_ITEMS.BOLD;
                returnValue.fontWeight = value;
                break;
            case TEXT_ALIGN_ITEMS.ALIGN_CENTER:
                returnValue.active = value === TEXT_ALIGN_ITEMS_VALUE.CENTER;
                returnValue.textAlign = value;
                break;
            case TEXT_ALIGN_ITEMS.ALIGN_LEFT:
                returnValue.active = value === TEXT_ALIGN_ITEMS_VALUE.LEFT;
                returnValue.textAlign = value;
                break;
            case TEXT_ALIGN_ITEMS.ALIGN_RIGHT:
                returnValue.active = value === TEXT_ALIGN_ITEMS_VALUE.RIGHT;
                returnValue.textAlign = value;
                break;
            case TEXT_ALIGN_ITEMS.ALIGN_VERTICAL:
                returnValue.active = value;
                break;
            case ITEMS_STYLE.BARCODE_TEXT_DISPLAY:
                returnValue.active = value;
                break;
            default:
        }
        return returnValue;
    }

    render() {
        const { title, desc, type } = this.props;
        const {
            active,
            ...style
        } = this.getStyle();
        return <div key={type} className={active ? 'text-decoration active' : 'text-decoration'} onClick={this.handleClick} style={style}>
            {OperationBar.renderSvgIcon(type, title, desc)}
        </div>;
    }
}

export default TextDecoration;