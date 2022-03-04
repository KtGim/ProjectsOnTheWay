import { ReactNode } from "react";
import { moduleNameType, componentNameType } from './config';

interface RouteProps {
    name: componentNameType;
    key: string;
    component?: ReactNode;
    path: string;
    moduleName?: moduleNameType
}

interface LogRouteProps {
    name: string;
    key: string;
    component?: ReactNode;
    path: string;
    moduleName?: string
}

type ComponentsProps = {
    [key in componentNameType]: React.LazyExoticComponent<React.ComponentType<any>>
}

type LogComponentsProps = {
    [key: string]: React.LazyExoticComponent<React.ComponentType<any>>
}

type RoutersMapProps = {
    [key in moduleNameType | string]?: (RouteProps | LogRouteProps)[]
}

export {
    RouteProps,
    ComponentsProps,
    RoutersMapProps,
    LogRouteProps,
    LogComponentsProps
}