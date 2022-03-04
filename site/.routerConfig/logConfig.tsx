
    import { LogRouteProps } from './common';

    const routerConfig: LogRouteProps[] = [
        
        {
            name: 'v1.md',
            path: 'v1.md',
            key: 'v1.md',
            moduleName: 'changeLogs'
        }
    
    ];
    
    export default routerConfig;


    type moduleNameType = 'changeLogs';
    type componentNameType = 'v1.md';

    export {
        moduleNameType,
        componentNameType
    };
    