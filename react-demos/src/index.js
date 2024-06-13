import React from 'react';
import ReactDOM from 'react-dom/client';
import './static/css/output.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {NextUIProvider} from "@nextui-org/react";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <NextUIProvider>
    <App />
  </NextUIProvider>
  // </React.StrictMode>
);

reportWebVitals();
