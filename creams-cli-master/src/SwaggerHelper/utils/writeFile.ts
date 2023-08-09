import fs from 'fs';
import mkdirp from 'mkdirp';
import { dirname } from 'path';

export default function writeFile(path: string, contents: string, imports?: string) {
    return new Promise((resolve, reject) => {
        mkdirp(dirname(path), (err) => {
            if (err) return reject(err);
            if (fs.existsSync(path)) {
                fs.appendFile(path, contents, (error) => {
                    if (error) reject(error);
                    resolve();
                })
            } else {
                const realContents: string = imports ? `${imports}\n${contents}` : contents;
                fs.writeFile(path, realContents, (error) => {
                    if (error) reject(error);
                    resolve();
                });
            }
        });
    });
}

