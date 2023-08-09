function compose(...fns) { //fns是传入的函数
  const fn = fns.pop();
  return (...args) => {
    fn(args);
    if(fns.length > 0) {
      compose(...fns);
    }
  }
}