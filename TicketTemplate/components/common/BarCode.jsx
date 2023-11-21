/**
 * 条形码编辑
 * https://github.com/lindell/JsBarcode/wiki/Options#flat
 * 编辑操作不支持整体的宽度调整是因为，条形码的宽度是一条条的黑白相间的宽决定的，
 * 如果整体调整宽度，会导致条形码内容变形
 * 所以宽度只用来调整条形码每一块的宽度
 */
import React, { PureComponent } from 'react';
import BarcodeIns from 'react-barcode';
import { isChinese } from '../../funcs';

class Barcode extends PureComponent {
    renderContent = () => {
        const {
            value = 'best-barcode', // 二维码内容
            fontSize = 12,
            background = '#ffffff',
            lineColor = '#000000',
            textPosition = 'bottom',
            font = 'fantasy',
            format = 'CODE128',
            elementProps: {
                id,
                style: {
                    width = 1,
                    height = 40            // 高度
                }
            },
            componentProps: {
                displayValue = false
            }
        } = this.props;
        return <BarcodeIns
            key={id}
            width={width}
            height={height}
            displayValue={displayValue}
            textMargin={displayValue ? -2 : 0}
            value={isChinese(value) ? 'best-barcode' : value}
            fontSize={fontSize}
            font={font}
            background={background}
            lineColor={lineColor}
            textPosition={textPosition}
            margin={0}
            format={format}
        />;
    }

    render() {
        return this.renderContent();
    }
}

export default Barcode;