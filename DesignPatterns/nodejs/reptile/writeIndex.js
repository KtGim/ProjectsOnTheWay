/*
 * @Author: your name
 * @Date: 2020-04-19 22:51:44
 * @LastEditTime: 2020-04-19 23:17:11
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \practice\reptile\writeIndex.js
 */
const fs = require('fs')
const path = '../package.json'

fs.stat(path, (err, stats) => {
    if (err) return
    // console.log(stats);
    // fs.open(path, 'w', (err, fd) => {
        // if (err) return
        // const buf = new Buffer.alloc(1024);
        fs.readFile(path, (err, data) => {
            // console.log(data, 'ppp')
            if (err) return
            fs.open('./package.json', 'w', (err, fd) => {
                fs.writeFile('./package.json', data, () => {
                    console.log('写入完成')
                })
            })
        })
    // })
})