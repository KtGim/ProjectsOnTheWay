import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

export interface AppProps {
    name: String
};

const appProp: AppProps = {
    name: 'Qian JJ'
}
ReactDOM.render(<App {...appProp} />, document.querySelector('#root'));