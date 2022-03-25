import React from  'react';
import { Outlet } from 'react-router-dom';

import Nav from './Nav';
const Layout = () => {
    return (
        <div className="main">
            <Nav />
            <div className="content">
                <Outlet />
            </div>
        </div>
    )
}

export default Layout;