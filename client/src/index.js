import React from 'react';
import ReactDOM from 'react-dom/client';  // React 18 and above
import './index.css';  // Import your styles
import App from './App';

// Create the root element where React will render the app
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the app inside the root element
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
