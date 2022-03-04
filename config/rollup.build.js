import { resolve } from 'path'; 
import initCommonConfig from './common';
import { commonConf, getModuleComponentName, capitalize } from './splits';

const componentsRoot = resolve(__dirname, '../components');
const componentsOutput = resolve(__dirname, '../lib');

const leadingInNames = getModuleComponentName(componentsRoot);

const buildComponents = [];
leadingInNames.forEach((mName) => {
    const componentsPathPre = `${componentsRoot}/${mName}/`;
    const componentsInModule = getModuleComponentName(componentsPathPre);
    componentsInModule.forEach((comName) => {
        const upName = capitalize(comName);
        upName && buildComponents.push(commonConf(`${componentsPathPre}${upName}/index.tsx`, upName, `${componentsOutput}/${upName}`));
    })
});

const baseConfig = initCommonConfig();

export default [{
    ...baseConfig,
    output: {
        format: "esm",
        dir: "./lib/esm",
        sourcemap: true,
        globals: {
            react: 'React',
            antd: 'antd',
            'react-dom': 'react-dom'
        }
    }
}, {
    ...baseConfig,
    output: {
        format: "amd",
        dir: "./lib/amd",
        sourcemap: true,
        globals: {
            react: 'React',
            antd: 'antd',
            'react-dom': 'react-dom'
        }
    }
}, {
    ...baseConfig,
    output: {
        format: "umd",
        dir: "./lib/umd",
        name: 'wmsUI',
        sourcemap: true,
        globals: {
            react: 'React',
            antd: 'antd',
            'react-dom': 'react-dom'
        }
    }
},
    ...buildComponents
];