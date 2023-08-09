import React, { PureComponent } from 'react';
import OperationBar from './index';
import { CUSTOMERS, DISPLAY_ITEMS, preventFunc } from './const';
import { OPERATIONS, SHOW_ELEMENTS } from '../../componentConfig';
import Custom from './Custom';

class SettingIcon extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            showSetting: false
        };
    }

    clickSetting = (e) =>  {
        preventFunc(e);
        this.setState({
            showSetting: !this.state.showSetting
        });
    }

    handlePropertyChange = (value) => {
        const { onClick, elementInfo } = this.props;
        onClick({...(elementInfo || {}), ...(value || {})});
    }

    render() {
        const { showSetting } = this.state;
        const { activeStyle, txtInfo, elementInfo, style, onClick, getInstance, onDelete } = this.props;
        return (
            <div
                className="ticket-main--bar"
                ref={getInstance}
                style={{
                    top: activeStyle.top,
                    left: activeStyle.left
                }}
            >
                {
                    !showSetting && <div className="setting" style={{ left: 4 }} onClick={this.clickSetting} >{OperationBar.renderSvgIcon(OPERATIONS.SETTING, '*')}</div>
                }
                {
                    !showSetting && <div className="setting" style={{ left: 25 }} onClick={onDelete} >{OperationBar.renderSvgIcon(OPERATIONS.DELETE, '*')}</div>
                }
                {/** 组件单独使用例子 */}
                {
                    !showSetting && <div className="operation-bar custom-icon" style={{ left: 45 }}>
                        <Custom
                            value={elementInfo}
                            title={txtInfo.custom}
                            type={CUSTOMERS.CUSTOM}
                            textInfo={txtInfo}
                            handlePropertyChange={this.handlePropertyChange}
                        />
                    </div>
                }
                {
                    showSetting && <OperationBar
                        txtInfo={txtInfo}
                        elementInfo={elementInfo}
                        handleStyleChange={onClick}
                        customProps={{ // 自定义组件的特殊配置
                            [SHOW_ELEMENTS.BARCODE]: {
                                [DISPLAY_ITEMS.WIDTH]: {
                                    step: 0.1
                                }
                            }
                        }}
                        style={style}
                        showDelete
                        onDelete={onDelete}
                        onClose={this.clickSetting}
                    />
                }
            </div>
        );
    }
}

export default SettingIcon;