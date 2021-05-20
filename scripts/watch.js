const chokidar = require('chokidar');
const fs = require('fs');
const {resolve, join} = require('path');

const buildIndex = require('./buildIndex');
const buildRoutesTemplate = require('./buildRoutesTemplate')

const buildRoutes = require('./buildRoutes');
// const buildDoc = require('./buildDoc');
const BuildDoc = require('./buildDocs').default;

const watcher = chokidar.watch(resolve(__dirname, '../components'), {
  ignored: /(^|[\/\\])\../, // ignore dotfiles
  persistent: true
});

const root = resolve(__dirname, '../components');

let leadingInNames = fs.readdirSync(root)
  .filter((f) =>
    (fs.statSync(join(root, f)).isDirectory()) && (f !== 'style')
  )

const buildDocs = new BuildDoc(leadingInNames, 'initial');
// type ActionType = 'created' | 'moved' | 'modified';
watcher
  // .on('add', path => log(`File ${path} has been added`))
  // .on('change', path => log(`File ${path} has been changed`))
  // .on('unlink', path => log(`File ${path} has been removed`))
  // .on('addDir', path => {
  //   const dir = path.split('/').pop();
  //   if(['components', 'style'].indexOf(dir) === -1) {
  //     const leadingInNames = fs.readdirSync(root)
  //       .filter(async (f) =>
  //         await fs.statSync(join(root, f)).isDirectory() && f !== 'style'
  //       )
  //     (leadingInNames.indexOf(dir) === -1) && leadingInNames.push(dir);
  //     // const str = buildRoutesTemplate(leadingInNames);
  //     // log(str);
  //   }
  // })
  // .on('unlinkDir', path => log(`Directory ${path} has been removed`))
  // .on('error', error => log(`Watcher error: ${error}`))
  .on('ready', () => {
    if (leadingInNames.length) {
      // buildDoc(leadingInNames, 'initial')
      buildDocs.init();
      buildRoutes(buildRoutesTemplate(leadingInNames), 'created');
    }
  })
  .on('raw', (event, path, {type}) => { // internal
    let dir = path.split('/').pop();
    if(type === 'directory') {
      // console.log(leadingInNames, 'in', event);
      
      switch(event) {
        case 'created':
          leadingInNames.push(dir);
          break;
        case 'moved':
          leadingInNames = leadingInNames.filter(name => name !== dir);
          break;
      }

      buildIndex(dir, leadingInNames, event);
      // components/index.ts 变动时不触发
      if (dir !== 'components') {
        // buildDoc(dir, event);
        buildDocs.processDocs(dir, events);
      }
      buildRoutes(buildRoutesTemplate(leadingInNames), 'modified')
    } else {
      // components/index.ts 变动时不触发
      dir = resolve(path, '..').split('/').pop();
      if (dir !== 'components') {
        // buildDoc(dir, event);
        buildDocs.processDocs(dir, event);
      }
    }
  })