import React from 'react';

const showMask = (WrappedClass, options) => {
    return class extends React.Component {
        ins = null;

        render() {
            const {
                isPreview,
                elementProps: {
                    dataKeyLabel,
                    isOutOfBase = false
                }
            } = this.props;
            let style = {};
            if(this.ins) {
                style = {
                    height: this.ins.offsetHeight,
                    width: this.ins.offsetWidth
                };
            }
            const {
                showInfoMask = false,
                showBoundary = true
            } = options;

            const isOut = showBoundary && isOutOfBase;
            const showInCommon = showInfoMask && !isPreview && dataKeyLabel;
            let className = showInCommon || isOut ? 'mask' : 'mask hide';
            if (isOut) {
                className += ' exceed';
            }
            return (
                <div
                    ref={(ins) => { this.ins = ins; }}
                    className={isOut ? 'mask-item exceed' : 'mask-item'}
                >
                    <WrappedClass
                        {...this.props}
                    />
                    <div className={className} style={style}>
                        <span>{dataKeyLabel}</span>
                    </div>
                </div>
            );
        }
    };
};

export default showMask;