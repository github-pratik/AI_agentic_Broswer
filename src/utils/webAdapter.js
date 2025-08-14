// Web adapter for Electron APIs
export const webAdapter = {
  // Mock Electron API for web environment
  electronAPI: {
    // App version - return a mock version for web
    getAppVersion: async () => {
      return '1.0.0 (Web Version)';
    },
    
    // External link handling
    openExternal: async (url) => {
      window.open(url, '_blank');
      return { success: true };
    },
    
    // Window management
    createNewWindow: async (url) => {
      window.open(url, '_blank');
      return { success: true };
    },
    
    // Browser navigation methods
    navigateTo: async (url) => {
      // In web environment, show a demo page instead of actual navigation
      console.log('Web Demo: Would navigate to', url);
      
      // Create a demo browser view element
      const demoView = document.getElementById('demo-browser-view');
      if (demoView) {
        demoView.innerHTML = `
          <div style="padding: 20px; background: white; height: 100%; overflow-y: auto;">
            <h2>🌐 Comet Browser Demo</h2>
            <p><strong>URL:</strong> ${url}</p>
            <hr>
            <h3>Welcome to Comet Browser Clone!</h3>
            <p>This is a demo of the Comet browser interface running in web mode.</p>
            <p>In the full Electron version, this would show the actual webpage content.</p>
            <br>
            <h4>Features Demonstrated:</h4>
            <ul>
              <li>✅ Tab Management</li>
              <li>✅ Navigation Bar</li>
              <li>✅ AI Sidebar</li>
              <li>✅ Settings Panel</li>
              <li>✅ Bookmark Management</li>
              <li>✅ History Tracking</li>
              <li>✅ Task Automation</li>
            </ul>
            <br>
            <h4>AI Capabilities:</h4>
            <ul>
              <li>🤖 Natural language navigation</li>
              <li>🤖 Page content analysis</li>
              <li>🤖 Task automation</li>
              <li>🤖 Smart suggestions</li>
            </ul>
            <br>
            <p><em>This is a hackathon project demonstrating a Comet browser clone with AI integration.</em></p>
          </div>
        `;
      }
      
      return { success: true };
    },
    
    goBack: async () => {
      if (window.history.length > 1) {
        window.history.back();
        return { success: true };
      }
      return { success: false, message: 'Cannot go back' };
    },
    
    goForward: async () => {
      window.history.forward();
      return { success: true };
    },
    
    reload: async () => {
      window.location.reload();
      return { success: true };
    },
    
    canGoBack: async () => {
      return window.history.length > 1;
    },
    
    canGoForward: async () => {
      return true; // Simplified for web
    },
    
    getUrl: async () => {
      return window.location.href;
    },
    
    getTitle: async () => {
      return document.title;
    },
    
    getPageContent: async () => {
      // Enhanced page content extraction for web demo
      return {
        title: 'Comet Browser Demo Page',
        url: window.location.href,
        content: 'This is a demo page showing the Comet browser interface. The browser features include tab management, AI-powered navigation, and task automation capabilities.',
        headings: ['Comet Browser Demo', 'Features', 'AI Capabilities'],
        links: [
          { text: 'GitHub', href: 'https://github.com' },
          { text: 'Documentation', href: 'https://docs.example.com' },
          { text: 'Support', href: 'https://support.example.com' }
        ]
      };
    },
    
    // Browser view management (mocked for web)
    updateBrowserViewBounds: async (bounds) => {
      console.log('Web environment: Browser view bounds update', bounds);
      return { success: true };
    },
    
    showBrowserView: async () => {
      console.log('Web environment: Show browser view');
      // Create demo browser view if it doesn't exist
      let demoView = document.getElementById('demo-browser-view');
      if (!demoView) {
        demoView = document.createElement('div');
        demoView.id = 'demo-browser-view';
        demoView.style.cssText = `
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: #f5f5f5;
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
        `;
        document.body.appendChild(demoView);
      }
      demoView.style.display = 'flex';
      return { success: true };
    },
    
    hideBrowserView: async () => {
      console.log('Web environment: Hide browser view');
      const demoView = document.getElementById('demo-browser-view');
      if (demoView) {
        demoView.style.display = 'none';
      }
      return { success: true };
    },
    
    executePageAction: async (action) => {
      // Enhanced page interaction for web demo
      console.log('Web environment: Page action', action);
      return { 
        success: true, 
        message: `Demo: ${action.type} action would be executed on ${action.selector || 'page'}` 
      };
    },
    
    // Event listeners (mocked for web)
    onBrowserNavigate: (callback) => {
      console.log('Web environment: Browser navigate listener registered');
      // Mock event emission
      setTimeout(() => {
        callback({}, window.location.href);
      }, 100);
    },
    
    onBrowserTitleUpdated: (callback) => {
      console.log('Web environment: Browser title listener registered');
      // Mock event emission
      setTimeout(() => {
        callback({}, 'Comet Browser Demo');
      }, 100);
    },
    
    onBrowserLoading: (callback) => {
      console.log('Web environment: Browser loading listener registered');
      // Mock event emission
      setTimeout(() => {
        callback({}, { isLoading: false });
      }, 100);
    },
    
    // Remove event listeners
    removeAllListeners: (channel) => {
      console.log('Web environment: Remove listeners for', channel);
    }
  }
};

// Initialize web adapter if not in Electron
if (typeof window !== 'undefined' && !window.electronAPI) {
  window.electronAPI = webAdapter.electronAPI;
  console.log('🌐 Comet Browser: Web adapter initialized for demo mode');
}