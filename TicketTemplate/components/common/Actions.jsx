import React, { PureComponent } from 'react';
import OperationBar from '../OperationBar/index';
import { ACTIONS_TYPE, DATA_ICONS, OPERATIONS } from '../../componentConfig';

class Actions extends PureComponent {
  constructor(props) {
    super(props);
  }

  clickEye = () => {
    this.props.handleClick( this.props.showInTime ? DATA_ICONS.CLOSE_EYES : DATA_ICONS.OPEN_EYES );
  }

  renderItems = () => {
    const { showItems = ACTIONS_TYPE, textInfo, handleClick, showInTime } = this.props;
    let children = [];
    if(showItems.includes(OPERATIONS.SAVE)) {
      children.push(
        <p className="print" key="save" onClick={handleClick.bind(this,OPERATIONS.SAVE)}>
          {OperationBar.renderSvgIcon(OPERATIONS.SAVE, OPERATIONS.SAVE, textInfo[OPERATIONS.PRINT])}
        </p>
      );
    }
    if(showItems.includes(DATA_ICONS.OPEN_EYES)) {
      children.push(
        <p className="print" key="show_in_time_action" onClick={this.clickEye}>
          {showInTime ? OperationBar.renderSvgIcon(DATA_ICONS.OPEN_EYES, DATA_ICONS.OPEN_EYES) : OperationBar.renderSvgIcon(DATA_ICONS.CLOSE_EYES, DATA_ICONS.CLOSE_EYES)}
        </p>
      );
    }
    if(showItems.includes(OPERATIONS.PRINT)) {
      children.push(
        <p className="print" key="print_action" onClick={handleClick.bind(this,OPERATIONS.PRINT)}>
          {OperationBar.renderSvgIcon(OPERATIONS.PRINT, OPERATIONS.PRINT, textInfo[OPERATIONS.PRINT])}
        </p>
      );
    }
    // 这仨比较特殊，需要单独处理
    const restItems = showItems.filter(item => ![DATA_ICONS.OPEN_EYES, DATA_ICONS.CLOSE_EYES, OPERATIONS.PRINT, OPERATIONS.SAVE].includes(item));
    if(showItems.includes(OPERATIONS.COPY) || showItems.includes(OPERATIONS.EDIT) || showItems.includes(OPERATIONS.VIEW)) {
      children.push(
        <div className="ticket-actions--items" key="ticket-actions--items">
          {
            restItems.map(item => {
              return <p key={item} onClick={handleClick.bind(this,item)}>{OperationBar.renderSvgIcon(item, item, textInfo[item])}</p>;
            })
          }
      </div>
      );
    }
    return children;
  }

  render() {
    return <div className="ticket-actions" key="ticket-actions">
      {this.renderItems()}
    </div>;
  }
}

export default Actions;