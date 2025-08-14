import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import TabBar from './TabBar';
import NavigationBar from './NavigationBar';
import AISidebar from './AISidebar';
import Settings from './Settings';
import { useBrowser } from '../contexts/BrowserContext';
import { useAI } from '../contexts/AIContext';
import './BrowserWindow.css';

const BrowserWindow = () => {
  const { tabs, activeTab, addTab, closeTab, updateTab, setActiveTab } = useBrowser();
  const { isSidebarOpen, toggleSidebar } = useAI();
  const [isFullscreen] = useState(false);
  const contentAreaRef = useRef(null);
  const location = useLocation();
  
  // Check if we're on the main browser route
  const isMainRoute = location.pathname === '/';

  useEffect(() => {
    // Create initial tab if none exists
    if (tabs.length === 0) {
      addTab('https://www.google.com', 'New Tab');
    }
    
    // Test if electronAPI is available
    if (window.electronAPI) {
      console.log('electronAPI is available');
      // Test a simple IPC call if the method exists
      if (window.electronAPI.getAppVersion) {
        window.electronAPI.getAppVersion().then(version => {
          console.log('App version:', version);
        }).catch(error => {
          console.error('Error getting app version:', error);
        });
      } else {
        console.log('getAppVersion method not available');
      }
    } else {
      console.log('Running in web environment - using web adapter');
    }
  }, [tabs.length, addTab]);

  // Show/hide browser view based on route
  useEffect(() => {
    if (window.electronAPI && window.electronAPI.showBrowserView && window.electronAPI.hideBrowserView) {
      if (isMainRoute) {
        window.electronAPI.showBrowserView();
      } else {
        window.electronAPI.hideBrowserView();
      }
    }
  }, [isMainRoute]);

  // Update browser view bounds when layout changes
  useEffect(() => {
    if (!isMainRoute) return; // Only update bounds on main route
    
    const updateBounds = () => {
      if (contentAreaRef.current && window.electronAPI && window.electronAPI.updateBrowserViewBounds) {
        const rect = contentAreaRef.current.getBoundingClientRect();
        window.electronAPI.updateBrowserViewBounds({
          x: Math.round(rect.left),
          y: Math.round(rect.top),
          width: Math.round(rect.width),
          height: Math.round(rect.height)
        });
      }
    };

    // Update bounds after a short delay to ensure layout is complete
    const timeoutId = setTimeout(updateBounds, 100);
    
    // Update bounds on window resize
    window.addEventListener('resize', updateBounds);
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', updateBounds);
    };
  }, [isSidebarOpen, isMainRoute]); // Re-run when sidebar opens/closes or route changes

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const handleTabClose = (tabId) => {
    closeTab(tabId);
  };

  const handleNewTab = () => {
    addTab('https://www.google.com', 'New Tab');
  };

  const handleUrlChange = async (url) => {
    if (activeTab) {
      updateTab(activeTab, { url });
      // Navigate the browser view to the new URL
      if (window.electronAPI && window.electronAPI.navigateTo) {
        try {
          await window.electronAPI.navigateTo(url);
        } catch (error) {
          console.error('Error navigating to URL:', error);
        }
      } else {
        console.log('Using web navigation - opening in new tab');
        window.open(url, '_blank');
      }
    }
  };

  const handleTitleChange = (title) => {
    if (activeTab) {
      updateTab(activeTab, { title });
    }
  };

  const currentTab = tabs.find(tab => tab.id === activeTab);

  // Handle browser view events
  useEffect(() => {
    if (!window.electronAPI) {
      console.log('electronAPI not available - running in web mode');
      return;
    }
    
    console.log('Available electronAPI methods:', Object.keys(window.electronAPI));

    const handleNavigation = (event, url) => {
      if (activeTab) {
        updateTab(activeTab, { url });
      }
    };

    const handleTitleUpdate = (event, title) => {
      if (activeTab) {
        updateTab(activeTab, { title });
      }
    };

    const handleLoading = (event, isLoading) => {
      // Could update loading state here
      console.log('Loading:', isLoading);
    };

    // Set up event listeners if methods exist
    if (window.electronAPI.onBrowserNavigate) {
      window.electronAPI.onBrowserNavigate(handleNavigation);
    }
    if (window.electronAPI.onBrowserTitleUpdated) {
      window.electronAPI.onBrowserTitleUpdated(handleTitleUpdate);
    }
    if (window.electronAPI.onBrowserLoading) {
      window.electronAPI.onBrowserLoading(handleLoading);
    }

    // Cleanup
    return () => {
      if (window.electronAPI && window.electronAPI.removeAllListeners) {
        window.electronAPI.removeAllListeners('browser-navigate');
        window.electronAPI.removeAllListeners('browser-title-updated');
        window.electronAPI.removeAllListeners('browser-loading');
      }
    };
  }, [activeTab, updateTab]);

  // Render different content based on route
  if (location.pathname === '/settings') {
    return <Settings />;
  }

  return (
    <div className={`browser-window ${isFullscreen ? 'fullscreen' : ''}`}>
      <TabBar
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onTabClose={handleTabClose}
        onNewTab={handleNewTab}
      />
      
      <NavigationBar
        url={currentTab?.url || ''}
        onUrlChange={handleUrlChange}
        onTitleChange={handleTitleChange}
        onToggleSidebar={toggleSidebar}
      />
      
      <div className="browser-content">
        <div 
          className="content-area" 
          ref={contentAreaRef}
        >
          {/* Web environment fallback */}
          {!window.electronAPI && (
            <div className="web-fallback">
              <div className="web-fallback-content">
                <h2>AI Browser</h2>
                <p>Welcome to the web version of AI Browser!</p>
                <p>Current URL: {currentTab?.url || 'No URL'}</p>
                <div className="web-actions">
                  <button 
                    onClick={() => window.open(currentTab?.url || 'https://www.google.com', '_blank')}
                    className="web-action-btn"
                  >
                    Open in New Tab
                  </button>
                  <button 
                    onClick={() => window.open('https://www.google.com', '_blank')}
                    className="web-action-btn"
                  >
                    Open Google
                  </button>
                </div>
                <p className="web-note">
                  Note: Full browser functionality is available in the desktop version.
                </p>
              </div>
            </div>
          )}
        </div>
        
        {isSidebarOpen && isMainRoute && <AISidebar />}
      </div>
    </div>
  );
};

export default BrowserWindow; 