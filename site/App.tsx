import React from 'react';
import 'highlight.js/styles/a11y-light.css'
import './app.less';
import 'antd/dist/antd.css';

import Amd from '../components/business/Demo.md';

function App(){
  return (
    <div className="app">
      <Amd />
    </div>
  );
}
export default App;