import React from 'react';
import { Module } from 'creams-layout';
import rights from './rights';
// import { NavigationMenuRouteExtraProps } from '@/containers/NavigationMenu/interfaces';
import * as modals from './modals';
import * as models from './models';
import * as reducers from './reducers';
import { Icon } from '@/components';
import {
    AuthEnum,
    Role,
    ModuleEnum,
    TagAuthWrapper,
    CustomizeFormAuthWrapper,
    AuditAuthWrapper,
} from '@/authorities';

// 具体内容根据实际定义
interface NavigationMenuRouteExtraProps {}


const module: Module<NavigationMenuRouteExtraProps> = {
    moduleName: 'module_{moduleName}',
    manager: 'your name',
    modals: Object.keys(modals).map((key: string) => modals[key]),
    models: Object.keys(models).map((key: string) => models[key]),
    reducers,
    rights,
    routes: [
        {
            path: '/profile/{pageName}',
            name: '{pageName}',
            manager: 'your name',
            extraProps: {
                icon: <Icon type={'creams-notification'} />,
                authority: [AuthEnum.enum.USER_ROLE.key],
                noLink: false,
                role: [Role.CUSTOMER_MASTER, Role.CUSTOMER_ADMIN],
                module: ModuleEnum.enum.MODULE_PROPERTY_MANAGEMENT.key,
                // module: TagAuthWrapper.moduleAuth,
                // module: CustomizeFormAuthWrapper.moduleAuth,
            },
            routes: [
                {
                    path: '/profile/{pageName}',
                    redirect: '/profile/{pageName}/index',
                },
                {
                    path: '/profile/{pageName}/index',
                    name: '{pageName}页面',
                    extraProps: {
                        authority: [],
                    },
                    manager: 'gim',
                    component: () => import('./pages/demoPage/Demo/index'),
                    models: () => [
                        import('./pages/demoPage/Demo/model/index'),
                    ],
                },
            ],
        },
        // {
        //     path: '/profile',
        //     name: '单纯的路由不展示在菜单上',
        //     extraProps: {
        //         authority: [],
        //         justRoute: true,
        //     },
        //     routes: [
        //         {
        //             path: '/profilew/user/ModifyEmail',
        //             name: '修改邮箱账户',
        //             extraProps: { authority: [] },
        //             manager: 'yehq',
        //             component: () => import('./pages/accountSetting/modifyEmail'),
        //         },
        //     ],
        // },
    ],
};

export default [module];
