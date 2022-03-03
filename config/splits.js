import fs from 'fs';
import { join } from 'path';
import baseConfig from './common';
const FilterModules = ['docs', 'style'];

const getModuleComponentName = (path) => {
    return fs.readdirSync(path)
    .filter((f) =>
        FilterModules.indexOf(f) == -1 && (fs.statSync(join(path, f)).isDirectory())
    );
}

const capitalize = s => {
    if (typeof s !== "string") return "";
    return s.charAt(0).toUpperCase() + s.slice(1);
};


const commonConf = (input, name, output) => {
    if(!input) return;
    return {
        ...baseConfig,
        input,
        output: {
            format: "umd",
            name,
            file: output,
            exports: "default",
            globals: {
                react: 'React',
                antd: 'antd',
                'react-dom': 'react-dom'
            }
        }
    }
}

export {
    commonConf,
    getModuleComponentName,
    capitalize
}


