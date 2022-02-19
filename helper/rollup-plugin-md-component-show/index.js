import { marked } from 'marked';
import { transformSync } from '@babel/core';
import path from 'path';

const DEMO_FLAG = 'demo';

const firstToUpper = (str) => {
    return str.trim().toLowerCase().replace(str[0], str[0].toUpperCase());
}

export default function returnNewMd () {

  return {
    name: 'return-md', // this name will show up in warnings and errors
    transform ( code, id ) {
      if(path.extname(id) == '.md') {
        const mdFileName = firstToUpper(path.basename(id).replace('.md', '')); //获取当前文件名
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

            const TempModule${mdFileName} = () => {
                return (
                    <CodeProvider
                        markdown={${JSON.stringify(code.replace(new RegExp('``` demo','g'), '').replace(new RegExp('```  ','g'), ''))}}
                        components={{
                            ${components.join(',')}
                        }}
                    />
                )
            }

            export default TempModule${mdFileName};
        `;
        
        const {code: cde, map} = transformSync(tempModule, {
            ast: false,
            code: true,
            filename: `TempModule${mdFileName}.tsx`,
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