var Person = (function() {
    // 私有属性, 只能在类的内部使用
    age = 100;
    getAge = function() {
        return age
    }
    // 通过闭包，将实际的构造函数返回
    var ctor = function(name) {
        this.name = name;
        this.getAge = function() {
            // 静态方法调用类的私有方法，返回私有属性
            return getAge();
        }
    }
    return ctor;
})()

Person.staticName = function() {
    return 'static name'
}

var p = new Person('kk');
console.log(p.getAge());
console.log(p.name);
console.log(Person.staticName());