function A () {
    let a = 1;
    let b = a + 1;
    return function() {
        a = 5;
        console.log(a + b);
    }
}