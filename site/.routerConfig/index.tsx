import React from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route
} from 'react-router-dom';

import components from './lazyComponents';
import { RouteProps } from './common';

import routers from './config';

const Routers = () => {
    return (
        <Router>
          <Routes>
            {
                routers.map((route: RouteProps) => {
                    const {
                        name,
                        path,
                        key
                    } = route;
                    let Comp = null;
                    if(components[name]) {
                        Comp = components[name];
                    } else {
                        console.error(`名称为 ${name} 的组件不存在，请先创建组件！`)
                        Comp =  components['404'];
                    }
                    return (
                        <Route key={key} path={path}>
                            <Comp />
                        </Route>
                    );
                })
            }
            <Route path="/404">
            </Route>
          </Routes>
        </Router>
    );
}

export default Routers;