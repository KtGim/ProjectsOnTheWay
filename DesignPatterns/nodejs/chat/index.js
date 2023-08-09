/*
 * @Author: your name
 * @Date: 2020-04-25 20:39:40
 * @LastEditTime: 2020-04-25 23:35:40
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \practice\chat\index.js
 */
const http = require('http');
const path = require('path');
const mime = require('mime');
const fs = require('fs');
const chatServe = require('./lib/chat_server');

const cache = {}; // 缓存文件内容对象

// 返回404
function send404(res) {
    res.writeHead(404, {'content-Type': 'text/html'})
    res.write('404 Error NOTFOUND!')
    res.end()
};

// 返回文件内容
function sendFile(res, filePath, fileCotents) {
    res.writeHead(200, {'content-Type': mime.getType(path.basename(filePath))})
    res.end(fileCotents);
};

// 从内存读取文件内容并返回
function getFileFromRAM(res, cache, absPath) {
    if(cache[absPath]) { // 如果内存中有该文件则返回
        sendFile(res, absPath, cache[absPath])
    } else {
        fs.exists(absPath, function(exists) {
            if(exists) {
                fs.readFile(absPath, function(err, buffer) {
                    if(!err) {
                        cache[absPath] = buffer;
                        sendFile(res, absPath, buffer)
                    } else {
                        send404(res)
                    }
                })
            } else {
                send404(res)
            }
        })
    }
};

const server = http.createServer(function(req, res) {
    let filePath = false;
    if (req.url == '/') {
        filePath = 'public/index.html'
    } else {
        filePath = `public${req.url}`
    }
    const absPath = `./${filePath}`
    getFileFromRAM(res, cache, absPath);
});


server.listen(3000, function() {
    console.log('server is running on 3000')
});

chatServe.listen(8888);