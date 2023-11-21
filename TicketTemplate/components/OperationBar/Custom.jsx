import React, { PureComponent } from 'react';
import OperationBar from './index';
import { COMMON_ELEMENTS } from '../../componentConfig';
import InputChange from './InputChange';
import { Tips } from '../common/index';
import { CUSTOMERS, preventFunc } from './const';
import CommonSelector from './CommonSelector';

class Custom extends PureComponent {

    state = {
        show: false
    };

    showCard = (e) => {
        preventFunc(e);
        this.setState({
          show: true
        });
    };

    hideCard = () => {
        this.setState({
            show: false
        });
    }

    handleChange = (value, type) => {
        const { handlePropertyChange, type: componentType } = this.props;
        // const newValue = {};
        // switch (type) {
        //     case CUSTOMERS.DATA_KEY:
        //         newValue[type] = value;
        //         break;
        // }
        handlePropertyChange && handlePropertyChange({[type]: value}, componentType);
    }

    render() {
        const {
          value,
          title,
          type,
          textInfo: {
            custom,
            customLabel,
            component
          }
        } = this.props;
        const {
          show
        } = this.state;
        return  <div className="custom" title={title} key={type} onClick={this.showCard}>
          {
            OperationBar.renderSvgIcon(COMMON_ELEMENTS.CUSTOM, title, true)
          }
          {
            show && <Tips
              handleConfirm={this.hideCard}
            >
                <InputChange
                    title={custom}
                    type={CUSTOMERS.DATA_KEY}
                    value={value[CUSTOMERS.DATA_KEY]}
                    handleChange={this.handleChange}
                    inputType="text"
                    onAfter={false}
                />
                <InputChange
                    title={customLabel}
                    type={CUSTOMERS.DATA_KEY_LABEL}
                    value={value[CUSTOMERS.DATA_KEY_LABEL]}
                    handleChange={this.handleChange}
                    inputType="text"
                    onAfter={false}
                />
                <CommonSelector
                  title={component}
                  type={CUSTOMERS.FIELD}
                  value={value[CUSTOMERS.FIELD]}
                  handleChange={this.handleChange}
                />
            </Tips>
          }
        </div>;
      }
}

export default Custom;