/*
 * @Author: your name
 * @Date: 2020-04-19 20:20:22
 * @LastEditTime: 2020-04-19 20:45:10
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \practice\reptile\config.js
 */
/**
 * @description: 配置文件
 * @param {type} 
 * @return: 
 */

const url = 'http://photo.sina.com.cn/'
const path = require('path')
const imgdir = path.resolve(__dirname, 'img');

module.exports = {
    url,
    imgdir,
}
