interface Foo {
    name: string;
    age: number;
}

type Foo2 = {
    name: string;
    age: number;
}

type Foo3 = {
    name3: string;
    age3: number;
    age: number[];
    name: string[];
}

type Foo4 = {
    name4?: string;
    age4?: number;
}

type F = keyof Foo;
type F2 = keyof Foo2;

type F3 = {
    [key in F]: Foo[key]
}

type F4 = {
    [key in F]: Foo2[key]
}

// 会筛选出相同属性
type F5 = {
    [key in F]: Foo3[key]
}


// Partial 源码
type Partials<T> = { [P in keyof T]?: T[P] };

type P1 = Partials<F4>

// Required 源码, 将可选参数变为必选
type Requireds<T> = { [P in keyof T]-?: T[P] };
type Requireds2<T> = { [P in keyof T]+?: T[P] };

type R1 = Requireds<Foo4>
type R2 = Requireds2<Foo3>


