import { ReactNode } from "react";
import { moduleNameType, componentNameType } from './config';

interface RouteProps {
    name: componentNameType;
    key: string;
    component?: ReactNode;
    path: string;
    moduleName?: moduleNameType
}

type ComponentsProps = {
    [key in componentNameType]: React.LazyExoticComponent<React.ComponentType<any>>
}

type RoutersMapProps = {
    [key in moduleNameType | string]?: RouteProps[]
}

export {
    RouteProps,
    ComponentsProps,
    RoutersMapProps
}