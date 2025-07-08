function myBind(context, ...args) {
  const self = this;
  if(new.target) {
    return new self(...args, ...arguments);
  }
  return function(...args2) {
    return self.apply(context, args.concat(args2));
  }
}