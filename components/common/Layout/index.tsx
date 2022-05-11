import React, { Suspense } from 'react';
import { Layout, Tabs, ConfigProvider } from 'antd';
import {
    Switch,
    Route,
    Redirect
} from 'react-router-dom-v4';
import LeftMenu from './LeftMenu/index';
import Top from './Top/index';
import { LANGUAGE_KEY } from './CountrySelector/index';
import CustomerMenu from './CustomerMenu';
import moment from 'moment';
import PropTypes from 'prop-types';

import en from 'antd/lib/locale-provider/default';
import th_TH from 'antd/lib/locale-provider/th_TH';
import vi_VN from 'antd/lib/locale-provider/vi_VN';
import zhCN from 'antd/lib/locale-provider/zh_CN';

import './index.less';

moment.locale('zh-cn');

const { Header, Sider, Content } = Layout;
const TabPane = Tabs.TabPane;

const IndexContext = React.createContext({});
const {Provider, Consumer} = IndexContext;
export {
  IndexContext,
  Provider,
  Consumer
};

const getAndSetLocalLanguage = language => {
    switch (language) {
      case LANGUAGE_KEY.ZH_CN:
        moment.locale('zh-cn');
        return zhCN;
      case LANGUAGE_KEY.TH_TH:
        moment.locale('th');
        return th_TH;
      case LANGUAGE_KEY.VI_VN:
        moment.locale('vi');
        return vi_VN;
      default:
        moment.locale('en');
        return en;
    }
};

export const renderTypes = {
    tab: 'tabs',
    page: 'pages'
};

export const operationTypes = {
    add: 'add',
    remove: 'remove'
};

