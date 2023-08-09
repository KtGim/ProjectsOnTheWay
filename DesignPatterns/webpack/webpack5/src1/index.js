import _ from 'lodash';
// import * as styles from './style.css';
// import {print} from './print';

function component() {
    // console.log(styles, 'styles');
    const element = document.createElement('div');
    const btn = document.createElement('button');
    
    element.innerHTML = 'Hello Word!!';
    element.classList.add('foo__style__hello');

    btn.innerHTML = 'Click me and check the console!';
    element.appendChild(btn);

    btn.onclick = e => import(/* webpackChunkName: "print" */ './print').then(module => {
        const print = module.default;

        print();
    });

    return element;
}

document.body.appendChild(component());

// if (module.hot) {
//     module.hot.accept('./print.js', function() {
//         console.log('Accepting the updated printMe module!');
//         print();
//     })
// }

