import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { RouteProps, RoutersMapProps } from 'site/.routerConfig/common';
import { moduleNameType } from 'site/.routerConfig/config';
import Switcher from 'components/common/Switch';

import { ProviderContext } from 'site/App';

const ComponentsMenu = ({
    routerConfig,
    prePath
}: {
    routerConfig: RoutersMapProps,
    prePath: string
}) => {

    const {state, dispatch} = useContext(ProviderContext);
    const changeTheme = () => {
        dispatch && dispatch({type: 'CHANGE_THEME', payload: {theme: state.theme == 'light' ? 'dark' : 'light'}}) 
    }

    return (
        <div className="menu-list">
            {
                Object.keys(routerConfig).map((moduleKey, index) => {
                    const child: RouteProps[] = routerConfig[moduleKey as moduleNameType] as RouteProps[];
                    return (
                        <div className="sub-menu" key={moduleKey}>
                            <p className="title">{moduleKey}{index == 0 && <Switcher onChange={changeTheme} className="switcher"/>}</p>
                            {
                                child && child.map(({path, name}) => (
                                    <NavLink
                                        key={path}
                                        className={({ isActive }) => isActive ? `link active` : `link`} 
                                        to={`/${prePath}/${path}`}
                                    >{name}</NavLink>)
                                )
                            }
                        </div>
                    )
                })
            }
        </div>
    )
}

export default ComponentsMenu;