class MainLayout extends React.PureComponent{
    static childContextTypes = {
        addPanel: PropTypes.func
    }
    getChildContext() {
        return {
          addPanel: this.add
        };
    }
    constructor(props: any) {
        super(props);
        this.state = {
            activeKey: '',
            openMenusMap: new Map(),
            language: this.props.language || 'en_US',
            collapsed: false,
            openKey: '',
            locale: '',
            jumpData: {}
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const language = nextProps.language || 'en_US';
        let params = {};
        if(language !== prevState.language) {
            params = {
                language,
                locale: getAndSetLocalLanguage(language)
            };
        }
        return params;
    }

    componentDidMount() {
        const {
            openMenusMap
        } = this.state;
        const {
            pathPrefix = '',
            firstPageCode,
            firstPageKey,
            getComponent,
            menus,
            lan = {},
            getOpenKey
        } = this.props;
        const currentPath = pathPrefix ? this.props.location.pathname.replace(`${pathPrefix}/`, '') : this.props.location.pathname;
        const code = this.getPathCode(menus, currentPath);
        openMenusMap.set(firstPageCode, {
            code: firstPageCode,
            name: lan[firstPageCode],
            component: getComponent(firstPageKey)
        });
        openMenusMap.set(code, {
            code,
            name: lan[code],
            component: getComponent(currentPath)
        });
        this.addEvents();
        this.setState({
            openMenusMap,
            lan,
            activeKey: code,
            openKey: getOpenKey({activeKey: code})
        });
    }

    addEvents = () => {
        const { autoRender, renderType, menus } = this.props;
        // 监听路由变化自动切换页面
        if(autoRender && renderType == renderTypes.tab) {
            window.addEventListener('hashchange', (e) => {
                const { newURL } = e;
                const name = this.getPathName(newURL);
                const code = this.getPathCode(menus, name);
                this.add(name, code);
            });
        }
    }

    getPathName = (path) => {
        const { pathPrefix } = this.props;
        return path.replace(`${location.origin}/#${pathPrefix}/`, '');
    }

    getPathCode = (arr, currentPath) => {
        let code = '';
        const getPathCode = (arr) => {
            if(!arr || !arr.length) return null;
            arr.forEach(({children, code: c, name}) => {
                if(children) {
                    getPathCode(children);
                }
                if(name == currentPath) {
                    code = c;
                }
            });
        };
        getPathCode(arr);
        return code;
    }

    jumpCb = (jumpTo, data) => {
        this.setState({
          jumpData: {
            jumpTo,
            data
          }
        });
    }

    clearCb = (jumpTo) => {
        this.setState({
            jumpData: {jumpTo, data: undefined}
        });
    }

    add = (name, code) => {
        const { openMenusMap } = this.state;
        const { getComponent, getOpenKey } = this.props;
        if(!openMenusMap.has(code) && name) {
            openMenusMap.set(code, {
                code,
                name,
                component: getComponent(name)
            });
            this.setState({
                openMenusMap
            });
        }
        this.setState({
            activeKey: code,
            openKey: getOpenKey({
                activeKey: code,
                code: code,
                openMenusMap,
                operationType: operationTypes.add
            })
        });
    }

    addOpenMenu = (openKeys) => {
        this.setState({
            openKey: openKeys
        });
    }

    onTabChange = (key) => {
        const { openMenusMap } = this.state;
        const { pathPrefix, getOpenKey } = this.props;
        this.setState({
            activeKey: key,
            openKey: getOpenKey(key)
        }, () => {
            history.replaceState(null, null, `/#${pathPrefix}/${openMenusMap.get(key).name}`);
        });
    }

    onEdit = (targetKey, action) => {
        if(action == 'remove') {
            this.remove(targetKey);
        }
    }

    remove = (key) =>{
        const { openMenusMap } = this.state;
        const { getOpenKey } = this.props;
        openMenusMap.delete(key);
        const tempMap = new Map(openMenusMap); // 引用地址不变不会触发 react 的 update
        const activeKey = [...openMenusMap.keys()].pop();
        this.setState({
            openMenusMap: tempMap,
            activeKey: activeKey,
            openKey: getOpenKey({
                activeKey,
                code: key,
                openMenusMap,
                operationType: operationTypes.remove
            })
        });
    }

    // 直接使用route 渲染页面
    renderRoutePage = () => {
        const {
            pathPrefix,
            paths,
            getComponent
        } = this.props;
        return paths && Object.keys(paths).map(key => {
            const Com = getComponent(key);
            return (
                <Route
                    key={key}
                    exact
                    path={`${pathPrefix}/${key.replace('Container', '')}`}
                    render={() =>
                        <Suspense fallback={<div></div>}>
                            <Com />
                        </Suspense>
                    }
                />
            );
        });
    }

    renderTabs = () => {
        const {
            openMenusMap,
            activeKey
        } = this.state;
        const {
            firstPageCode,
            lan
        } = this.props;
        const openPages = [...openMenusMap.keys()];
        return (
            <Tabs
                hideAdd
                onChange={this.onTabChange}
                activeKey={activeKey}
                type={openMenusMap.size > 1 ? 'editable-card' : 'card '}
                onEdit={this.onEdit}
                className="layout-tabs"
            >
                {
                    openPages.map((code) => {
                        const Com = openMenusMap.get(code).component;
                        return <TabPane
                            key={code}
                            id={code}
                            tab={<span id={code}>{lan[code]}</span>}
                            closable={firstPageCode !== code}
                        >
                            <Suspense fallback={<div></div>}>
                                <Com />
                            </Suspense>
                        </TabPane>;
                    })
                }
            </Tabs>
        );
    }

    hideSider = () => {
        this.setState({
            collapsed: !this.state.collapsed
        });
    }

    menuClick = (e) => {
        const {menuClick} = this.props;
        if (menuClick) {
            const { activeKey, openMenusMap } = this.state;
            const menuInfo = menuClick(e, activeKey, openMenusMap);
            this.setState(menuInfo);
        }
    }

    render() {
        const {
            activeKey,
            jumpData,
            openMenusMap,
            openKey,
            locale,
            collapsed
        } = this.state;
        const {
            pathPrefix,
            indexPath,
            highlightSearch,
            logId,
            logKey,
            renderType,
            lan,
            logoUrl,
            menus,

            handleWhSwitch,
            filterOption,
            showWarehouse = true,
            mainKey='id',
            showKey='whCode',
            whId,
            handleLogout,
            extraNode,

            menuFilter,
            imgClick,
            complex,
            user,
            handleCountryChange,
            topText,
            clickSave,
            topSource,
            RightClickMenu,
            searchMenuKey,
            extraProps
        } = this.props;

        return (
            <IndexContext.Provider
                value={{
                    activeKey: activeKey,
                    addTab: this.add,
                    jumpCb: this.jumpCb,
                    jumpData,
                    clearCb: this.clearCb,
                    ...extraProps
                }}>
                <ConfigProvider locale={locale}>
                    <Layout className="gwms--layout">
                        <Sider
                            collapsed={collapsed}
                        >
                            <LeftMenu
                                openPage={this.add}
                                addOpenMenu={this.addOpenMenu}
                                openMenusMap={openMenusMap}
                                pathPrefix={pathPrefix}
                                activeKey={activeKey}
                                openKey={openKey}
                                highlightSearch={highlightSearch}
                                collapsed={collapsed}
                                hideSider={this.hideSider}
                                menus={menus}
                                logoUrl={logoUrl}
                                imgClick={imgClick}
                                menuFilter={menuFilter}
                                renderType={renderType}
                                lan={lan}
                                searchMenuKey={searchMenuKey}
                            />
                        </Sider>
                        <Layout>
                            <Header>
                                <Top
                                    txt={topText}
                                    logId={logId}
                                    logKey={logKey}
                                    user={user}
                                    dataSource={topSource || []}
                                    filterOption={filterOption}
                                    handleSwitch={handleWhSwitch}
                                    mainKey={mainKey}
                                    showKey={showKey}
                                    initialValue={whId}
                                    handleLogout={handleLogout}
                                    handleCountryChange={handleCountryChange}
                                    save={clickSave}
                                    complex={complex}
                                    showWarehouse={showWarehouse}
                                    extraNode={extraNode}
                                />
                            </Header>
                            <Content>
                                {renderType == renderTypes.tab && <CustomerMenu
                                    menuClick={this.menuClick}
                                    RightClickMenu={RightClickMenu}
                                />}
                                <Switch>
                                    <Route exact path={pathPrefix || '/'} render={() => <Redirect to={indexPath} push />} />
                                    {renderType == renderTypes.tab ? this.renderTabs() : this.renderRoutePage()}
                                </Switch>
                            </Content>
                        </Layout>
                    </Layout>
                </ConfigProvider>
            </IndexContext.Provider>
        );
    }
}

export default MainLayout;