import React from 'react';
import { Icon, Select, Dropdown, Menu } from 'wmstool';
import ChangePassword from '../ChangePassword/index';
import CountrySelector from '../CountrySelector/index';
import { Consumer } from '../index';

import '../index.less';
const Option = Select.Option;
const Item = Menu.Item;

class Top extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            value: props.initialValue,
            visible: false
        };
    }
    renderMenu = () => {
        const { txt, handleLogout, save } = this.props;
        const Items = [
            <Item key="changePassword">
                <a href="javascript:;" onClick={this.totalVisible} >{txt.changePassword}</a>
            </Item>,
            <Item key="logout">
                <a href="javascript:;" onClick={handleLogout} className="top_link"><Icon type="poweroff" />{txt.loginout}</a>
            </Item>
        ];
        return (
            <Menu>
              {save ? Items : Items.shift()}
            </Menu>
        );
    }
    testPrint = () => {
        const { logId, logKey } = this.props;
        if(!logId) return; // 打印日志 id 不存在
        const printElement = document.querySelector(`#${logId}`);
        if(!printElement) {
            console.error('打印元素(#printIfram) 不存在');
            return;
        }
        //从缓存中取打印数据
        printElement.contentWindow.document.body.innerText = '';
        const printDataLists = JSON.parse(localStorage.getItem(logKey) || '[]');
        const div = document.createElement('div');
        div.innerHTML = printDataLists.join('');
        printElement.contentWindow.document.body.appendChild(div);
        printElement.focus();
        printElement.contentWindow.print();
    }

    totalVisible = () => {
        this.setState({
          visible: !this.state.visible
        });
    }

    render() {
        const {
            user,
            txt,
            logId,
            dataSource,
            filterOption,
            handleSwitch,
            showWarehouse = true,
            mainKey,
            showKey,

            showCountry = true,
            handleCountryChange,
            save,
            complex,
            extraNode
        } = this.props;
        const {
            visible,
            value
        } = this.state;
        const allModalDate = {
            visible,
            closeModal: this.totalVisible,
            save,
            complex
        };
        return (
            <Consumer>
                {({txtLanguage}) => {
                    return (
                        <div className="top">
                            {showCountry && <CountrySelector handleChange={handleCountryChange} lan={txtLanguage} />}
                            <Dropdown overlay={this.renderMenu()} placement="bottomCenter">
                                <span className="username" title={user.userName}>
                                    {user.userName}
                                </span>
                            </Dropdown>
                            {showWarehouse && <div className="info">
                                <Icon type="home" className="warehouse-icon" />
                                <Select
                                    className="uppercase"
                                    style={{ width: 160 }}
                                    showSearch
                                    filterOption={filterOption}
                                    dropdownMatchSelectWidth={false}
                                    value={value}
                                    onChange={handleSwitch}
                                >
                                    {dataSource.map(item => <Option key={item[mainKey]} value={item[mainKey]}>{item[showKey]}</Option>)}
                                </Select>
                            </div>}
                            <div className="extra">
                                {extraNode}
                            </div>
                            {logId && <div className="print_top" onClick={this.testPrint}></div>}
                            {save && visible && <ChangePassword allModalDate={allModalDate} txt={txt} user={user}/>}
                        </div>
                    );
                }}
            </Consumer>
        );
    }
}

export default Top;