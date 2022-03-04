import fs from 'fs';
import {resolve, join} from 'path';
import buildRouteConfig from './buildRouteConfig';
import { buildComponents, buildLogComponents } from './buildLazyComponents';
import { RouteProps, LogRouteProps } from "./type";
import { FilterModules } from './helpers';
import { componentNameType, moduleNameType } from '../../site/.routerConfig/config';

const componentsRoot = resolve(__dirname, '../../components');
const routerRoot = resolve(__dirname, '../../site/.routerConfig');
const logsRoot = resolve(__dirname, '../../docs/changeLogs');

// @ts-ignore  主要是 泛型无法转换成指定的 string 类型
const getModuleComponentName: <T>(path: string) => T[] = (path: string) => {
    return fs.readdirSync(path)
    .filter((f: string) =>
        FilterModules.indexOf(f) == -1 && (fs.statSync(join(path, f)).isDirectory())
    );
}

const getFileName: (path: string) => string[] = (path) => {
    return fs.readdirSync(path)
    .filter((f: string) =>
        FilterModules.indexOf(f) == -1 && (fs.statSync(join(path, f)).isFile())
    );
}

const leadingInNames: moduleNameType[] = getModuleComponentName<moduleNameType>(componentsRoot);
const routerConfigArr: RouteProps[] = [];
const logs: string[] = getFileName(logsRoot);
const logsConfigArr: RouteProps[] = [];

logs.forEach(logName => {
    logsConfigArr.push({
        name: logName as componentNameType,
        path: `${logName}`,
        key: logName,
        moduleName: 'changeLogs' as moduleNameType
    });
});

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

const routerConfigTemplate = buildRouteConfig<RouteProps>(routerConfigArr, 'RouteProps');
const routerComponentsTemplate = buildComponents(routerConfigArr);
const logConfigTemplate = buildRouteConfig<LogRouteProps>(logsConfigArr, 'LogRouteProps');
const logComponentsTemplate = buildLogComponents(logsConfigArr);

fs.writeFileSync(`${routerRoot}/config.ts`, routerConfigTemplate, 'utf-8');
fs.writeFileSync(`${routerRoot}/lazyComponents.tsx`, routerComponentsTemplate, 'utf-8');
fs.writeFileSync(`${routerRoot}/logConfig.tsx`, logConfigTemplate, 'utf-8');
fs.writeFileSync(`${routerRoot}/logComponents.tsx`, logComponentsTemplate, 'utf-8');
