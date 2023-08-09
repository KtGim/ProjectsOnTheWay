import fs from 'fs';
import path from 'path';
const readdirSync  = fs.readdirSync;
const createReadStream = fs.createReadStream;
const createWriteStream = fs.createWriteStream;

type OptionsType = {
  moduleName: string,
  pageName: string,
  modelName: string,
}
class GenerateFiles {
  private src: string;
  private dest: string;
  private moduleName: string;
  private pageName: string;
  private modelName: string;

  constructor(src: string, dest: string, options: OptionsType) {
    this.src = src;
    this.dest = dest;
    this.moduleName = options.moduleName || 'Demo';
    this.pageName = options.pageName || 'Demo';
    this.modelName = options.modelName || 'Demo';
  }

  run(src = this.src, dest = this.dest) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest);
    }
    const dirs = readdirSync(src, {withFileTypes: true});
    dirs.forEach((dirent: fs.Dirent) => {
      const curPath = path.join(src, dirent.name);
      const curDestPath = path.join(dest, dirent.name);
      if (dirent.isDirectory()) {
        this.run(curPath, curDestPath);
      } else if(dirent.isFile()) {
        // 创建读取流
        const readable = createReadStream(curPath);
        const writable = createWriteStream(curDestPath); 
        readable.setEncoding('utf-8');
        readable.on('data', (chunk) => {
          const ck = chunk
            .replace(/{moduleName}/ig, this.moduleName)
            .replace(/{pageName}/ig, this.pageName)
            .replace(/{modelName}/ig, this.modelName);
          writable.write(ck);
        })
        
        // 通过管道来传输流
        // readable.pipe(writable);
      }
    })
  }
}

module.exports = GenerateFiles;