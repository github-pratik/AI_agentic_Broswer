import React, { createContext, useContext, useReducer, useEffect } from 'react';

const BrowserContext = createContext();

// Simple ID generator
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const initialState = {
  tabs: [],
  activeTab: null,
  bookmarks: [],
  bookmarkFolders: [
    { id: 'default', name: 'Bookmarks Bar', parentId: null },
    { id: 'other', name: 'Other Bookmarks', parentId: null }
  ],
  history: [],
  settings: {
    defaultSearchEngine: 'https://www.google.com/search?q=',
    homepage: 'https://www.google.com',
    incognitoMode: false,
    autoSaveHistory: true,
    maxHistoryItems: 1000
  },
  incognitoTabs: [],
  downloadHistory: []
};

const browserReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TAB':
      const newTab = {
        id: generateId(),
        url: action.payload.url || 'https://www.google.com',
        title: action.payload.title || 'New Tab',
        createdAt: new Date().toISOString()
      };
      return {
        ...state,
        tabs: [...state.tabs, newTab],
        activeTab: newTab.id
      };

    case 'CLOSE_TAB':
      const remainingTabs = state.tabs.filter(tab => tab.id !== action.payload);
      const newActiveTab = remainingTabs.length > 0 
        ? (state.activeTab === action.payload ? remainingTabs[0].id : state.activeTab)
        : null;
      return {
        ...state,
        tabs: remainingTabs,
        activeTab: newActiveTab
      };

    case 'UPDATE_TAB':
      return {
        ...state,
        tabs: state.tabs.map(tab =>
          tab.id === action.payload.id
            ? { ...tab, ...action.payload.updates }
            : tab
        )
      };

    case 'SET_ACTIVE_TAB':
      return {
        ...state,
        activeTab: action.payload
      };

    case 'ADD_BOOKMARK':
      const newBookmark = {
        id: generateId(),
        url: action.payload.url,
        title: action.payload.title,
        folderId: action.payload.folderId || 'default',
        favicon: action.payload.favicon || '',
        createdAt: new Date().toISOString()
      };
      return {
        ...state,
        bookmarks: [...state.bookmarks, newBookmark]
      };

    case 'REMOVE_BOOKMARK':
      return {
        ...state,
        bookmarks: state.bookmarks.filter(bookmark => bookmark.id !== action.payload)
      };

    case 'UPDATE_BOOKMARK':
      return {
        ...state,
        bookmarks: state.bookmarks.map(bookmark =>
          bookmark.id === action.payload.id
            ? { ...bookmark, ...action.payload.updates }
            : bookmark
        )
      };

    case 'ADD_BOOKMARK_FOLDER':
      const newFolder = {
        id: generateId(),
        name: action.payload.name,
        parentId: action.payload.parentId || null,
        createdAt: new Date().toISOString()
      };
      return {
        ...state,
        bookmarkFolders: [...state.bookmarkFolders, newFolder]
      };

    case 'REMOVE_BOOKMARK_FOLDER':
      return {
        ...state,
        bookmarkFolders: state.bookmarkFolders.filter(folder => folder.id !== action.payload),
        bookmarks: state.bookmarks.filter(bookmark => bookmark.folderId !== action.payload)
      };

    case 'ADD_HISTORY':
      const newHistoryItem = {
        id: generateId(),
        url: action.payload.url,
        title: action.payload.title,
        visitedAt: new Date().toISOString()
      };
      return {
        ...state,
        history: [newHistoryItem, ...state.history.slice(0, 999)] // Keep last 1000 items
      };

    case 'CLEAR_HISTORY':
      return {
        ...state,
        history: action.payload ? state.history.filter(item => !action.payload.includes(item.id)) : []
      };

    case 'REMOVE_HISTORY_ITEM':
      return {
        ...state,
        history: state.history.filter(item => item.id !== action.payload)
      };

    case 'SET_INCOGNITO_MODE':
      return {
        ...state,
        settings: { ...state.settings, incognitoMode: action.payload }
      };

    case 'ADD_INCOGNITO_TAB':
      const newIncognitoTab = {
        id: generateId(),
        url: action.payload.url || 'https://www.google.com',
        title: action.payload.title || 'New Incognito Tab',
        createdAt: new Date().toISOString(),
        isIncognito: true
      };
      return {
        ...state,
        incognitoTabs: [...state.incognitoTabs, newIncognitoTab]
      };

    case 'CLOSE_INCOGNITO_TAB':
      return {
        ...state,
        incognitoTabs: state.incognitoTabs.filter(tab => tab.id !== action.payload)
      };

    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      };

    case 'LOAD_TABS':
      return {
        ...state,
        tabs: action.payload,
        activeTab: action.payload.length > 0 ? action.payload[0].id : null
      };

    case 'LOAD_BOOKMARKS':
      return {
        ...state,
        bookmarks: action.payload
      };

    case 'LOAD_HISTORY':
      return {
        ...state,
        history: action.payload
      };

    case 'LOAD_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      };

    default:
      return state;
  }
};

