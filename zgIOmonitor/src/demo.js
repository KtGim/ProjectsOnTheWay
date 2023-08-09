
const template = `
import logo from './logo.svg';
import './App.css';

function App() {
    const name = 'name';
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" zgmonitor="aaa bbb ccc" />\n`
          + "<p zgmonitor={`type ${name}`}>" +
          `Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
  
  export default App;
`

const func = require('./index');

const result = func(template);
console.log(result)