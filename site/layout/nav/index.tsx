import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ProviderContext } from 'site/App';
import Switcher from 'components/common/Switch';

const Nav = () => {
    const {state, dispatch} = useContext(ProviderContext);
    return (
        <nav className="nav">
            <Link to="/component">组件</Link>
            <Link to="/logs">日志</Link>
            <Link  to="#" onClick={() => { dispatch && dispatch({type: 'CHANGE_THEME', payload: {theme: state.theme == 'light' ? 'dark' : 'light'}}) }}>换肤</Link>
            <Switcher />
        </nav>
    )
}

export default Nav;