import './static/css/App.css';
import { BrowserRouter as Router, Link, Routes, Route } from 'react-router-dom';
import ProductPortfolio from './Views/ProductPortfolio';
import NavigationBar from './Components/NavigationBar';

function App() {
  return (
    <div className="App">
      <Router>
        <div className="App-Header">
          <NavigationBar />
        </div>
        <div>
          <Routes>
            <Route exact path='/productportfolio' element={<ProductPortfolio />} />
            <Route exact path='/' element={null} />
          </Routes>
        </div>

      </Router >
    </div>
  );
}

export default App;
