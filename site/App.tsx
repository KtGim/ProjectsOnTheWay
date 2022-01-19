import React from 'react';
import './app.less';

import { AppProps } from './index';

// import Amd from './a.md';

function App(props: AppProps){
  return (
    <div className="app">
      Hello World From React-Rollup {props.name} <br/>
      {/* <Amd /> */}
    </div>
  );
}
export default App;