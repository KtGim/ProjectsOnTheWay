
    import { RouteProps } from './common';

    const routerConfig: RouteProps[] = [
        
        {
            name: 'A',
            path: 'business/A',
            key: 'A',
            moduleName: 'business'
        }
    ,
        {
            name: 'B',
            path: 'business/B',
            key: 'B',
            moduleName: 'business'
        }
    ,
        {
            name: 'Switch',
            path: 'common/Switch',
            key: 'Switch',
            moduleName: 'common'
        }
    
    ];
    
    export default routerConfig;


    type moduleNameType = 'business' | 'common';
    type componentNameType = 'A' | 'B' | 'Switch';

    export {
        moduleNameType,
        componentNameType
    };
    