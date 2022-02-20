const fs = require('fs');
const {resolve, join} = require('path');
import buildRouteConfig from './buildRouteConfig';
import buildLazyComponents from './buildLazyComponents';
import { RouteProps, ComponentsKey } from "./type";

const componentsRoot = resolve(__dirname, '../../components');
const routerRoot = resolve(__dirname, '../../site/.routerConfig');

const getModuleComponentName: (path: string) => ComponentsKey[] = (path: string) => {
    return fs.readdirSync(path)
    .filter((f: any) =>
      (fs.statSync(join(path, f)).isDirectory()) && (f !== 'style')
    )
}
const leadingInNames: ComponentsKey[] = getModuleComponentName(componentsRoot);

const routerConfigArr: RouteProps[] = [];

leadingInNames.forEach((mName: ComponentsKey) => {
    const componentsPathPre = `${componentsRoot}/${mName}/`;
    const componentsInModule = getModuleComponentName(componentsPathPre);
    componentsInModule.forEach((comName: string) => {
        routerConfigArr.push({
            name: comName,
            path: `${mName}/${comName}`,
            key: comName,
            moduleName: mName
        });
    })
});

const routerConfigTemplate = buildRouteConfig(routerConfigArr);
const routerComponentsTemplate = buildLazyComponents(routerConfigArr);

fs.writeFileSync(`${routerRoot}/config.ts`, routerConfigTemplate, 'utf-8');
fs.writeFileSync(`${routerRoot}/lazyComponents.tsx`, routerComponentsTemplate, 'utf-8');