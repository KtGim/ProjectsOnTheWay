import React, { PureComponent } from 'react';
import OperationBar from '../index';
import { BORDER_STYLE_ITEMS } from '../const';
import Tips from '../../common/Tips';
import ItemDisplay from './ItemDisplay';

const defaultBorderStyle = {
  borderStyle: 'dashed',
  borderWidth: 1,
  borderColor: '#aaa',
  borderRadius: 0
};

class Border extends PureComponent {

  state = {
    show: false,
    oldValue: null
  };

  static getDerivedStateFromProps(nextProps, preState) {
    const { value = defaultBorderStyle } = nextProps;
    const { oldValue } = preState;
    if(!oldValue) { // 每次打开的时候记住上一次的样式值
      return {
        oldValue: Object.keys(value).length ? value : defaultBorderStyle
      };
    }
    return {};
  }

  handleChange = (value, type) => {
    const { handleChange, type: styleType } = this.props;
    const newValue = {};
    switch (type) {
      case BORDER_STYLE_ITEMS.BORDER_STYLE:
        newValue.borderStyle = value;
        break;
      case BORDER_STYLE_ITEMS.BORDER_WIDTH:
        newValue.borderWidth = value;
        break;
      case BORDER_STYLE_ITEMS.BORDER_RADIUS:
        newValue.borderRadius = value;
        break;
      case BORDER_STYLE_ITEMS.BORDER_COLOR:
        newValue.borderColor = value;
        break;
    }
    handleChange && handleChange(newValue, styleType);
  }

  showCard = () => {
    this.setState({
      show: true
    });
  };

  hideCard = (sure = true) => {
    if(!sure) {
      // 还原样式
      const { handleChange, type } = this.props;
      handleChange && handleChange(this.state.oldValue, type);
    }
    this.setState({
      show: false,
      oldValue: null
    });
  }

  getClass = (value) => {
    const {
      borderStyle, borderWidth, borderColor, borderRadius
    } = value;
    let className = 'border-editor';
    if(borderStyle || borderWidth || borderColor || borderRadius) {
      className = 'border-editor active';
    }
    return className;
  }

  render() {
    const {
      value = defaultBorderStyle, title, type, textInfo
    } = this.props;
    const {
      show
    } = this.state;
    return  <div className={this.getClass(value)} title={title} key={type} onClick={this.showCard}>
      {
        OperationBar.renderSvgIcon(BORDER_STYLE_ITEMS.BORDER, title, title)
      }
      {
        show && <Tips
          okTxt={textInfo.okTxt}
          cancelTxt={textInfo.cancelTxt}
          handleConfirm={this.hideCard}
        >
          <ItemDisplay
            textInfo={textInfo}
            {...value}
            handleChange={this.handleChange}
          />
        </Tips>
      }
    </div>;
  }
}

export default Border;