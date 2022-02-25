import React from 'react';
import { Link } from 'react-router-dom';

const Nav = () => {
    return (
        <nav className="nav">
            <Link to="/component">组件</Link>
            <Link to="/logs">日志</Link>
        </nav>
    )
}

export default Nav;