import { BrowserRouter as Router, Link, Routes, Route } from 'react-router-dom';
import Navigation from './Components/Navigation';
import { NotFound } from './Components/Misc';
import ProductPortfolio from './Views/ProductPortfolio';
import ProductPortfolioMerchant from './Views/ProductPortfolioMerchant';
import Home from './Views/Home';
import SpaceGame from './Views/SpaceGame';
import Profile from './Views/Profile';
import Contact from './Views/Contact';
import Store from './Views/Store';
import DevView01 from './Views/DevView01';
import DevView02 from './Views/DevView02';

function App() {
  return (
    <div className="App h-full">
      <Navigation />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/home' element={<Home />} />

        <Route path='/merchant-product-portfolio' element={<ProductPortfolioMerchant />}>
          <Route path='public-test-mode' element={<ProductPortfolioMerchant />} />
        </Route>

        <Route path='/store' element={<Store />} />

        <Route path='/demos'>
          <Route path='product-portfolio' element={<ProductPortfolio />} />
          <Route path='space-game' element={<SpaceGame />} />
        </Route>

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

      <script id="Cookiebot" src="https://consent.cookiebot.com/uc.js" data-cbid="619d0c4c-aa0f-4c9d-8133-55cd158f6c73" data-blockingmode="auto" type="text/javascript"></script>
    </div>
  );
}

export default App;
