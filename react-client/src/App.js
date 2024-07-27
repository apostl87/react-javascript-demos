import { Routes, Route } from 'react-router-dom';
import Navigation from './Components/Navigation';
import { NotFound } from './Components/Misc';
import Footer from './Components/Footer';
import MyScrollToTop from './Components/MyScrollToTop';
import Banner from './Components/Banner';
import ProductPortfolioMerchant from './Views/ProductPortfolioMerchant';
import Home from './Views/Home';
import SpaceGame from './Views/SpaceGame';
import Profile from './Views/Profile';
import Contact from './Views/Contact';
import Store from './Views/Store';
import PrivacyPolicy from './Views/PrivacyPolicy';
import Calculator from './Views/Calculator';
import DevView01 from './Views/DevView01';
import DevView02 from './Views/DevView02';

function App() {
  return (
    <div className="App flex flex-col justify-start">
      <Banner />
      <Navigation />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/home' element={<Home />} />

        <Route path='/product-portfolio-admin-panel' element={<ProductPortfolioMerchant />}>
          <Route path='public-test-mode' element={<ProductPortfolioMerchant />} />
        </Route>

        <Route path='/store' element={<Store />} />

        <Route path='/demos'>
          <Route path='space-game' element={<SpaceGame />} />
          <Route path='calculator' element={<Calculator />} />
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

      <Footer />

      <MyScrollToTop />
    </div>
  );
}

export default App;
