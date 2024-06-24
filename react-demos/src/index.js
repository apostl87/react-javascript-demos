import React from 'react';
import ReactDOM from 'react-dom/client';
import './static/css/output.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { NextUIProvider } from "@nextui-org/react";
import { Auth0Provider } from '@auth0/auth0-react';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Auth0Provider
    domain="dev-do7e3my01rhnrak7.eu.auth0.com"
    clientId="o2AsMGQI8tqlJoEb1HOVaMNR6oZqGYXJ"
    authorizationParams={{
      redirect_uri: window.location.origin
    }}
  >
    <NextUIProvider>
      <App />
    </NextUIProvider>
  </Auth0Provider>
);

reportWebVitals();
