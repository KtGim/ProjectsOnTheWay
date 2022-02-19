import React from 'react';
import 'highlight.js/styles/a11y-light.css'
import './app.less';

import Amd from '../components/a.md';
import BDemo from 'components/BDemo';

function App(){
  return (
    <div className="app">
      <Amd />
      <BDemo />
    </div>
  );
}
export default App;