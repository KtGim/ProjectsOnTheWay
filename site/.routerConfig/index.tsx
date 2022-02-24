import React from 'react';
import {
    HashRouter as Router,
    Routes,
    Route,
    Navigate
} from 'react-router-dom';

import components from './lazyComponents';
import { RouteProps, RoutersMapProps } from './common';

import routers from './config';
import NotFound from 'site/layout/NotFound';
import Layout from 'site/layout';
import ComponentsLayout from 'site/layout/components';

const initRoutesConfig: () => RoutersMapProps = () => {
    const routersMap: RoutersMapProps = {};

    routers && routers.forEach((route: RouteProps) => {
        const {
            moduleName
        } = route;

        if(moduleName) {
            if(!routersMap[moduleName]) {
                routersMap[moduleName] = [];
            }
            routersMap[moduleName]!.push(route);
        }
    })

    return routersMap;
};

const routerConfigs = initRoutesConfig();

const Routers = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route path="/component" element={<ComponentsLayout />}>
                        {
                            routers.map((route: RouteProps) => {
                                let {
                                    name,
                                    path,
                                    key
                                } = route;
                                let Comp = null;
                                if(components[name]) {
                                    Comp = components[name];
                                } else {
                                    console.error(`名称为 ${name} 的组件不存在，请先创建组件！`)
                                    path = '/404';
                                    Comp =  NotFound;
                                }
                                return (
                                    <Route key={key} path={path} element={<Comp />} />
                                )
                            })
                        }
                    </Route>
                    <Route path="/404" element={<NotFound />} />
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </Router>
    );
}

export {
    routerConfigs
}

export default Routers;