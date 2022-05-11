import React from 'react';
import { Menu, Input, Tooltip, Icon } from 'antd';
import { Link } from 'react-router-dom';

import '../index.less';
import { renderTypes } from '../index';

const { SubMenu, Item } = Menu;
const { Search } = Input;
// 高亮样式
const highlightStyle = '"color: #fff;font-weight: 600;font-size: 18px;"';
const firstLevelMenuClassName = 'menu-direct';
const firstLevelMenuItemClassName = 'menu-item-direct';
class LeftMenu extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            menusCurrent: null,
            openKey: [],
            lastSelectedKey: '',
            searchInput: '',
            logoUrl: null
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const { openMenusMap, activeKey, openKey, menus } = nextProps;
        const lastSelectedKey = activeKey || ([...openMenusMap.keys()].pop() || '');
        let params = {
            openKey,
            lastSelectedKey
        };
        if(!prevState.searchInput) {
            params.menusCurrent = menus;
        }
        return params;
    }

    highlightTitle = (title, treeTextTitle) => {
        const { searchInput } = this.state;
        if(!searchInput) {
            return title || treeTextTitle;
        }
        let tempTitle = treeTextTitle;

        tempTitle = tempTitle.split('').map(char => {
            if(searchInput.toUpperCase().indexOf(char.toUpperCase()) > -1) {
                return `<span style=${highlightStyle}>${char}</span>`;
            } else {
                return char;
            }
        });
        tempTitle = <span dangerouslySetInnerHTML={{__html: tempTitle.join('')}} />;
        if(typeof title !== 'string') {
            title && (tempTitle = this.cloneTitle(title, tempTitle));
            return tempTitle;
        }
        return title || treeTextTitle;
    }

    cloneTitle = (title, childElement) => {
        const temp = React.cloneElement(title);
        return React.Children.map(temp.props.children, (child) => {
            if(child.type == 'span' && childElement) {
                return React.cloneElement(child, {
                    children: childElement
                });
            } else {
                return child;
            }
        });
    }

    // 生成左侧菜单，className 只用于第一层
    initSubMenu = (item, level, firstLevelMenuClassName, firstLevelMenuItemClassName) => {
        const { renderType, openMenusMap, openPage, pathPrefix, collapsed, highlightSearch = false, menuFilter, lan, searchMenuKey } = this.props;
        const { children, name, title, code } = item;
        const m = menuFilter ? (children || []).filter(menuFilter) : children || [];
        const showTitle = highlightSearch ? this.highlightTitle(title, item[searchMenuKey] || lan[code] || name) : lan[code] || name;
        const path = pathPrefix ? `${pathPrefix}/${name}` : name;
        if(m && m.length) {
            const lev = level + 1;
            return (
                <SubMenu key={code} title={showTitle} className={`${firstLevelMenuClassName} sub-menu-level-${level} item-level-${level}`}>
                    {
                        m.map((item) => this.initSubMenu(item, lev) )
                    }
                </SubMenu>
            );
        } else {
            if(collapsed) {
                return (
                    <Item key={code} className={`${firstLevelMenuItemClassName} item-level-${level}`}>
                        {
                            openMenusMap.has(code) ?
                                <p onClick={() => { openPage(name, code); }}>{showTitle}</p>:
                                <Link to={path} onClick={() => { openPage(name, code); }}>{showTitle}</Link>
                        }
                    </Item>
                );
            } else {
                return (
                    <Item key={code} className={`${firstLevelMenuItemClassName} item-level-${level}`}>
                        <Tooltip placement="right" title={showTitle} overlayClassName="gwms--layout-menu-tooltip">
                            {
                                renderType == renderTypes.tab && openMenusMap.has(code) ?
                                    <p onClick={() => { openPage(name, code); }}>{showTitle}</p>:
                                    <Link to={path} onClick={() => { openPage(name, code); }}>{showTitle}</Link>
                            }
                        </Tooltip>
                    </Item>
                );
            }
        }
    }

    onSelect = ({key}) => {
        this.props.openPage(null, key);
    }

    search = (value) => {
        this.setState({
            searchInput: value
        }, () => {
            const { menus } = this.props;
            const resultArr = [];
            this.getSearchMenus(menus, resultArr, value.toUpperCase());
            const openKeys = resultArr.map(item => item.code);
            this.props.addOpenMenu(openKeys);
            this.setState({
                menusCurrent: resultArr
            });
        });
    }

    getSearchMenus = (menus, resultArr, searchInput) => {
        const { lan, searchMenuKey } = this.props;
        menus.forEach(item => {
            const { code, children, ...rest } = item;
            const nameStr = searchMenuKey ? item[searchMenuKey] : lan[code];
            if(!nameStr) return;
            // 大写匹配，或者出去空格匹配
            const names = [nameStr.toUpperCase(), nameStr.replace(' ', '')];
            let filteredItem = {...rest, code};
            if(names.some(name => name.indexOf(searchInput) > -1)) {
                resultArr.push(filteredItem);
            }
            if(children && children) {
                filteredItem.children = [];
                this.getSearchMenus(children, filteredItem.children, searchInput);
                // 如果筛选后的菜单中没有 加入父级菜单，并且子菜单已经被筛选出来， 那么将父级菜单添加进筛选后的菜单中
                if(filteredItem.children.length && resultArr.indexOf(filteredItem) == -1) {
                    resultArr.push(filteredItem);
                }
                // 如果筛选后的菜单中 有父级菜单，并且子菜单筛选后为空， 那么将父级菜单的子菜单全部添加到父级菜单下
                if(!filteredItem.children.length) {
                    filteredItem.children = children;
                }
            }
        });
    }

    render() {
        const {
            openKey,
            lastSelectedKey,
            menusCurrent
        } = this.state;

        const { collapsed, hideSider, logoUrl, imgClick, menuFilter, addOpenMenu } = this.props;
        const m = menuFilter ? (menusCurrent || []).filter(menuFilter) : menusCurrent || [];

        return (
            <div className="menus">
                <div className={collapsed ? 'logo-wrap no-padding' : 'logo-wrap'}>
                    <img src={logoUrl} onClick={imgClick} />
                </div>
                {
                    !collapsed && <div className="search">
                        <Search
                            placeholder="input search text"
                            onSearch={this.search}
                            onChange={this.handleChange}
                        />
                    </div>
                }
                <Icon type={collapsed ? 'double-right': 'double-left'} className={collapsed ? 'right_up_bt' : 'left_up_bt'} onClick={hideSider}/>
                <Menu
                    openKeys={openKey}
                    mode={collapsed ? 'vertical' : 'inline'}
                    theme="dark"
                    selectedKeys={[lastSelectedKey]}
                    onOpenChange={addOpenMenu}
                    onSelect={this.onSelect}
                    className={collapsed ? 'menu-collapsed' : undefined}
                >
                    {
                        m.map((item) => this.initSubMenu(item, 0, firstLevelMenuClassName, firstLevelMenuItemClassName))
                    }
                </Menu>
            </div>
        );
    }
}

export default LeftMenu;