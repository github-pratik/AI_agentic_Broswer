import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BrowserWindow from './components/BrowserWindow';
import Settings from './components/Settings';
import { BrowserProvider } from './contexts/BrowserContext';
import { AIProvider } from './contexts/AIContext';
import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Error boundary for web environment
  useEffect(() => {
    const handleError = (error) => {
      console.error('App error:', error);
      setError(error);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleError);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleError);
    };
  }, []);

  if (error) {
    return (
      <div className="error-screen">
        <div className="error-content">
          <h1>Something went wrong</h1>
          <p>Error: {error.message || 'Unknown error'}</p>
          <button onClick={() => window.location.reload()}>Reload Page</button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <h1>AI Browser</h1>
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <BrowserProvider>
        <AIProvider>
          <div className="App">
            <Routes>
              <Route path="/" element={<BrowserWindow />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<BrowserWindow />} />
            </Routes>
          </div>
        </AIProvider>
      </BrowserProvider>
    </Router>
  );
}

export default App; 