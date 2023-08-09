/*
 * @Author: your name
 * @Date: 2020-04-19 20:24:03
 * @LastEditTime: 2020-04-19 20:31:38
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \practice\reptile\getDom.js
 */
const cheerio = require('cheerio')

const findImg = (dom, cb) => {
    let $ = cheerio.load(dom)
    $('img').each(function(i, ele) {
        let imgSrc = $(this).attr('src')
        cb(imgSrc, i)
    })
}

module.exports = {
    findImg
}