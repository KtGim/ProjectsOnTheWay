import React from 'react';
import { NavLink } from 'react-router-dom';
import { RouteProps, RoutersMapProps } from 'site/.routerConfig/common';
import { moduleNameType } from 'site/.routerConfig/config';

const ComponentsMenu = ({
    routerConfig,
    prePath
}: {
    routerConfig: RoutersMapProps,
    prePath: string
}) => {
    return (
        <div className="menu-list">
            {
                Object.keys(routerConfig).map(moduleKey => {
                    const child: RouteProps[] = routerConfig[moduleKey as moduleNameType] as RouteProps[];
                    return (
                        <div className="sub-menu" key={moduleKey}>
                            <p className="title">{moduleKey}</p>
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