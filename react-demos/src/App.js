import './static/css/App.css';
import { BrowserRouter as Router, Link, Routes, Route} from 'react-router-dom';
import DatabaseCRUD from './Views/old_dbcrud';
import ProductPortfolio from './Views/ProductPortfolio';
import NavigationBar from './Components/NavigationBar';

function App() {
  return (
    <Router>
        <NavigationBar />
      <div className="App">

        <div>
          <Routes>
            <Route exact path='/productportfolio' element={<ProductPortfolio />} />
            <Route exact path='/' element={<DatabaseCRUD />} />
          </Routes>
        </div>
      </div>
    </Router >
  );
}

export default App;
