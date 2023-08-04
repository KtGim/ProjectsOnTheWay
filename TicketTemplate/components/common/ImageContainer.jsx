import React, { PureComponent } from 'react';
import OperationBar from '../OperationBar/index';
import { SHOW_ELEMENTS } from '../../componentConfig';

class ImageContainer extends PureComponent {
    state = {
        isError: false
    }

    loadError = () => {
        console.log('图片加载失败');
        this.setState({
            isError: true
        });
    }
    render() {
        const { isError } = this.state;
        const {
            value: src,
            elementProps: {
                style: {
                    width = 100,
                    height = 100
                }
            }
        } = this.props;
        return !isError ? <img draggable="false" crossOrigin="anonymous" onError={this.loadError} style={{ height, width }} src={src} /> : OperationBar.renderSvgIcon(SHOW_ELEMENTS.IMAGE, src, src, { height, width });
    }
}

export default ImageContainer;