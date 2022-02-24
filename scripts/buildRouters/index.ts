import fs from 'fs';
import {resolve, join} from 'path';
import buildRouteConfig from './buildRouteConfig';
import { buildComponents } from './buildLazyComponents';
import { RouteProps } from "./type";
import { FilterModules } from './helpers';
import { componentNameType, moduleNameType } from '../../site/.routerConfig/config';

const componentsRoot = resolve(__dirname, '../../components');
const routerRoot = resolve(__dirname, '../../site/.routerConfig');

// @ts-ignore  主要是 泛型无法转换成指定的 string 类型
const getModuleComponentName: <T>(path: string) => T[] = (path: string) => {
    return fs.readdirSync(path)
    .filter((f: string) =>
        FilterModules.indexOf(f) == -1 && (fs.statSync(join(path, f)).isDirectory())
    );
}

const leadingInNames: moduleNameType[] = getModuleComponentName<moduleNameType>(componentsRoot);
const routerConfigArr: RouteProps[] = [];

leadingInNames.forEach((mName: moduleNameType) => {
    const componentsPathPre = `${componentsRoot}/${mName}/`;
    const componentsInModule = getModuleComponentName<componentNameType>(componentsPathPre);
    componentsInModule.forEach((comName) => {
        routerConfigArr.push({
            name: comName,
            path: `${mName}/${comName}`,
            key: comName,
            moduleName: mName
        });
    })
});

const routerConfigTemplate = buildRouteConfig(routerConfigArr);
const routerComponentsTemplate = buildComponents(routerConfigArr);

fs.writeFileSync(`${routerRoot}/config.ts`, routerConfigTemplate, 'utf-8');
fs.writeFileSync(`${routerRoot}/lazyComponents.tsx`, routerComponentsTemplate, 'utf-8');