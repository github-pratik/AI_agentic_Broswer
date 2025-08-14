// Web adapter for Electron APIs
export const webAdapter = {
  // Mock Electron API for web environment
  electronAPI: {
    // Navigation methods
    navigateTo: async (url) => {
      // In web environment, open in new tab
      window.open(url, '_blank');
      return { success: true };
    },
    
    getUrl: async () => {
      return window.location.href;
    },
    
    getTitle: async () => {
      return document.title;
    },
    
    // Browser view methods (stubs for web)
    showBrowserView: () => {
      console.log('Web environment: showBrowserView called');
    },
    
    hideBrowserView: () => {
      console.log('Web environment: hideBrowserView called');
    },
    
    updateBrowserViewBounds: (bounds) => {
      console.log('Web environment: updateBrowserViewBounds called with', bounds);
    },
    
    // Navigation methods (stubs for web)
    goBack: async () => {
      console.log('Web environment: goBack called');
      return { success: false, message: 'Navigation not available in web environment' };
    },
    
    goForward: async () => {
      console.log('Web environment: goForward called');
      return { success: false, message: 'Navigation not available in web environment' };
    },
    
    reload: async () => {
      console.log('Web environment: reload called');
      window.location.reload();
      return { success: true };
    },
    
    // App methods
    getAppVersion: async () => {
      return '1.0.0 (Web Version)';
    },
    
    // Page content methods
    getPageContent: async () => {
      // Basic page content extraction for web
      const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'))
        .map(h => h.textContent.trim());
      
      const links = Array.from(document.querySelectorAll('a[href]'))
        .map(a => ({ text: a.textContent.trim(), href: a.href }))
        .slice(0, 10);
      
      return {
        title: document.title,
        url: window.location.href,
        content: document.body.textContent.slice(0, 1000),
        headings,
        links
      };
    },
    
    executePageAction: async (action) => {
      // Limited page interaction for web
      console.log('Web environment: Limited page interaction', action);
      return { success: false, message: 'Limited functionality in web environment' };
    },
    
    // Event listener methods (stubs for web)
    onBrowserNavigate: (callback) => {
      console.log('Web environment: onBrowserNavigate listener added');
    },
    
    onBrowserTitleUpdated: (callback) => {
      console.log('Web environment: onBrowserTitleUpdated listener added');
    },
    
    onBrowserLoading: (callback) => {
      console.log('Web environment: onBrowserLoading listener added');
    },
    
    removeAllListeners: (event) => {
      console.log('Web environment: removeAllListeners called for', event);
    }
  }
};

// Initialize web adapter if not in Electron
if (typeof window !== 'undefined' && !window.electronAPI) {
  window.electronAPI = webAdapter.electronAPI;
}