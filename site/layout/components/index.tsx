import React from 'react';
import { Outlet } from 'react-router-dom';

const ComponentsLayout = () => {
    return (
        <div className="components-layout">
            <div className="left">

            </div>
            <div className="content">
                <Outlet />
            </div>
        </div>
    )
}

export default ComponentsLayout;