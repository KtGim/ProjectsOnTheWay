const fs = require('fs');
/**
 * @param path {删除文件的路径}
 */
const removeDir = (path: string) => {
  let files = [];
  if(fs.existsSync(path) ) {
    files = fs.readdirSync(path);
    files.forEach((file: string) => {
      let curPath = path + "/" + file;
      if(fs.statSync(curPath).isDirectory()) {
        removeDir(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
}

export {
  removeDir
}