import React, { PureComponent } from 'react';

class Label extends PureComponent {

    state = {
        labelContainerRef: null,
        htmlValue: null
    };

    static getDerivedStateFromProps(nextProps) {
        const {
            value = 'best-label'
        } = nextProps;
        return {
            htmlValue: value
        };
    }

    handleBlur = () => {
        const { onChange, elementProps } = this.props;
        elementProps.showData = this.state.labelContainerRef.innerHTML;
        const {
            style: {
                height
            }
        } = elementProps;
        const {
            height: labelHeight
        } = this.state.labelContainerRef.getBoundingClientRect();
        if(labelHeight !== height) { // 根据文本内容自动调节编辑之后的高度
            elementProps.style = {
                ...elementProps.style,
                height: labelHeight || height
            };
        }
        onChange && onChange(elementProps);
    }

    render() {
        const {
            elementProps: {
                id
            }
        } = this.props;
        return (
            <div
                key={id}
                className="label-editor"
                onBlur={this.handleBlur}
                ref={(ref) => { this.state.labelContainerRef = ref; }}
                dangerouslySetInnerHTML={{ __html: this.state.htmlValue }}
                contentEditable
            />
        );
    }
}

export default Label;