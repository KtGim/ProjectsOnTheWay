
# 知识点

## 变量提升

    - 未使用 var 定义的变量，自动被认为是 window 的属性
    - 在作用域内部， var 定义的变量 会被自动提升到作用域的顶部

## 为函数添加方法

    ```javascript
        Function.prototype.method = function(name, fn) {
            this.prototype[name] = fn;
            return this;
        }
        
        Array.method('forEach', function(fn, thisObj) {
            var scope = thisObj || window;
            for(var i = 0; i < this.length; i++>) {
                fn.call(scope, this[i], i, this);
            }
        })
    ```

## [js底层函数实现方法](https://cloud.tencent.com/developer/article/1477588)

## reduce 实现

    ```javascript
        Array.prototype.my_reduce = function(callback, initValue) {
            if (!Array.isArray(this) || !this.length || typeof callback !== 'function') {
                return []
            } else {
                let hasInitValue = initValue !== undefined;
                let value = hasInitValue ? initValue : this[0];
                for (let i = hasInitValue ? 1 : 0; i < this.length; i ++>) {
                    callback(value, this[i], i, this);
                }
                return value;
            }
        }
    ```
## [原型链](https://github.com/creeperyang/blog/issues/9)
    
    - 实例属性的 __proto__ 指向构造函数的 prototype 属性
    - 函数对象才具有 __proto__ 和 prototype 属性
    - 严格意义上讲 prototype 对象 是当前 函数对象的一个实例
    - javascript 通过 __proto__ 来进行属性传递
    - 官方标准属性是 [[Prototype]] 而非标准属性是 __proto__, 两者表述同一种事情

```javascript
    function F() {}
    var f = new F();

    F.__proto__ === Function.prototype // true
    F.prototype.constructor === F // true
    F.prototype.__proto__ === Object.prototype // true

    f.prototype // undefined
    f.__proto__ === F.prototype // true

    typeof Function.prototype  // "function"
    Array.isArray(Array.prototype) // true
    typeof Object.prototype // "object"
```

## Array.isArray (判断为数组的方法)

    ```javascript
        if(!Array.isArray) {
            Array.isArray = function(value) {
                return  Object.prototype.toString().call(value) === '[object Array]'
            }
        }

        if(!Array.isArray) {
            Array.isArray = function(value) {
                return  value._proto_.constructor === Array
            }
        }
    ```

# [校验类型](https://stackoverflow.com/questions/472418/why-is-4-not-an-instance-of-number)

     ```javascript
        Object.prototype.is = function() {
                var test = arguments.length ? [].slice.call(arguments) : null
                ,self = this.constructor;
                return test ? !!(test.filter(function(a){return a === self}).length)
                    : (this.constructor.name ||
                        (String(self).match ( /^function\s*([^\s(]+)/im )
                            || [0,'ANONYMOUS_CONSTRUCTOR']) [1] );
        }
        // usage
        var Newclass = function(){};  // anonymous Constructor function
        var Some = function Some(){}; // named Constructor function
        (5).is();                     //=> Number
        'hello world'.is();           //=> String
        (new Newclass()).is();        //=> ANONYMOUS_CONSTRUCTOR
        (new Some()).is();            //=> Some
        /[a-z]/.is();                 //=> RegExp
        '5'.is(Number);               //=> false
        '5'.is(String);               //=> true

        function typeOf(value) {
            var type = typeof value;

            switch(type) {
                case 'object':
                    return value === null ? 'null' : Object.prototype.toString.call(value).
                        match(/^\[object (.*)\]$/)[1]
                case 'function':
                    return 'Function';

                default:
                    return type;
            }
        }
        
    ```
    - 基础数据类型不包含 [[Prototype]](__proto__) 属性，因此通过
    ```
        value instanceof Constructor 
        // 或者
        Constructor.prototype.isPrototypeOf(value)
    ```
    都不能得到正确结果，除非使用它们的包装类
