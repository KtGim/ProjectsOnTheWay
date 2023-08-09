# 实现

```javascript
    // curry 化
    function thunk(fn) {
        return function(...args) {
            return function(callback) {
                return fn.apply(this, ...args, callback);
            }
        }
    }

    function run(fn) {
        // 判断是否是函数
        let gen = fn();
        function next(err, data) {
            let ret = gen.next(data);
            if (ret.done) return
            ret.value(next);
        }
        next();
    }

    const request = require("request");
    const requestThunk = thunk(request);

    function* requestGen() {
    const url = 'https://www.baidu.com';
    
    /**
     * 返回值就是 thunk 函数最后返回的
     * generator 的 next 返回对象为
     * {
     *  value: function(callback) {
     *      return fn.apply(this, ...args, callback);
     *  },
     *  done: false;
     * }
    */
    let r1 = yield requestThunk(url);
    console.log(r1.body);
    
    let r2 = yield requestThunk(url);
    console.log(r2.body);
    
    let r3 = yield requestThunk(url);
    console.log(r3.body);
```
