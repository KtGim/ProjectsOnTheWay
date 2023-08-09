const Sg = function(name)  {
    this._name = name;
}

Sg.prototype = {
    set name(name) {
        console.log(name, 'setter');
        this._name = name;
    },
    get name() {
        console.log('getter')
        return this._name
    }
}

const aa = new Sg('222');

aa.name = '111';

console.log(aa.name);

