const { app, BrowserWindow, BrowserView, ipcMain, shell, session } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

let mainWindow;
let currentBrowserView;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js'),
      webviewTag: true,
      webSecurity: false,
      allowRunningInsecureContent: true,
      experimentalFeatures: true
    },
    icon: path.join(__dirname, 'icon.png'),
    titleBarStyle: 'default',
    show: false
  });

  // Load the app
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../build/index.html'));
  }

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    // Create browser view after window is ready
    createBrowserView();
  });

  // Update browser view bounds when window is resized
  mainWindow.on('resize', updateBrowserViewBounds);

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
  // Configure session for webview
  const ses = session.defaultSession;
  
  // Allow webview to load external content
  ses.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': ['default-src * \'unsafe-inline\' \'unsafe-eval\'; script-src * \'unsafe-inline\' \'unsafe-eval\'; connect-src * \'unsafe-inline\'; img-src * data: blob: \'unsafe-inline\'; frame-src *; style-src * \'unsafe-inline\';']
      }
    });
  });
  
  console.log('Electron app ready, creating window...');
  createWindow();
});

// Quit when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC handlers for communication between main and renderer processes
ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});

ipcMain.handle('open-external', async (event, url) => {
  await shell.openExternal(url);
});

// Handle browser view navigation
ipcMain.handle('navigate-to', (event, url) => {
  console.log('navigate-to called with URL:', url);
  if (currentBrowserView) {
    console.log('Loading URL in browser view:', url);
    currentBrowserView.webContents.loadURL(url);
  } else {
    console.error('No current browser view available');
  }
});

ipcMain.handle('go-back', () => {
  if (currentBrowserView && currentBrowserView.webContents.canGoBack()) {
    currentBrowserView.webContents.goBack();
  }
});

ipcMain.handle('go-forward', () => {
  if (currentBrowserView && currentBrowserView.webContents.canGoForward()) {
    currentBrowserView.webContents.goForward();
  }
});

ipcMain.handle('reload', () => {
  if (currentBrowserView) {
    currentBrowserView.webContents.reload();
  }
});

ipcMain.handle('can-go-back', () => {
  return currentBrowserView ? currentBrowserView.webContents.canGoBack() : false;
});

ipcMain.handle('can-go-forward', () => {
  return currentBrowserView ? currentBrowserView.webContents.canGoForward() : false;
});

ipcMain.handle('get-url', () => {
  return currentBrowserView ? currentBrowserView.webContents.getURL() : '';
});

ipcMain.handle('get-title', () => {
  return currentBrowserView ? currentBrowserView.webContents.getTitle() : '';
});

// Get page content for AI analysis
ipcMain.handle('get-page-content', async () => {
  if (!currentBrowserView) {
    return '';
  }

  try {
    const content = await currentBrowserView.webContents.executeJavaScript(`
      (function() {
        try {
          // Get page text content and structure info
          const title = document.title;
          const url = window.location.href;
          const headings = Array.from(document.querySelectorAll('h1, h2, h3')).map(h => h.textContent.trim()).slice(0, 10);
          const links = Array.from(document.querySelectorAll('a')).map(a => ({
            text: a.textContent.trim(),
            href: a.href
          })).filter(l => l.text && l.text.length > 0).slice(0, 20);
          
          // Get main content
          let mainContent = '';
          const contentSelectors = [
            'main',
            '[role="main"]',
            '.main-content',
            '#main',
            '.content',
            'article',
            '.post',
            '.job-details',
            '.job-description'
          ];
          
          for (const selector of contentSelectors) {
            const element = document.querySelector(selector);
            if (element) {
              mainContent = element.textContent.trim().substring(0, 2000);
              break;
            }
          }
          
          // Fallback to body content
          if (!mainContent) {
            mainContent = document.body.textContent.trim().substring(0, 2000);
          }
          
          return {
            title,
            url,
            headings,
            links,
            content: mainContent,
            timestamp: new Date().toISOString()
          };
        } catch (error) {
          console.error('Error getting page content:', error);
          return {
            title: document.title || '',
            url: window.location.href || '',
            content: 'Error retrieving page content',
            error: error.message
          };
        }
      })();
    `);
    
    return content;
  } catch (error) {
    console.error('Error executing page content script:', error);
    return {
      title: '',
      url: '',
      content: 'Error retrieving page content',
      error: error.message
    };
  }
});

