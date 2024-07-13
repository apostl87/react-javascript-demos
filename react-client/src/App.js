import { BrowserRouter as Router, Link, Routes, Route } from 'react-router-dom';
import Navigation from './Components/Navigation';
import { NotFound } from './Components/Misc';
import Footer from './Components/Footer';
import MyScrollToTop from './Components/MyScrollToTop';
import ProductPortfolio from './Views/ProductPortfolio';
import ProductPortfolioMerchant from './Views/ProductPortfolioMerchant';
import Home from './Views/Home';
import SpaceGame from './Views/SpaceGame';
import Profile from './Views/Profile';
import Contact from './Views/Contact';
import Store from './Views/Store';
import DevView01 from './Views/DevView01';
import DevView02 from './Views/DevView02';
import PrivacyPolicy from './Views/PrivacyPolicy';

function App() {
  return (
    <div className="App flex flex-col justify-start">
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

        <Route path='/privacy-policy' element={<PrivacyPolicy />} />

        <Route path='*' element={<NotFound />} />
      </Routes>

      {/* <CookieBot domainGroupId={domainGroupId} /> */}

      <Footer />

      <MyScrollToTop />
    </div>
  );
}

export default App;
