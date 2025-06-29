
const deepClone = (target, cache = new WeakMap()) => {
  if(typeof target !== 'object' || cache.has(target)) {
    return cache.get(target);
  }
  if(Array.isArray(target)) {
    return target.map(t => {
      const newT = deepClone(t, cache);
      cache.add(t, newT);
      return newT
    })
  }
  return [...Object.keys(target), ...Object.getOwnPropertySymbols(target)]
    .reduce((res, key) => {
      res[key] = deepClone(target[key], cache)
      cache.set(target[key], res[key]);
      return res;
    }, target.constructor !== Object ?
      Object.create(target.constructor.prototype) : {}
    )
}