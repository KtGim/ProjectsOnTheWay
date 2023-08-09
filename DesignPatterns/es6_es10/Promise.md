# Promise手写

```javascript
const PENDING = 'PENDING';
const FULFILLED = 'FULFILLED';
const REJECTED = 'REJECTED';

function promiseResolve(promiseTemp, x, resolve, reject) {
  if (promiseTemp === x) {
    throw new Error('避免循环引用')
  }
  if (x instanceof MyPromise) {
    if (x.state === PENDING) {
      x.then(y => {
        promiseResolve(promiseTemp, y, resolve, reject)
      }, reject)
    } else {
      x.state === FULFILLED && resolve(x.value)
      x.state === REJECTED && reject(x.value)
    }
  }
  if ((typeof x === 'object' || typeof x === 'function') && x !== null) {
    if (typeof x.then === 'function') {
      x.then(y => {
        promiseResolve(promiseTemp, y, resolve, reject)
      }, reject)
    } else {
      resolve(x)
    }
  } else {
    resolve(x)
  }
}

class MyPromise {
  static all(promiseArray) {
    let times = 0;
    const promiseArrayResult = [];

    formatPromiseResults = (i, res) => {
      promiseArrayResult[i] = res;
      times ++;
      if (times === promiseArray.length) {
        resolve(promiseArrayResult)
      }
    }
    for (let i = 0; i < promiseArray.length; i++) {
      promiseArray[i].then(data => {
        formatPromiseResults(i, data)
      }, err => {
        reject(err)
      })
    }
  }
  constructor(fn) {
    this.resolvedCallbacks = [];
    this.rejectedCallbacks = [];
    this.value = undefined;
    this.state = PENDING;
    const resolve = val => {
      if ((typeof val === 'object' || typeof val === 'function') && val.then) {
        promiseResolve(this, val, resolve, reject);
        return
      }
      setTimeout(() => {
        if (this.state === PENDING) {
          this.state = FULFILLED;
          this.value = val;
          this.resolvedCallbacks.map(fn => fn())
        }
      })
    }
    const reject = (val) => {
      if ((typeof val === 'object' || typeof val === 'function') && val.then) {
        promiseResolve(this, val, resolve, reject);
        return
      }
      setTimeout(() => {
        if (this.state === PENDING) {
          this.state = REJECTED;
          this.value = val;
          this.rejectedCallbacks.map(fn => fn())
        }
      })
    }
    fn(resolve, reject);
  }

  then(onFullFilled = val => val, onRejected = err => {
    err: throw new Error('reject error')
  }) {
    let promiseTemp = null;
    if (this.state === PENDING) {
      promiseTemp = new MyPromise((res, rej) => {
        this.resolvedCallbacks.push(() => {
          const x = onFullFilled(this.value);
          promiseResolve(promiseTemp, x, res, rej)
        })
        this.rejectedCallbacks.push(() => {
          const x = onRejected(this.value);
          promiseResolve(promiseTemp, x, res, rej)
        })
      })
    }
    if (this.state === FULFILLED) {
      promiseTemp = new MyPromise((res, rej) => {
        this.resolvedCallbacks.push(() => {
          const x = onFullFilled(this.value);
          promiseResolve(promiseTemp, x, res, rej)
        })
      })
    }
    if (this.state === REJECTED) {
      promiseTemp = new MyPromise((res, rej) => {
        this.rejectedCallbacks.push(() => {
          const x = onRejected(this.value);
          promiseResolve(promiseTemp, x, res, rej)
        })
      })
    }
    return promiseTemp
  }

}
```
