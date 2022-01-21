import { marked } from 'marked';
import { transformSync } from '@babel/core';
import { writeFileSync, readdirSync, unlinkSync, statSync } from 'fs';

import path from 'path';

const virtualFilePath = './helper/rollup-plugin-md-parser/.virtualFile';
const fileInputPath = '../helper/rollup-plugin-md-parser/.virtualFile';

const langs = ['ts', 'tsx', 'js', 'javascript', 'jsx'];
// 设计缓存文件，不频繁生成和删除文件

export default function myExample () {
  const modules = {};
  const getId = () => {
    let id = (Math.random() * 100000).toFixed(0);
    while(modules[id]) {
      id = (Math.random() * 100000).toFixed(0);
    }
    modules[id] = id;
    return id;
  }

  const delFile = (() => {
      return {
          init: function (url) {
              this.del(url);
          },
          del: function (url) {
              var files = [];
              files = readdirSync(url);
              for (var i = 0; i < files.length; i++) {
                  var path = url + '/' + files[i];
                  if (statSync(path).isFile()) {
                      unlinkSync(path);
                  } else {
                      this.del(path);
                  }
              }
              // rmdirSync(url);
          }
      };
  })();

  return {
    name: 'md-parser', // this name will show up in warnings and errors
    buildStart() {
      // 清空文件
      delFile.init(`${virtualFilePath}/`);
    },
    resolveId (source, importer, options) {
      console.log('resolveId', importer);
    },
    load (id) {
      console.log('load');
    },
    transform ( code, id ) {
      console.log('transform')
      // console.log(path.basename(id));
      // console.log(path.dirname(id));
      // console.log(path.extname(id));
      if(id && id.endsWith('.md')) {
        const comps = [];
        const tokens = marked.lexer(code);
        console.log(tokens);
        
        tokens.forEach((token) => {
          const {
            type,
            lang,
            text
          } = token;
          if(type == 'code' && langs.indexOf(lang) > -1) {
            let tempModule = '';
            const moduleText = text.replace('components', '../../../components');
            if(lang == 'javascript') {
              tempModule = `
                import React from 'react';
                const TempModule = () => {
                  return (
                    <div className="code">
                      ${moduleText}
                    </div>
                  )
                };
                export default TempModule
              `;
            } else if(lang == 'tsx') {
              tempModule = `
                import React from 'react';
                ${moduleText}
              `;
            }

            const id = getId();
            
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
    moduleParsed(moduleInfo) {
      console.log('moduleParsed')
    }
  };
}