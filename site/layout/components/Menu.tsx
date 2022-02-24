import React from 'react';
import { NavLink } from 'react-router-dom';
import { routerConfigs } from 'site/.routerConfig';
import { RouteProps } from 'site/.routerConfig/common';
import { moduleNameType } from 'site/.routerConfig/config';

const ComponentsMenu = () => {
    return (
        <div className="menu-list">
            {
                Object.keys(routerConfigs).map(moduleKey => {
                    const child: RouteProps[] = routerConfigs[moduleKey as moduleNameType] as RouteProps[];
                    return (
                        <div className="sub-menu">
                            <p className="title">{moduleKey}</p>
                            {
                                child && child.map(({path, name}) => (
                                    <NavLink
                                        className={({ isActive }) => isActive ? `link active` : `link`} 
                                        to={`/component/${path}`}
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