// Create and manage browser view
function createBrowserView() {
  console.log('Creating browser view...');
  
  if (currentBrowserView) {
    console.log('Removing existing browser view');
    mainWindow.removeBrowserView(currentBrowserView);
    currentBrowserView.destroy();
  }

  currentBrowserView = new BrowserView({
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true
    }
  });

  console.log('Adding browser view to main window');
  mainWindow.addBrowserView(currentBrowserView);
  
  // Set initial bounds (will be updated by renderer)
  updateBrowserViewBounds();

  // Handle navigation events
  currentBrowserView.webContents.on('did-navigate', (event, url) => {
    mainWindow.webContents.send('browser-navigate', url);
  });

  currentBrowserView.webContents.on('did-navigate-in-page', (event, url) => {
    mainWindow.webContents.send('browser-navigate', url);
  });

  currentBrowserView.webContents.on('page-title-updated', (event, title) => {
    mainWindow.webContents.send('browser-title-updated', title);
  });

  currentBrowserView.webContents.on('did-start-loading', () => {
    mainWindow.webContents.send('browser-loading', true);
  });

  currentBrowserView.webContents.on('did-stop-loading', () => {
    mainWindow.webContents.send('browser-loading', false);
  });

  // Load initial page
  currentBrowserView.webContents.loadURL('https://www.google.com');
}

function updateBrowserViewBounds() {
  if (!currentBrowserView || !mainWindow) return;
  
  const bounds = mainWindow.getBounds();
  // Account for tab bar (40px) and navigation bar (48px)
  const topOffset = 88;
  
  currentBrowserView.setBounds({
    x: 0,
    y: topOffset,
    width: bounds.width,
    height: bounds.height - topOffset
  });
}

ipcMain.handle('update-browser-view-bounds', (event, bounds) => {
  if (currentBrowserView) {
    currentBrowserView.setBounds(bounds);
  }
});

ipcMain.handle('show-browser-view', () => {
  if (currentBrowserView && mainWindow) {
    mainWindow.addBrowserView(currentBrowserView);
    updateBrowserViewBounds();
  }
});

ipcMain.handle('hide-browser-view', () => {
  if (currentBrowserView && mainWindow) {
    mainWindow.removeBrowserView(currentBrowserView);
  }
});

