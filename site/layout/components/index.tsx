import React from 'react';
import { Outlet } from 'react-router-dom';
import ComponentsMenu from './Menu';
const ComponentsLayout = () => {
    return (
        <div className="components-layout">
            <div className="left">
                <ComponentsMenu />
            </div>
            <div className="content">
                <Outlet />
            </div>
        </div>
    )
}

export default ComponentsLayout;