# Troubleshooting Search Issues

## Steps to Debug Search Functionality

1. **Start the application**:
   ```bash
   npm run electron-dev
   ```

2. **Open Developer Tools**:
   - The app should automatically open DevTools in development mode
   - If not, press `Ctrl+Shift+I` (Windows/Linux) or `Cmd+Option+I` (Mac)

3. **Test Search Functionality**:
   - Try typing "test search" in the URL bar and press Enter
   - Check the console for debug messages
   - Look for messages like:
     - "URL submitted: test search"
     - "Detected as search query, using: https://www.google.com/search?q=test%20search"
     - "Calling onUrlChange with: [URL]"

4. **Test Direct URL**:
   - Try typing "google.com" in the URL bar
   - Should see "Detected as URL: https://google.com"

5. **Test Navigation Buttons**:
   - Click the red "T" button (test button) - should navigate to Google
   - Try the back/forward buttons
   - Check console for webview-related messages

6. **Check Webview**:
   - Look for "Setting up webview event listeners" in console
   - Check for "Navigation event:", "Title update:", etc.

## Common Issues and Solutions

### Issue 1: Webview not loading
**Symptoms**: Blank content area, no navigation
**Solution**: Check Electron webview permissions in `public/electron.js`

### Issue 2: Search not working
**Symptoms**: URL bar input doesn't trigger navigation
**Solution**: Check URL processing logic in `NavigationBar.js`

### Issue 3: Navigation buttons not working
**Symptoms**: Back/forward buttons don't work
**Solution**: Ensure webview element is found and has navigation methods

### Issue 4: Console errors about webview
**Symptoms**: Errors about webview tag or permissions
**Solution**: Verify `webviewTag: true` in Electron main process

## Debug Console Commands

Open DevTools console and try these commands:

```javascript
// Check if webview exists
document.querySelector('webview')

// Check webview methods
const webview = document.querySelector('webview');
console.log('canGoBack:', webview?.canGoBack());
console.log('canGoForward:', webview?.canGoForward());

// Check current URL
console.log('webview src:', webview?.src);
console.log('webview URL:', webview?.getURL());
```

## Expected Console Output

When search is working correctly, you should see:
```
URL submitted: test search
Detected as search query, using: https://www.google.com/search?q=test%20search
Calling onUrlChange with: https://www.google.com/search?q=test%20search
BrowserWindow handleUrlChange called with: https://www.google.com/search?q=test%20search
Updating tab [tab-id] with URL: https://www.google.com/search?q=test%20search
Setting up webview event listeners
Navigation event: https://www.google.com/search?q=test%20search
```