// Execute page actions (clicking, filling forms, etc.)
ipcMain.handle('execute-page-action', async (event, action) => {
  if (!currentBrowserView) {
    throw new Error('No browser view available');
  }

  console.log('Executing page action:', action);

  try {
    const webContents = currentBrowserView.webContents;
    
    switch (action.type) {
      case 'click':
        const clickResult = await webContents.executeJavaScript(`
          (function() {
            try {
              console.log('Looking for element with selector:', ${JSON.stringify(action.selector)});
              
              // Try multiple selector strategies
              let element = null;
              const selectors = [
                ${JSON.stringify(action.selector)},
                // LinkedIn specific selectors
                '.jobs-search-results__list-item:first-child .job-card-container__link',
                '.jobs-search-results__list-item:first-child a[data-control-name="job_card_click"]',
                '.job-card-list__title a',
                '.job-card-container__link',
                'a[data-control-name="job_card_click"]',
                // Generic fallbacks
                '.job-card:first-child a',
                '[data-testid="job-title"] a',
                '.job-title a'
              ];
              
              for (const selector of selectors) {
                element = document.querySelector(selector);
                if (element) {
                  console.log('Found element with selector:', selector);
                  break;
                }
              }
              
              if (!element) {
                // Try finding by text content
                const links = document.querySelectorAll('a');
                for (const link of links) {
                  if (link.textContent && link.textContent.toLowerCase().includes('apply') || 
                      link.href && link.href.includes('job')) {
                    element = link;
                    console.log('Found element by text/href matching');
                    break;
                  }
                }
              }
              
              if (element) {
                console.log('Element found:', element.tagName, element.className, element.textContent?.substring(0, 50));
                
                // Scroll element into view
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                // Wait a moment for scroll
                await new Promise(resolve => setTimeout(resolve, 500));
                
                // Try different click methods
                if (element.click) {
                  element.click();
                } else {
                  // Fallback: dispatch click event
                  const clickEvent = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                  });
                  element.dispatchEvent(clickEvent);
                }
                
                return { success: true, elementFound: true, selector: 'found' };
              } else {
                console.log('No suitable element found');
                return { success: false, elementFound: false, error: 'No clickable element found' };
              }
            } catch (error) {
              console.error('Click execution error:', error);
              return { success: false, error: error.message };
            }
          })();
        `);
        
        if (!clickResult.success) {
          throw new Error(clickResult.error || 'Click action failed');
        }
        break;
        
      case 'fill':
        await webContents.executeJavaScript(`
          (function() {
            try {
              const element = document.querySelector(${JSON.stringify(action.selector)});
              if (element) {
                element.focus();
                element.value = ${JSON.stringify(action.value)};
                element.dispatchEvent(new Event('input', { bubbles: true }));
                element.dispatchEvent(new Event('change', { bubbles: true }));
                return true;
              } else {
                throw new Error('Element not found: ' + ${JSON.stringify(action.selector)});
              }
            } catch (error) {
              console.error('Fill error:', error);
              throw error;
            }
          })();
        `);
        break;
        
      case 'select':
        await webContents.executeJavaScript(`
          (function() {
            try {
              const element = document.querySelector(${JSON.stringify(action.selector)});
              if (element) {
                element.value = ${JSON.stringify(action.value)};
                element.dispatchEvent(new Event('change', { bubbles: true }));
                return true;
              } else {
                throw new Error('Element not found: ' + ${JSON.stringify(action.selector)});
              }
            } catch (error) {
              console.error('Select error:', error);
              throw error;
            }
          })();
        `);
        break;
        
      case 'wait':
        await new Promise(resolve => setTimeout(resolve, action.duration || 1000));
        break;
        
      case 'scroll':
        await webContents.executeJavaScript(`
          try {
            window.scrollTo({
              top: ${action.position || 0},
              behavior: 'smooth'
            });
          } catch (error) {
            console.error('Scroll error:', error);
          }
        `);
        break;
        
      case 'type':
        await webContents.executeJavaScript(`
          (function() {
            try {
              const element = document.querySelector(${JSON.stringify(action.selector)});
              if (element) {
                element.focus();
                element.value = '';
                const text = ${JSON.stringify(action.text || action.value || '')};
                
                // Simulate typing
                for (let i = 0; i < text.length; i++) {
                  element.value += text[i];
                  element.dispatchEvent(new Event('input', { bubbles: true }));
                  // Small delay between characters
                  await new Promise(resolve => setTimeout(resolve, 50));
                }
                element.dispatchEvent(new Event('change', { bubbles: true }));
                return true;
              } else {
                throw new Error('Element not found: ' + ${JSON.stringify(action.selector)});
              }
            } catch (error) {
              console.error('Type error:', error);
              throw error;
            }
          })();
        `);
        break;
        
      default:
        throw new Error(`Unknown action type: ${action.type}`);
    }
    
    console.log('Page action executed successfully:', action.type);
    return { success: true };
    
  } catch (error) {
    console.error('Error executing page action:', error);
    throw error;
  }
});

// Handle new window requests
ipcMain.handle('create-new-window', (event, url) => {
  const newWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: false
    }
  });
  
  newWindow.loadURL(url);
  return newWindow.id;
}); 