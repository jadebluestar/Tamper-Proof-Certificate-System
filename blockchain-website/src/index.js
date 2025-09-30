import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css';   // not index.css, since your project only has App.css


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);