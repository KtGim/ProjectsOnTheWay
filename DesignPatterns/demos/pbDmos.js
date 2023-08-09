function Publisher() {
    this.subscribers = [];
}

Publisher.prototype.deliver = function(data) {
    // 发布的时候触发每一个订阅者的方法
    this.subscribers.forEach(fn => {
        fn(data);
    })
    return this;
}

/**
 * 查看发布者是否存在
 * @param {发布者} publisher 
 */
Function.prototype.subscribe = function(publisher) {
    var that = this;
    var alreadyExists = publisher.subscribers.forEach(sb => {
        return that === sb;
    });
    if (!alreadyExists) {
        publisher.subscribers.push(that);
    }
    return this;
}

Function.prototype.unsubscribe = function(publisher) {
    var that = this;
    publisher.subscribers = publisher.subscribers.filter(pb => pb !== that);
    return this;
}

// // 监听到一次事件后立即退订
// var publisherObj = new Publisher();

// var observerObj = function(data) {
//     console.log(data);
//     arguments.callee.unsubscribe(publisherObj);
// }


// // subscribe 挂载在 Function 上，所以函数都可以订阅这个方法
// observerObj.subscribe(publisherObj);

const p1 = new Publisher();
const observer = function() {
    console.log('ob1');
}
const observer2 = function() {
    console.log('ob2');
}
observer.subscribe(p1);
observer2.subscribe(p1);

p1.deliver();