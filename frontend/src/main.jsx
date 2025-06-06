import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css'; // Importez les styles Tailwind
import { BrowserRouter as Router } from 'react-router-dom'; // Importez BrowserRouter
import { AuthProvider } from './context/AuthContext.jsx'; // Importer le AuthProvider

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router> {/* Enveloppez toute l'application avec Router */}
      <AuthProvider> {/* Enveloppez toute l'application avec AuthProvider */}
        <App />
      </AuthProvider>
    </Router>
  </React.StrictMode>,
);