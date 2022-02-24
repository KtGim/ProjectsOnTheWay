import { ReactNode } from "react";
type ComponentsKey = 'business' | 'common';
interface RouteProps {
    name: string;
    key: string;
    component?: ReactNode;
    path: string;
    moduleName?: ComponentsKey
}

interface ComponentsProps {
    [key: string]: React.LazyExoticComponent<React.ComponentType<any>>
}

interface RoutersMapProps {
    [key: string]: RouteProps[]
}

export {
    RouteProps,
    ComponentsProps,
    ComponentsKey,
    RoutersMapProps
}