import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
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
      // Test a simple IPC call
      window.electronAPI.getAppVersion().then(version => {
        console.log('App version:', version);
      }).catch(error => {
        console.error('Error getting app version:', error);
      });
    } else {
      console.error('electronAPI is not available');
    }
  }, [tabs.length, addTab]);

  // Show/hide browser view based on route
  useEffect(() => {
    if (window.electronAPI) {
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
      if (contentAreaRef.current && window.electronAPI) {
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
        console.error('electronAPI.navigateTo not available');
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
      console.error('electronAPI not available');
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

    // Set up event listeners
    window.electronAPI.onBrowserNavigate(handleNavigation);
    window.electronAPI.onBrowserTitleUpdated(handleTitleUpdate);
    window.electronAPI.onBrowserLoading(handleLoading);

    // Cleanup
    return () => {
      if (window.electronAPI) {
        window.electronAPI.removeAllListeners('browser-navigate');
        window.electronAPI.removeAllListeners('browser-title-updated');
        window.electronAPI.removeAllListeners('browser-loading');
      }
    };
  }, [activeTab, updateTab]);

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
        <Routes>
          <Route path="/" element={
            <div 
              className="content-area" 
              ref={contentAreaRef}
            >
              {/* The actual web content is now handled by Electron's BrowserView */}
              {/* This div just reserves the space for the BrowserView */}
            </div>
          } />
          <Route path="/settings" element={<Settings />} />
        </Routes>
        
        {isSidebarOpen && isMainRoute && <AISidebar />}
      </div>
    </div>
  );
};

export default BrowserWindow; 