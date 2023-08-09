import React, { PureComponent } from 'react';
import { filterProps } from '../../funcs';

class TextDisplay extends PureComponent {
  render() {

    const {
        value = 'best-textarea',
        // 组件差异化交互或者样式属性封装
        elementProps: {
            id,
            style
        }
        // componentProps: {

        // }
    } = this.props;
    return (
      <div
        key={id}
        style={filterProps(style, ['position'])}
      >{value}</div>
    );
  }
}

export default TextDisplay;