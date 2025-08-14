const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  openExternal: (url) => ipcRenderer.invoke('open-external', url),
  createNewWindow: (url) => ipcRenderer.invoke('create-new-window', url),
  
  // Browser navigation methods
  navigateTo: (url) => ipcRenderer.invoke('navigate-to', url),
  goBack: () => ipcRenderer.invoke('go-back'),
  goForward: () => ipcRenderer.invoke('go-forward'),
  reload: () => ipcRenderer.invoke('reload'),
  canGoBack: () => ipcRenderer.invoke('can-go-back'),
  canGoForward: () => ipcRenderer.invoke('can-go-forward'),
  getUrl: () => ipcRenderer.invoke('get-url'),
  getTitle: () => ipcRenderer.invoke('get-title'),
  getPageContent: () => ipcRenderer.invoke('get-page-content'),
  updateBrowserViewBounds: (bounds) => ipcRenderer.invoke('update-browser-view-bounds', bounds),
  showBrowserView: () => ipcRenderer.invoke('show-browser-view'),
  hideBrowserView: () => ipcRenderer.invoke('hide-browser-view'),
  executePageAction: (action) => ipcRenderer.invoke('execute-page-action', action),
  
  // Event listeners
  onBrowserNavigate: (callback) => ipcRenderer.on('browser-navigate', callback),
  onBrowserTitleUpdated: (callback) => ipcRenderer.on('browser-title-updated', callback),
  onBrowserLoading: (callback) => ipcRenderer.on('browser-loading', callback),
  
  // Remove event listeners
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel)
}); 