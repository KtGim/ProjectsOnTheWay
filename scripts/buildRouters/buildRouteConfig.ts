import { RouteProps } from "./type";

const buildRouteConfig = (moduleNames: RouteProps[]) => {
    return `
    import { RouteProps } from './common';

    const routerConfig: RouteProps[] = [
        ${
            moduleNames.map(({name, path, moduleName}) => {
                return (
    `
        {
            name: '${name}',
            path: '${path}',
            key: '${name}',
            moduleName: '${moduleName}'
        }
    `)
            })
        }
    ];
    
    export default routerConfig;
    `;
}

export default buildRouteConfig;