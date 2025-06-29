// 实现一个 race
Promise._race = (iterator) => new Promise((resolve, rej) => {
  try {
    const it = iterator[Symbol.iterator]();
    while(true) {
      let res = it.next();
      if(res.done) {
        break
      }
      if(res.value instanceof Promise) {
        res.value.then(resolve, rej)
      } else {
        resolve(res.value)
      }
    }

  } catch(error) {
    rej(error);
  }
})

// 实现一个 all
function myPromiseAll(promises) {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(promises)) {
      return reject(new TypeError('Argument must be an array'));
    }
    const results = [];
    let completed = 0;
    if (promises.length === 0) {
      return resolve([]);
    }
    promises.forEach((p, i) => {
      Promise.resolve(p).then(
        value => {
          results[i] = value;
          completed++;
          if (completed === promises.length) {
            resolve(results);
          }
        },
        err => reject(err)
      );
    });
  });
}

//实现一个 Promise.finally 
Promise.prototype.finally = function(cb) {
  const P = this.constructor;
  return this.then((value) => {
    P.resolve(cb?.()).then(value)
  }, (rej) => {
    // throw rej 的原因是因为原本的 reject 不应该被吞掉，需要使用 throw 让流程catch 住
    P.resolve(cb?.()).then(rej => throw rej)
  })
}