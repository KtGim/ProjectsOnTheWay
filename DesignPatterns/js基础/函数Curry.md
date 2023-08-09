# curry
```js
  const compose3 = (...funcs) => {
    const len = funcs.length;
    if(len == 0) return (args) => args
    if(len == 1) return funcs[0]
    return funcs.reduce((pre, next) => {
      return (...args) => { pre(next(...args)); }
    })
  }
```

```js
  function curry(fn) {
    const ctx = this;
    const inner = (...args) =>  {
      if(fn.length === args.length) {
        return fn.apply(ctx, args);
      }
      return (...innerArgs) => inner.call(ctx, ...args, ...innerArgs)
    }
    return inner;
  }
```
