import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { HelmetProvider } from 'react-helmet-async'; // ✅ IMPORT THIS

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider> {/* ✅ WRAP START */}
      <App />
    </HelmetProvider> {/* ✅ WRAP END */}
  </React.StrictMode>,
);