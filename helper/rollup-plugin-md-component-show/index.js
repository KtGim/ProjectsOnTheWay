import { marked } from 'marked';
import { transformSync } from '@babel/core';
import path from 'path';

const DEMO_FLAG = 'demo';
const COMPONENTS_MODULE_NAME = `components${path.sep}`;
const DOCS_MODULE_NAME = `docs${path.sep}`;

const firstToUpper = (str) => {
    return str.trim().toLowerCase().replace(str[0], str[0].toUpperCase());
}

const getProviderPath = (pa) => {
    const docsPath = pa.split(DOCS_MODULE_NAME)[1];
    const paths = (docsPath).split(path.sep);
    const prePath = path.dirname(docsPath);
    return {
        preFix: Array.from({length: paths.length}).fill('..').join('/'),
        prePath: prePath.replace(path.sep, '/')
    };
}

export default function returnNewMd () {

  return {
    name: 'return-md', // this name will show up in warnings and errors
    transform ( code, id ) {
        if(path.extname(id) == '.md') {
            const pa = path.normalize(id);
            const {
                preFix,
                prePath
            } = getProviderPath(pa);
            const providerRelativePath = `${preFix}/`;
            const mdFileName = firstToUpper(path.basename(id).replace('.md', '')); //获取当前文件名
            const components = [];
            const tokens = marked.lexer(code);
            tokens.forEach(t => {
                if(t.lang && t.lang == DEMO_FLAG) {
                    const componentName = t.text.replace('<', '').replace(' />', '');
                    components.push(componentName);
                }
            });

            const importStrings = [];
            components.forEach((id) => {
                importStrings.push(`import ${id} from '${providerRelativePath}components/index';`);
            });

            /**
             * markdown 的内容需要展示出实际的组件
             * 为了方便进行 字符串替换
             * 在编写 demo 时
             * 要保持
             * ``` demo
             * <Component />
             * ```  
             * 结尾的 ``` 后面需要加上两个空格
             * 目的主要是为了 方便进行字符串替换
             */
            const fileName = `TempModule${firstToUpper(mdFileName)}`;
            const tempModule = `
                import React from 'react';
                import CodeProvider from '${providerRelativePath}site/CodeProvider';
                ${importStrings.join('\n')}

                const ${fileName} = () => {
                    return (
                        <CodeProvider
                            markdown={${JSON.stringify(code.replace(new RegExp('``` demo','g'), '').replace(new RegExp('```  ','g'), ''))}}
                            ${
                                components.length ?
`
components={{
    ${components.join(',')}
}}
` : undefined
                            }
                        />
                    )
                }

                export default ${fileName};
            `;

            // console.log(tempModule);

            const {code: cde, map} = transformSync(tempModule, {
                ast: false,
                code: true,
                filename: `${fileName}.tsx`,
                configFile: path.resolve('./babelrc.json')
            });
            return {
                code: cde,
                map
            };
        }
    }
  };
}