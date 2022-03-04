import React from 'react';
import { Outlet } from 'react-router-dom';
import { RoutersMapProps } from 'site/.routerConfig/common';
import ComponentsMenu from './Menu';
const ComponentsLayout = ({
    routerConfig,
    prePath
}: {
    routerConfig: RoutersMapProps
    prePath: string
}) => {
    return (
        <div className="components-layout">
            <div className="left">
                <ComponentsMenu routerConfig={routerConfig} prePath={prePath}/>
            </div>
            <div className="content">
                <Outlet />
            </div>
        </div>
    )
}

export default ComponentsLayout;