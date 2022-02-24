import React from  'react';
import { Outlet } from 'react-router-dom';

import Nav from './nav';
const Layout = () => {
    return (
        <div className="main">
            <nav><Nav /></nav>
            <div className="content">
                <Outlet />
            </div>
        </div>
    )
}

export default Layout;