module.exports = (fn) => {
    if(typeof fn == 'function') {
        const webpack = require('webpack');
        return fn(webpack) || {};
    } else if(typeof fn == 'object') {
        return fn;
    }
};