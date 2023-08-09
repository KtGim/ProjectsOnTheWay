
# 设计模式学习笔记

    - 对象内部 下划线属性 是一种约定，表示对象内部的私有属性，但是仍然可以直接使用

## es5 类以及类的静态方法，私有属性和共享属性

    ```
        // 通过闭包实现私有属性的创建

        var Person = (function() {
            // 私有属性, 只能在类的内部使用
            age = 100;
            getAge = function() {
                return age
            }
            var ctor = function(name) {
                this.name = name;
                this.getAge = function() {
                    // 实例方法调用类的私有方法，返回私有属性
                    return getAge();
                }
            }
            return ctor;
        })()
        // 添加 Person 的 静态方法
        Person.staticName = function() {
            // 无法调用 Person 的私有变量
            return 'static name'
        }

        // 添加 Person 实例的 共享方法
        Person.prototype.publicName = function() {
            // 无法调用 Person 的私有变量
            return 'public name'
        }
    ```

## 封装的优缺点

    - 保证了数据的完整性，不必关注实现细节，只能使用内部提供的方法。有利于项目重构。
    - 弱化了模块之间的耦合（只能使用内部提供的方法）
    - 私有方法的测试难度增加（通过提供相应的公用方法覆盖私有方法的能力范围间接达到测试的目的）
    - 私有方法的调试难度增加 （闭包的大量使用导致作用域链增长且检测变得复杂）
    - 过度封装会降低累的灵活性，类的可适用范围的扩展很难被发掘
    - 难度较大，js需要使用特定的手段完成封装功能，调用链、定义后立即执行的匿名函数概念导致学习难度加大
