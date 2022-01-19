import { marked } from 'marked';

export default function myExample () {
    const mdFiles = {};

    return {
      name: 'md-parser', // this name will show up in warnings and errors
      resolveId (source) {
        if(source && source.endsWith('.tsx')) {
          console.log(source, 'resolveId');
        }
        // if(mdFiles[source]) {
          // const tokens = marked.lexer(mdFiles[source]);
          // console.log(tokens);
          
          // const html = marked.parser(tokens);
          // console.log(html);
          // return `<div>${html}</div>`
        // }
        // return null
      },
      load (id) {
        if(id && id.endsWith('.tsx')) {
          console.log(id, 'load');
        }
      },
      transform ( code, id ) {
        // console.log(id);
        if(id && id.endsWith('.tsx')) {
          console.log(code, id, 'transform');
          // mdFiles[id] = code;
          // const tokens = marked.lexer(code);
          // console.log(tokens);
          // const codes = [];

          // tokens.forEach(token => {
          //   const { type, lang, text } = token;
          //   if(type == 'code' && lang == 'javascript') {
          //     codes.push(text);
          //   }
          // })
          // return {
          //   code: `
          //     const transformMd = ${codes.join('\n')}
          //     export default transformMd;
          //   `
          // }
        }
      },
      moduleParsed(moduleInfo) {
        if(moduleInfo && moduleInfo.id.includes('.tsx')) {
          console.log(moduleInfo, 'moduleParsed');
        }
      }
    };
}