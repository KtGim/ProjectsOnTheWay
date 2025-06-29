function curry(fn) {
  const argsLen = fn.length;
  function curried(...args) {
    if (args.length >= argsLen) {
      return fn.apply(this, args);
    } else {
      return function (...nextArgs) {
        return curried.apply(this, args.concat(nextArgs));
      }
    }
  }
  return curried;
}

const add = (...args) => {
  return args.reduce((p,n) => p+ n, 0);
}

const a = curry(add);

console.log(a(1)(2)(3)); // 6
console.log(a(1, 2)(3)); // 6
console.log(a(1, 2, 3)); // 6