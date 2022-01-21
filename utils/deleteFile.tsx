import fs from 'fs';

type DelFileTyp = { init: (url: string) => void, del: (url: string) => void};
const delFile: DelFileTyp = (() => {
    return {
        init: function (url) {
            this.del(url);
        },
        del: function (url) {
            var files = [];
            files = fs.readdirSync(url);
            for (var i = 0; i < files.length; i++) {
                var path = url + '/' + files[i];
                if (fs.statSync(path).isFile()) {
                    fs.unlinkSync(path);
                } else {
                    this.del(path);
                }
            }
            fs.rmdirSync(url);
        }
    };
})();

export default delFile;