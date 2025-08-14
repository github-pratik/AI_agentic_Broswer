import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  RefreshCw, 
  Home, 
  Settings, 
  Bot, 
  Star, 
  History, 
  Shield,
  Download,
  Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useBrowser } from '../contexts/BrowserContext';
import HistoryManager from './HistoryManager';
import BookmarkManager from './BookmarkManager';
import TaskAutomation from './TaskAutomation';
import './NavigationBar.css';

const NavigationBar = ({ url, onUrlChange, onTitleChange, onToggleSidebar }) => {
  const [inputUrl, setInputUrl] = useState(url);
  const [showHistory, setShowHistory] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [showTaskAutomation, setShowTaskAutomation] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { 
    bookmarks, 
    addBookmark, 
    removeBookmark, 
    addHistory,
    settings,
    setIncognitoMode 
  } = useBrowser();

  // Check if current URL is bookmarked
  React.useEffect(() => {
    const bookmarked = bookmarks.some(bookmark => bookmark.url === url);
    setIsBookmarked(bookmarked);
    setInputUrl(url);
  }, [url, bookmarks]);

  const handleUrlSubmit = (e) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;
    
    let processedUrl = inputUrl.trim();
    
    // Check if it's a URL or search query
    const isUrl = /^https?:\/\//.test(processedUrl) || 
                  /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}/.test(processedUrl) ||
                  processedUrl.includes('localhost') ||
                  /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(processedUrl);
    
    if (isUrl) {
      // It's a URL - add protocol if missing
      if (!processedUrl.startsWith('http://') && !processedUrl.startsWith('https://')) {
        processedUrl = 'https://' + processedUrl;
      }
    } else {
      // It's a search query
      processedUrl = settings.defaultSearchEngine + encodeURIComponent(processedUrl);
    }
    
    setIsLoading(true);
    onUrlChange(processedUrl);
    
    // Add to history after a short delay to get the page title
    setTimeout(async () => {
      let title = processedUrl;
      if (window.electronAPI && window.electronAPI.getTitle) {
        try {
          title = await window.electronAPI.getTitle() || processedUrl;
        } catch (error) {
          console.log('Could not get title:', error);
        }
      }
      addHistory(processedUrl, title);
      setIsLoading(false);
    }, 2000);
  };

  const handleGoBack = async () => {
    if (window.electronAPI && window.electronAPI.goBack) {
      await window.electronAPI.goBack();
    }
  };

  const handleGoForward = async () => {
    if (window.electronAPI && window.electronAPI.goForward) {
      await window.electronAPI.goForward();
    }
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    if (window.electronAPI && window.electronAPI.reload) {
      await window.electronAPI.reload();
    }
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleHome = () => {
    onUrlChange(settings.homepage);
  };

  const handleSettings = () => {
    navigate('/settings');
  };

  const handleToggleBookmark = () => {
    if (isBookmarked) {
      const bookmark = bookmarks.find(b => b.url === url);
      if (bookmark) {
        removeBookmark(bookmark.id);
      }
    } else {
      const title = document.title || url;
      addBookmark(url, title, 'default');
    }
  };

  const handleToggleIncognito = () => {
    setIncognitoMode(!settings.incognitoMode);
  };

  const handleDownload = () => {
    // This would trigger a download of the current page
    window.print(); // Placeholder - in real implementation, this would save the page
  };

  return (
    <>
      <div className="navigation-bar">
        <div className="nav-controls">
          <button className="nav-button" onClick={handleGoBack} title="Go back">
            <ArrowLeft size={16} />
          </button>
          <button className="nav-button" onClick={handleGoForward} title="Go forward">
            <ArrowRight size={16} />
          </button>
          <button 
            className={`nav-button ${isLoading ? 'loading' : ''}`} 
            onClick={handleRefresh} 
            title="Refresh"
          >
            <RefreshCw size={16} />
          </button>
          <button className="nav-button" onClick={handleHome} title="Home">
            <Home size={16} />
          </button>
        </div>
        
        <form className="url-bar-container" onSubmit={handleUrlSubmit}>
          <div className="url-bar-wrapper">
            {settings.incognitoMode && (
              <div className="incognito-indicator" title="Incognito mode">
                <Shield size={14} />
              </div>
            )}
            <input
              type="text"
              className="url-bar"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="Search or enter URL"
            />
            <button
              type="button"
              className={`bookmark-button ${isBookmarked ? 'bookmarked' : ''}`}
              onClick={handleToggleBookmark}
              title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
            >
              <Star size={16} />
            </button>
          </div>
        </form>
        
        <div className="nav-actions">
          <button 
            className="nav-button" 
            onClick={() => setShowHistory(true)}
            title="History"
          >
            <History size={16} />
          </button>
          <button 
            className="nav-button" 
            onClick={() => setShowBookmarks(true)}
            title="Bookmarks"
          >
            <Star size={16} />
          </button>
          <button 
            className="nav-button" 
            onClick={() => setShowTaskAutomation(true)}
            title="Task Automation"
          >
            <Zap size={16} />
          </button>
          <button 
            className="nav-button" 
            onClick={handleDownload}
            title="Download page"
          >
            <Download size={16} />
          </button>
          <button 
            className={`nav-button ${settings.incognitoMode ? 'active' : ''}`}
            onClick={handleToggleIncognito}
            title="Toggle incognito mode"
          >
            <Shield size={16} />
          </button>
          <button 
            className="nav-button ai-toggle" 
            onClick={onToggleSidebar}
            title="AI Assistant"
          >
            <Bot size={16} />
          </button>
          <button className="nav-button" onClick={handleSettings} title="Settings">
            <Settings size={16} />
          </button>
        </div>
      </div>

      {showHistory && (
        <HistoryManager onClose={() => setShowHistory(false)} />
      )}

      {showBookmarks && (
        <BookmarkManager onClose={() => setShowBookmarks(false)} />
      )}

      {showTaskAutomation && (
        <TaskAutomation onClose={() => setShowTaskAutomation(false)} />
      )}
    </>
  );
};

export default NavigationBar; 