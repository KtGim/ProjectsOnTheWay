import { ReactNode } from "react";

const componentsPath = '../../components';

interface RouteProps {
    name: string;
    key: string;
    component?: ReactNode;
    path: string;
}

interface ComponentsProps {
    [key: string]: React.LazyExoticComponent<React.ComponentType<any>>
}

export {
    componentsPath,

    RouteProps,
    ComponentsProps
}