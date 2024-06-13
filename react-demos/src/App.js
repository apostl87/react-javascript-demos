import './static/css/App.css';
import { BrowserRouter as Router, Link, Routes, Route } from 'react-router-dom';
import NavigationBar from './Components/NavigationBar';
import Navigation from './Components/Navigation';
import ProductPortfolio from './Views/ProductPortfolio';
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
            <Route exact path='/productportfolio' element={<ProductPortfolio />} />
            <Route exact path='/spacegame' element={<SpaceGame />} />
            <Route exact path='/' element={null} />
          </Routes>
        </div>
      </Router >
    </div>
  );
}

export default App;
