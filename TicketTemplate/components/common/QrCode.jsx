/**
 * 二维码码编辑
 * https://github.com/lindell/JsBarcode/wiki/Options#flat
 */

import React, { PureComponent } from 'react';
import { QRCodeSVG } from 'qrcode.react';
class QrCode extends PureComponent {
    render() {
        const {
            value = 'best-barcode',
            bgColor = '#ffffff',
            fgColor = '#000000',
            // 组件差异化交互或者样式属性封装
            elementProps: {
                id,
                // dataKeyLabel,
                style: {
                    width = 128
                }
            }
            // componentProps: {

            // }
        } = this.props;
        return <QRCodeSVG
            size={width}
            key={id}
            id={id}
            level="L"
            value={value}
            bgColor={bgColor}
            fgColor={fgColor}
            includeMargin={false}
            // imageSettings   二维码中设置图片，请查看文档
        />;
    }
}

export default QrCode;