export const BrowserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(browserReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const loadData = () => {
      try {
        const savedTabs = localStorage.getItem('browser-tabs');
        const savedBookmarks = localStorage.getItem('browser-bookmarks');
        const savedHistory = localStorage.getItem('browser-history');
        const savedSettings = localStorage.getItem('browser-settings');

        if (savedTabs) {
          const tabs = JSON.parse(savedTabs);
          dispatch({ type: 'LOAD_TABS', payload: tabs });
        }
        if (savedBookmarks) {
          const bookmarks = JSON.parse(savedBookmarks);
          dispatch({ type: 'LOAD_BOOKMARKS', payload: bookmarks });
        }
        if (savedHistory) {
          const history = JSON.parse(savedHistory);
          dispatch({ type: 'LOAD_HISTORY', payload: history });
        }
        if (savedSettings) {
          const settings = JSON.parse(savedSettings);
          dispatch({ type: 'LOAD_SETTINGS', payload: settings });
        }
      } catch (error) {
        console.error('Error loading browser data:', error);
      }
    };

    loadData();
  }, []);

  // Save data to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('browser-tabs', JSON.stringify(state.tabs));
  }, [state.tabs]);

  useEffect(() => {
    localStorage.setItem('browser-bookmarks', JSON.stringify(state.bookmarks));
  }, [state.bookmarks]);

  useEffect(() => {
    localStorage.setItem('browser-history', JSON.stringify(state.history));
  }, [state.history]);

  useEffect(() => {
    localStorage.setItem('browser-settings', JSON.stringify(state.settings));
  }, [state.settings]);

  const addTab = (url, title) => {
    dispatch({ type: 'ADD_TAB', payload: { url, title } });
  };

  const closeTab = (tabId) => {
    dispatch({ type: 'CLOSE_TAB', payload: tabId });
  };

  const updateTab = (tabId, updates) => {
    dispatch({ type: 'UPDATE_TAB', payload: { id: tabId, updates } });
  };

  const setActiveTab = (tabId) => {
    dispatch({ type: 'SET_ACTIVE_TAB', payload: tabId });
  };

  const addBookmark = (url, title, folderId, favicon) => {
    dispatch({ type: 'ADD_BOOKMARK', payload: { url, title, folderId, favicon } });
  };

  const removeBookmark = (bookmarkId) => {
    dispatch({ type: 'REMOVE_BOOKMARK', payload: bookmarkId });
  };

  const updateBookmark = (bookmarkId, updates) => {
    dispatch({ type: 'UPDATE_BOOKMARK', payload: { id: bookmarkId, updates } });
  };

  const addBookmarkFolder = (name, parentId) => {
    dispatch({ type: 'ADD_BOOKMARK_FOLDER', payload: { name, parentId } });
  };

  const removeBookmarkFolder = (folderId) => {
    dispatch({ type: 'REMOVE_BOOKMARK_FOLDER', payload: folderId });
  };

  const addHistory = (url, title) => {
    if (state.settings.incognitoMode || !state.settings.autoSaveHistory) return;
    dispatch({ type: 'ADD_HISTORY', payload: { url, title } });
  };

  const clearHistory = (itemIds) => {
    dispatch({ type: 'CLEAR_HISTORY', payload: itemIds });
  };

  const removeHistoryItem = (itemId) => {
    dispatch({ type: 'REMOVE_HISTORY_ITEM', payload: itemId });
  };

  const setIncognitoMode = (enabled) => {
    dispatch({ type: 'SET_INCOGNITO_MODE', payload: enabled });
  };

  const addIncognitoTab = (url, title) => {
    dispatch({ type: 'ADD_INCOGNITO_TAB', payload: { url, title } });
  };

  const closeIncognitoTab = (tabId) => {
    dispatch({ type: 'CLOSE_INCOGNITO_TAB', payload: tabId });
  };

  const searchHistory = (query) => {
    return state.history.filter(item =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.url.toLowerCase().includes(query.toLowerCase())
    );
  };

  const searchBookmarks = (query) => {
    return state.bookmarks.filter(bookmark =>
      bookmark.title.toLowerCase().includes(query.toLowerCase()) ||
      bookmark.url.toLowerCase().includes(query.toLowerCase())
    );
  };

  const exportBookmarks = () => {
    const data = {
      bookmarks: state.bookmarks,
      folders: state.bookmarkFolders,
      exportDate: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  };

  const importBookmarks = (jsonData) => {
    try {
      const data = JSON.parse(jsonData);
      if (data.bookmarks) {
        dispatch({ type: 'LOAD_BOOKMARKS', payload: data.bookmarks });
      }
      if (data.folders) {
        dispatch({ type: 'LOAD_BOOKMARK_FOLDERS', payload: data.folders });
      }
      return true;
    } catch (error) {
      console.error('Error importing bookmarks:', error);
      return false;
    }
  };

  const exportHistory = () => {
    const data = {
      history: state.history,
      exportDate: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  };

  const updateSettings = (settings) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
  };

  const value = {
    ...state,
    addTab,
    closeTab,
    updateTab,
    setActiveTab,
    addBookmark,
    removeBookmark,
    updateBookmark,
    addBookmarkFolder,
    removeBookmarkFolder,
    addHistory,
    clearHistory,
    removeHistoryItem,
    setIncognitoMode,
    addIncognitoTab,
    closeIncognitoTab,
    searchHistory,
    searchBookmarks,
    exportBookmarks,
    importBookmarks,
    exportHistory,
    updateSettings
  };

  return (
    <BrowserContext.Provider value={value}>
      {children}
    </BrowserContext.Provider>
  );
};

export const useBrowser = () => {
  const context = useContext(BrowserContext);
  if (!context) {
    throw new Error('useBrowser must be used within a BrowserProvider');
  }
  return context;
};
