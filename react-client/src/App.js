import { BrowserRouter as Router, Link, Routes, Route } from 'react-router-dom';
import Navigation from './Components/Navigation';
import { NotFound } from './Components/Misc';
import ProductPortfolio from './Views/ProductPortfolio';
import ProductPortfolioMerchant from './Views/ProductPortfolioMerchant';
import Home from './Views/Home';
import SpaceGame from './Views/SpaceGame';
import Profile from './Views/Profile';
import Contact from './Views/Contact';
import DevView01 from './Views/DevView01';
import DevView02 from './Views/DevView02';

function App() {
  return (
    <div className="App">
      <Navigation />
      <Routes>
        <Route exact path='/' element={<Home />} />
        <Route exact path='/home' element={<Home />} />
        <Route exact path='/demos/product-portfolio' element={<ProductPortfolio />} />
        <Route exact path='/merchant-product-portfolio' element={<ProductPortfolioMerchant />} />
        <Route exact path='/demos/space-game' element={<SpaceGame />} />
        <Route exact path='/contact' element={<Contact />} />
        <Route exact path='/profile' element={<Profile />} />
        {process.env.NODE_ENV === 'development' &&
          <>
            <Route exact path='/devarea/01' element={<DevView01 />} />
            <Route exact path='/devarea/02' element={<DevView02 />} />
          </>
        }
        <Route path='*' element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
