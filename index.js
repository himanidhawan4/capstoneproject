import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './app.js';
import ErrorBoundary from './ErrorBoundary.js'; // Import the safety net

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ErrorBoundary> 
      <Router>
        <App />
      </Router>
    </ErrorBoundary>
  </React.StrictMode>
);
