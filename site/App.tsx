import React from 'react';
import 'highlight.js/styles/a11y-light.css'
import './app.less';

import { AppProps } from './type';

import BDemo from 'components/BDemo';

function App(props: AppProps){
  return (
    <div className="app">
      Hello World From React-Rollup {props.name}
      <BDemo />
    </div>
  );
}
export default App;