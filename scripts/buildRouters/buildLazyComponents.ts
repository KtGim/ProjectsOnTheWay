import { RouteProps } from "./type";
import { docsPath } from './type';

// const buildLazyComponents = (moduleNames: RouteProps[]) => {
//     return `
//     import {lazy} from 'react';
//     import { ComponentsProps } from './common';

//     const components: ComponentsProps = {
//         ${
//             moduleNames.map(({name, moduleName}) => {
//                 return (
//     `
//     ${name}: lazy(() => import(('${docsPath}/${moduleName}/${name}/Demo.md')))
//     ` 
//                 )
//             })
//         }
//     };

//     export default components;
//     `;
// }



const buildLazyComponents = (moduleNames: RouteProps[]) => {
    const importStrings: string[] = [];

    moduleNames.forEach(({name, moduleName}) => {
        importStrings.push(`import ${name} from '${docsPath}/${moduleName}/${name}/Demo.md';`);
    });
    return `
    import {lazy} from 'react';
    import { ComponentsProps } from './common';
    ${
        moduleNames.map(({name, moduleName}) => {
            return (
`
import 
` 
            )
        })
    }

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

export default buildLazyComponents;