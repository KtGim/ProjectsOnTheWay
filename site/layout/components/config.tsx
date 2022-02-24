import { moduleNameType } from "site/.routerConfig/config";


const moduleNames: {
    [key in moduleNameType]: string
} = {
    'business': '业务组件',
    // 'common': '通用组件'
};


export {
    moduleNames
}