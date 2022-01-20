import { marked } from 'marked';
import { transformSync } from '@babel/core';
import { writeFileSync } from 'fs';
import path from 'path';

const virtualFilePath = './helper/rollup-plugin-md-parser/.virtualFile';
const fileInputPath = '../helper/rollup-plugin-md-parser/.virtualFile/';

const langs = ['ts', 'tsx', 'js', 'javascript', 'jsx'];
export default function myExample () {
  return {
    name: 'md-parser', // this name will show up in warnings and errors
    // resolveId (source, importer, options) {
    // },
    // load (id) {
    //   }
    // },
    transform ( code, id ) {
      // console.log(path.basename(id));
      // console.log(path.dirname(id));
      // console.log(path.extname(id));
      if(id && id.endsWith('.md')) {
        const comps = [];
        const tokens = marked.lexer(code);
        // console.log(tokens);
        
        tokens.forEach(token => {
          const {
            type,
            lang,
            text
          } = token;
          if(type == 'code' && langs.indexOf(lang) > -1) {
            let tempModule = '';
            if(lang == 'javascript') {
              tempModule = `
                import React from 'react';
                const TempModule = () => {
                  return (
                    <div className="code">
                      ${text}
                    </div>
                  )
                };
                export default TempModule
              `;
            } else if(lang == 'tsx') {
              tempModule = `
                import React from 'react';
                ${text}
              `;
            }

            const id = (Math.random() * 100000).toFixed(0);
            writeFileSync(`${virtualFilePath}/Comp${id}.tsx`, tempModule, { flag: 'w+' });
            comps.push(id);
          }
        })
        let tempModule = '';
        if(comps && comps.length) {
          const importStrings = [];
          const comStrings = [];

          comps.forEach((id, index) => {
            importStrings.push(`import Comp${id} from '${fileInputPath}/Comp${id}'`);
            comStrings.push(`
              <div className="code" key="comp_${index}">
                <Comp${id} />
              </div>
            `);
          });
         
          tempModule = `
            import React from 'react';
            import CodeBox from './CodeBox';
            ${importStrings.join(';\n')}

            const TempModule = () => {
              return (
                <CodeBox>
                  ${comStrings.join('\n')}
                </CodeBox>
              )
            };
            export default TempModule
          `;

          console.log(tempModule);
        }
        if(tempModule) {
          const {code, map} = transformSync(tempModule, {
            ast: false,
            code: true,
            filename: 'tempModule.tsx',
            configFile: path.resolve('./babelrc.json')
          });
          return {
            code,
            map
          };
        }
      }
    },
    // moduleParsed(moduleInfo) {
    // }
  };
}