import './static/css/App.css';
import { BrowserRouter as Router, Link, Routes, Route } from 'react-router-dom';
import Navigation from './Components/Navigation';
import NotFound from './Components/NotFound';
import ProductPortfolio from './Views/ProductPortfolio';
import Home from './Views/Home';
import SpaceGame from './Views/SpaceGame';
import Profile from './Views/Profile';

function App() {
  return (
    <div className="App">
        <div className="App-Header">
          <Navigation />
        </div>
        <div>
          <Routes>
            <Route exact path='/productportfolioexample' element={<ProductPortfolio />} />
            <Route exact path='/spacegameexample' element={<SpaceGame />} />
            <Route exact path='/' element={<Home />} />
            <Route exact path='/home' element={<Home />} />
            <Route exact path='/about' element={null} />
            <Route exact path='/contact' element={null} />
            <Route exact path='/profile' element={<Profile />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </div>
    </div>
  );
}

export default App;
