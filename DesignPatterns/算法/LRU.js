class LRU {
  constructor(size) {
    this.size = size;
    this.cache = new Map();
  }

  get(key) {
    let val = -1;
    if(this.cache.has(key)) {
      val = this.cache.get(key);
      // 位置更新到最前面
      this.cache.delete(key);
      this.cache.set(key, val);
    }
    return val;
  }

  set(key, val) {
    if(this.cache.has(key)) {
      this.cache.delete(key);
    }
    this.cache.set(key, val);
    if(this.cache.size > this.size){
      // this.cache.keys().next().value用于获取最前面（即使用次数最少的key）,然后删除
      this.cache.delete(this.cache.keys().next().value);
  }
  }
}