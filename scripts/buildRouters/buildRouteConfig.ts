const getArrString = (set: Set<string>) => {
    return [...set].map((s, index) => index == set.size - 1 ? `'${s}'` : `'${s}' | `).join('')
};

const buildRouteConfig:<T>(moduleNames: T[], routerType: 'RouteProps' | 'LogRouteProps') => string = (moduleNames, routerType) => {
    const modules: Set<string> = new Set();
    const componentsName: Set<string> = new Set();
    return `
    import { ${routerType} } from './common';

    const routerConfig: ${routerType}[] = [
        ${
            //@ts-ignore 
            moduleNames.map(({name, path, moduleName}) => {
                moduleName && modules.add(moduleName);
                name && componentsName.add(name);
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


    type moduleNameType = ${getArrString(modules)};
    type componentNameType = ${getArrString(componentsName)};

    export {
        moduleNameType,
        componentNameType
    };
    `;
}

export default buildRouteConfig;