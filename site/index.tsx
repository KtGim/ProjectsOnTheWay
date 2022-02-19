import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { AppProps } from './type';

const appProp: AppProps = {
    name: 'Qian JJ'
}

ReactDOM.render(<App {...appProp} />, document.querySelector('#root'));