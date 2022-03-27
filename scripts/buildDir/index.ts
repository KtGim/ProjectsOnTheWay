import chokidar from 'chokidar';
import fs from 'fs';
import {resolve, extname} from 'path';
import { FilterModules } from '../helpers';

const componentsPath = resolve(__dirname, '../../components');
const docsPath = resolve(__dirname, '../../docs');
const fileExtensions = ['.js', '.jsx', '.tsx', '.md'];

const watcher = chokidar.watch(resolve(componentsPath), {
    // ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true,
    ignoreInitial: true
});

watcher
    // .on('add', path => log(`File ${path} has been added`))
    // .on('change', path => log(`File ${path} has been changed`))
    // .on('unlink', path => log(`File ${path} has been removed`))
    .on('addDir', (path) => {
        const moduleName = path.split('components')[1];
        if(moduleName) {
            const isFilterPath = FilterModules.some(mn => moduleName.indexOf(mn) > -1);
            if(!isFilterPath) {
                const docsDesPath = `${docsPath}${moduleName}`;
                if(!fs.existsSync(docsDesPath)) {
                    const fileExtension = extname(docsDesPath);
                    if(fileExtensions.indexOf(fileExtension) == -1) {
                        // 是目录
                        fs.mkdirSync(docsDesPath);

                        console.log(docsDesPath, '目录创建成功\n');
                    }
                }
            }
        } 
    })
    // .on('unlinkDir', (pth) => {
    //     const moduleName = pth.split('components')[1];
    //     if(moduleName) {
    //         const isFilterPath = FilterModules.some(mn => moduleName.indexOf(mn) > -1);
    //         if(!isFilterPath) {
    //             const docsDesPath = `${docsPath}${moduleName}`;
    //             if(fs.existsSync(docsDesPath)) {
    //                 fs.unlinkSync(docsDesPath);
    //             }
    //         }
    //     } 
    // })
    // .on('error', error => {
    //     console.log(error, '============error===============')
    // })
    // .on('raw', (event, path, details) => { // internal
    //     console.log(event, path, details, 'raw');
    // });
console.log('======= listening for dir changes =======');