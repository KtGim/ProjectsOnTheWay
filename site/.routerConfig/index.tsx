import React from 'react';
import {
    HashRouter as Router,
    Routes,
    Route
} from 'react-router-dom';

import components from './lazyComponents';
import logComponents from './logComponents';
import { RouteProps, RoutersMapProps, LogRouteProps } from './common';

import routers from './config';
import logRoutes from './logConfig';
import NotFound from 'site/layout/NotFound';
import Layout from 'site/layout';
import ComponentsLayout from 'site/layout/components';
import StartMd from '../../docs/common/start.md';
import IntroductionMd from '../../docs/common/introduction.md';
import { upperCaseName } from 'utils';

const initRoutesConfig: (routes: (RouteProps | LogRouteProps)[]) => RoutersMapProps = (routes) => {
    const routersMap: RoutersMapProps = {};

    routes && routes.forEach((route: RouteProps | LogRouteProps) => {
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

const routerConfigs = initRoutesConfig(routers);
const logConfigs = initRoutesConfig(logRoutes);

const Routers = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route path="" element={<IntroductionMd />}></Route>
                    <Route path="/logs" element={<ComponentsLayout prePath="logs" routerConfig={logConfigs} />}>
                        <Route path="/logs/" element={<StartMd />} />
                        {
                            logRoutes.map((route: LogRouteProps) => {
                                let {
                                    name,
                                    path,
                                    key
                                } = route;
                                let Comp = null;
                                const lName = upperCaseName(name);
                                if(logComponents[lName]) {
                                    Comp = logComponents[lName];
                                } else {
                                    console.error(`名称为 ${lName} 的组件不存在，请先创建组件！`)
                                    path = '/404';
                                    Comp =  NotFound;
                                }
                                return (
                                    <Route key={key} path={path} element={<Comp />} />
                                )
                            })
                        }
                    </Route>
                    <Route path="/component" element={<ComponentsLayout prePath="component" routerConfig={routerConfigs} />}>
                        <Route path="/component/" element={<StartMd />} />
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

export default Routers;