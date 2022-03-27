import React, { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { RoutersMapProps } from 'site/.routerConfig/common';
import RopeSwitcher from 'site/components/RopeSwitch';
import ComponentsMenu from './Menu';

import { ProviderContext } from 'site/App';

const ComponentsLayout = ({
    routerConfig,
    prePath
}: {
    routerConfig: RoutersMapProps
    prePath: string
}) => {
    const {state, dispatch} = useContext(ProviderContext);
    const changeTheme = () => {
        dispatch && dispatch({type: 'CHANGE_THEME', payload: {theme: state.theme == 'light' ? 'dark' : 'light'}}) 
    }

    return (
        <div className="components-layout">
            <RopeSwitcher onClick={changeTheme}/>
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