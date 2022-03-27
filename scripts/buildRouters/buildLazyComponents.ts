import { LogRouteProps, RouteProps } from "./type";
import { docsPath } from '../helpers';
import { upperCaseName } from '../../utils'
// lazy component 引用时会报错
const buildLazyComponents = (moduleNames: RouteProps[]) => {
    return `
    import {lazy} from 'react';
    import { ComponentsProps } from './common';

    const components: ComponentsProps = {
        ${
            moduleNames.map(({name, moduleName}) => {
                return (
    `
    ${name}: lazy(() => import(('${docsPath}/${moduleName}/${name}/Demo.md')))
    ` 
                )
            })
        }
    };

    export default components;
    `;
}

const buildComponents = (moduleNames: RouteProps[]) => {
    const importStrings: string[] = [];

    moduleNames.forEach(({name, moduleName}) => {
        importStrings.push(`import ${name} from '${docsPath}/${moduleName}/${name}/Demo.md';`);
    });
    return `
    import { ComponentsProps } from './common';
    ${importStrings.join('\n')}

    const components: ComponentsProps = {
        ${
            moduleNames.map(({name}) => {
                return (
    `
    ${name}: ${name}
    ` 
                )
            })
        }
    };

    export default components;
    `;
}

const buildLogComponents = (moduleNames: LogRouteProps[]) => {
    const importStrings: string[] = [];

    moduleNames.forEach(({name}) => {
        importStrings.push(`import ${upperCaseName(name)} from '${docsPath}/changeLogs/${name}';`);
    });
    return `
    import { LogComponentsProps } from './common';
    ${importStrings.join('\n')}

    const components: LogComponentsProps = {
        ${
            moduleNames.map(({name}) => {
                const cName = upperCaseName(name);
                return (
    `
    ${cName}: ${cName}
    ` 
                )
            })
        }
    };

    export default components;
    `;
}

export {
    buildLazyComponents,
    buildComponents,
    buildLogComponents
};