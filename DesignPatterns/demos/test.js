// const fs = require('fs');

// function someAsyncOperation(callback) {
//   // Assume this takes 95ms to complete
//   console.log('999');
//   fs.readFile('./pbDemos.js', callback);
// }

// const timeoutScheduled = Date.now();
// // do someAsyncOperation which takes 95 ms to complete
// someAsyncOperation(() => {
//     console.log('000');
//     setTimeout(() => {
//         console.log(`setTimeout aaa`);
//     }, 0);
//     setImmediate(() => {
//         console.log('setImmediate bbb')
//     })
// });

// setImmediate(() => {
//     console.log('setImmediate')
// })

// setTimeout(() => {
//   const delay = Date.now() - timeoutScheduled;

//   console.log(`${delay}ms have passed since I was scheduled`);
// }, 0);

// Promise.resolve().then(() => {
//     console.log('promise.then')
// })

// process.nextTick(() => {
//     console.log('ticket')
// })

// new Promise((res) => {
//     console.log('promise constructor');
//     res();
// })

// let bar;

// // this has an asynchronous signature, but calls callback synchronously
// function someAsyncApiCall(callback) {
//     process.nextTick(callback);
//     // callback();
// }

// // the callback is called before `someAsyncApiCall` completes.
// someAsyncApiCall(() => {
//   // since someAsyncApiCall hasn't completed, bar hasn't been assigned any value
//   console.log('bar', bar); // undefined
// });

// bar = 1;

const EventEmitter = require('events');
const util = require('util');

function MyEmitter() {
  EventEmitter.call(this);
//   this.emit('event');
  process.nextTick(() => {
    this.emit('event');
  });
}
util.inherits(MyEmitter, EventEmitter);

const myEmitter = new MyEmitter();
myEmitter.on('event', () => {
  console.log('an event occurred!');
});
