// Web adapter for Electron APIs
export const webAdapter = {
  // Mock Electron API for web environment
  electronAPI: {
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
    }
  }
};

// Initialize web adapter if not in Electron
if (typeof window !== 'undefined' && !window.electronAPI) {
  window.electronAPI = webAdapter.electronAPI;
}