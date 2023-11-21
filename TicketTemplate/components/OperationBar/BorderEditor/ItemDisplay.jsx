import React, { PureComponent } from 'react';
import CommonSelector from '../CommonSelector';
import InputChange from '../InputChange';
import { BORDER_STYLE_ITEMS } from '../const';

const STYLE_ITEMS = ['none', 'solid', 'dashed', 'dotted', 'double', 'groove', 'ridge', 'inset', 'outset'];

class ItemDisplay extends PureComponent {

    render() {
        const {
            borderWidth,
            borderStyle,
            borderColor,
            borderRadius,
            textInfo: {
                borderStyle: borderStyleText,
                borderSize: borderWidthText,
                borderColor: borderColorText,
                borderRadius: borderRadiusText
            },
            handleChange
        } = this.props;
        return <div
            className="item-display"
        >
            <InputChange
                title={borderRadiusText}
                type={BORDER_STYLE_ITEMS.BORDER_RADIUS}
                value={borderRadius}
                handleChange={handleChange}
                needTrans={false}
                onAfter={false}
            />
            <InputChange
                title={borderWidthText}
                type={BORDER_STYLE_ITEMS.BORDER_WIDTH}
                value={borderWidth}
                needTrans={false}
                handleChange={handleChange}
                onAfter={false}
            />
            <InputChange
                title={borderColorText}
                type={BORDER_STYLE_ITEMS.BORDER_COLOR}
                inputType="text"
                value={borderColor}
                needTrans={false}
                handleChange={handleChange}
                onAfter={false}
            />
            <CommonSelector
                title={borderStyleText}
                type={BORDER_STYLE_ITEMS.BORDER_STYLE}
                value={borderStyle}
                handleChange={handleChange}
            />
        </div>;
    }
}

export {
    STYLE_ITEMS
};

export default ItemDisplay;