import './static/css/App.css';
import { BrowserRouter as Router, Link, Routes, Route } from 'react-router-dom';
import Navigation from './Components/Navigation';
import ProductPortfolio from './Views/ProductPortfolio';
import Home from './Views/Home';
import SpaceGame from './Views/SpaceGame';

function App() {
  return (
    <div className="App">
      <Router>
        <div className="App-Header">
          <Navigation />
        </div>
        <div>
          <Routes>
            <Route exact path='/productportfolioexample' element={<ProductPortfolio />} />
            <Route exact path='/spacegameexample' element={<SpaceGame />} />
            <Route exact path='/' element={<Home />} />
            <Route exact path='/about' element={null} />
            <Route exact path='/contact' element={null} />
          </Routes>
        </div>
      </Router >
    </div>
  );
}

export default App;
