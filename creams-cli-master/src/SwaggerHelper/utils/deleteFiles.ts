const fs = require('fs');

const deleteModule = (modulePath: string) => {
  if (fs.existsSync(modulePath)) {
    const files = fs.readdirSync(modulePath);
    files.forEach(function (file: File) {
        const curPath = modulePath + "/" + file;
        if (fs.statSync(curPath).isDirectory()) { // recurse
          deleteModule(curPath);
        } else { // delete file
            fs.unlinkSync(curPath,function (err: Error) {
                if (err) throw err;
            });
        }
    });
  }
}

export default deleteModule;