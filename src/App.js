import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import BrowserWindow from './components/BrowserWindow';
import { BrowserProvider } from './contexts/BrowserContext';
import { AIProvider } from './contexts/AIContext';
import './utils/webAdapter'; // Initialize web adapter for non-Electron environments
import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

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
            <BrowserWindow />
          </div>
        </AIProvider>
      </BrowserProvider>
    </Router>
  );
}

export default App; 