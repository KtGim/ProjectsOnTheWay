import { marked } from 'marked';
import { transformSync } from '@babel/core';
import path from 'path';

const DEMO_FLAG = 'demo';

export default function returnNewMd () {

  return {
    name: 'return-md', // this name will show up in warnings and errors
    transform ( code, id ) {
      if(path.extname(id) == '.md') {
        // const mdFileName = path.basename(id); //获取当前文件名
        // const mdFilePath = id.split('components')[1];
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
            importStrings.push(`import ${id} from './${id}'`);
        });

        const tempModule = `
            import React from 'react';
            import CodeProvider from '../site/CodeProvider';
            ${importStrings.join(';\n')}

            const TempModule = () => {
                return (
                    <CodeProvider
                        markdown={${JSON.stringify(code)}}
                        components={{
                            ${components.join(',')}
                        }}
                    />
                )
            }

            export default TempModule;
        `;

        console.log(tempModule);
        
        const {code: cde, map} = transformSync(tempModule, {
            ast: false,
            code: true,
            filename: 'TempModule.tsx',
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