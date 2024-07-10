import "./static/css/output.css";
import "./static/css/allstyles.css"; // during development
import "rsuite/dist/rsuite.css";
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Link, Routes, Route } from 'react-router-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { NextUIProvider } from "@nextui-org/react";
import Auth0ProviderWithHistory from './Components/auth0-provider-with-history';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <Auth0ProviderWithHistory>
      <NextUIProvider>
        <App />
      </NextUIProvider>
    </Auth0ProviderWithHistory>
  </Router>
);

reportWebVitals();
