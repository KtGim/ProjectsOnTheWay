# 筛选不同类型中 的 相同属性，获取目标类型中的 属性的类型

    ```typescript
        interface Foo {
            name: string;
            age: number;
        }
        interface Foo2 {
            name: string[];
            age: number[];
            name1: string;
            ag1e: number;
        }
        type keys = keyof Foo;
        type Foo3 = {
            [key in keys]: Foo2[key]
        } // Foo3 = {name: string[], age: number[]}
    ```
