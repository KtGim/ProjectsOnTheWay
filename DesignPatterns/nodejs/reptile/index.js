/*
 * @Author: 荆轲
 * @Date: 2020-04-19 20:18:14
 * @LastEditTime: 2020-04-19 20:47:44
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \practice\reptile\index.js
 */
const path = require('path')
const request = require('request')
const domFetch = require('./getDom')
const config = require('./config')
const fs = require('fs')

function start() {
    request(config.url, (err, res, body) => {
        if (!err && res) {
            console.log('start');
            domFetch.findImg(body, downloadImgs);
        }
    })
}

function downloadImgs(imgUrl, i) {
    if (i > 1) {
        return
    }
    let ext = imgUrl.split('.').pop();
    request(imgUrl).pipe(fs.createWriteStream(path.join(config.imgdir, i + '.' + ext), {
        encoding: 'utf8'
    }))
    console.log(i);
}

start();

