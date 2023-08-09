# Generator: 生成器函数及 async/await 用法 [co 库，实现异步函数调用调用](https://github.com/tj/co/blob/master/index.js)
 
- 函数执行后，返回一个迭代器对象（包含next()方法 和 一个返回对象 {done: boolean, value: any）
    - 返回的迭代器对象会有两个方法  throw => 抛出异常; return a; 返回结果 a 并将next() 及结果改为 {value: a, done: true }。throw 方法可以再 generator 函数内部被 try/catch 捕获，并且捕获后 next() 返回 {value: undefined, done: true }。

```javascript
    function* gen() {
        try {
            let a = yield 1;
            let b = yield a + 2;
            yield b + 3;
        } catch (e) {
            console.log(e);
        }
    }
    let itor = gen();  
    itor.throw("error");

    // itor.return("111")  111 会被返回
```

- 通过 next（） 方法继续执行后续 yield 操作，不调用，其他 generator 之外的 方法不会被阻塞， generator 函数内部的代码会等待执行
- next(arg) arg 会作为上一步的 yield 返回值，并作为 下一个的 yield 参数进行操作

## 基本格式

```javascript
    // test() 内部 两个 console均只 运行一次
    function *test() {
        var a = yield 1 + 1;
        console.log(a); // 一次next() 后打印
        var b = yield 1 + a;
        console.log(b); // 两次 next 后才会打印
        return b;
    }

    var it = test();
    it.next(1);         // { value: 2, done: false }
    console.log('aaa'); // 直接打印
    it.next(3);         // { value: 4, done: false }
    it.next(10);        // { value: undefined, done: true }
```

## 说明

- next(1) 后，代码停留在 var a 处。                     （此时 next 参数 没有接受的属性，所以传参没有意义）
- next(2), a 被赋值为 3， 直接打印, 停留在 var b 处      （此时 next 参数 会作为 yield 的返回值）
- next(10), b = 10, it.next().done === true 迭代结束
    - generator 函数每次执行结果的 value 是 yield 表达式 的结果， 与 yield 左侧标识符无关
    - next(arg) arg 会被直接赋值 给 yield 表达式中的变量
    - next() 会导致 变量赋值为 undefined

## 自执行

```javascript
    function testGenerator(test) {
        const it = test();
        // 立即执行函数
        (
            function doGen(value) {
                var ret = it.next(value)
                while(!ret.done) {
                    if (typeof ret === 'object' && 'then' in ret) {
                        ret.value.then(it)
                    } else {
                        it(ret.value);
                    }
                }
            }
        )()
    }
```

## async/await

- 一个async异步函数可以包含0个或者多个await指令，当代码运行到await表达式的时候，该进程会进入等待模式并转让控制权，直到被等待的，异步的承诺(promise)被满足(resolved)或者拒绝(rejected)为止。如果承诺被满足则以返回值的形式传递到等待中的await表达式中。使用async / await 关键字使得尝试/捕获(try/catch) 在异步函数中也可以正常使用
- async函数总是返回一个promise对象。就算一个异步函数的返回值表面上不是一个承诺(promise)， 只要它在async 函数中，它的本质也会是一个承诺(promise)
- await关键字只在异步函数内有效。如果你在async异步函数外使用它，会抛出语法错误 SyntaxError
- async函数的函数体可以被认为是由0个或者多个await表达式分割开来。第一行代码到第一个await表达式之间的代码是同步运行的。在这种情况下（函数体中没有await表达式），async函数会同步运行。如果在方法体内由await表达式，然而，async方法将会异步执行。
- 在await表达式之后的代码可以被认为是存在在链式调用的then回调方法中。

```javascript
    async function foo() { await 1}
    // 等价于
    function foo() {
        return Promise.resolve(1).then(() => undefined);
    }
```

## async/await 返回值

```javascript
    async function getProcessedData(url) {
    let v;
    try {
        v = await downloadData(url); 
    } catch (e) {
        v = await downloadFallbackData(url);
    }
        return processDataInWorker(v);
    }
```

- return processDataInWorker(v), 将被影式的传给 Promise.resolve() 方法中, 如果出错，返回的也是一个 Promise
- return await processDataInWorker(v), 将会将 processDataInWorker 的执行结果返回到 async 中
