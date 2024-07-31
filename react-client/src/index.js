import "./css/output.css";
import "./css/mainstyles.css"; // during development
import "rsuite/dist/rsuite.css";
import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Link, Routes, Route } from 'react-router-dom';
import App from './App';
import ScrollToTop from "./Components/Misc";
import reportWebVitals from './reportWebVitals';
import Auth0ProviderWithHistory from './Components/auth0-provider-with-history';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <Router>
      <ScrollToTop />
      <Auth0ProviderWithHistory>
        <App />
      </Auth0ProviderWithHistory>
    </Router>
  </StrictMode>
);

reportWebVitals();