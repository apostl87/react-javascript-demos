import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router} from'react-router-dom';
import DatabaseCRUD from './Components/DatabaseCRUD';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
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
      <div>
        <h3>Database CRUD</h3>
        <DatabaseCRUD />
      </div>
    </div>
  );
}

export default App;
