import React from 'react';
import { NavLink } from 'react-router-dom';

const Nav = () => {
    return (
        <nav className="nav">
            <span className="logo"></span>
            <NavLink to="/component" className={({ isActive }) => isActive ? 'active' : ''}>组件</NavLink>
            <NavLink to="/logs" className={({ isActive }) => isActive ? 'active' : ''}>日志</NavLink>
        </nav>
    )
}

export default Nav;