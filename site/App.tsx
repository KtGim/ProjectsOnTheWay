import React from 'react';

import 'highlight.js/styles/a11y-light.css'
import './app.less';
import 'antd/dist/antd.css';

import Routers from './.routerConfig/index';
import {A} from '../lib/esm/index'

function App(){
  return (
    <div>
      <A />
      <Routers />
    </div>
  );
}
export default App;