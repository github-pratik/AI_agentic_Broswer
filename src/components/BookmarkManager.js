import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Trash2, 
  Download, 
  Upload, 
  Folder, 
  FolderPlus, 
  Star, 
  ExternalLink,
  Edit3,
  Move
} from 'lucide-react';
import { useBrowser } from '../contexts/BrowserContext';
import './BookmarkManager.css';

const BookmarkManager = ({ onClose }) => {
  const { 
    bookmarks, 
    bookmarkFolders,
    removeBookmark, 
    updateBookmark,
    addBookmarkFolder,
    removeBookmarkFolder,
    searchBookmarks, 
    exportBookmarks,
    importBookmarks,
    addTab 
  } = useBrowser();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [editingBookmark, setEditingBookmark] = useState(null);
  const [editingFolder, setEditingFolder] = useState(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [showNewFolderInput, setShowNewFolderInput] = useState(false);

  const filteredBookmarks = useMemo(() => {
    let filtered = searchQuery ? searchBookmarks(searchQuery) : bookmarks;
    
    if (selectedFolder !== 'all') {
      filtered = filtered.filter(bookmark => bookmark.folderId === selectedFolder);
    }
    
    return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [bookmarks, searchQuery, selectedFolder, searchBookmarks]);

  const handleEditBookmark = (bookmark) => {
    setEditingBookmark({
      ...bookmark,
      newTitle: bookmark.title,
      newUrl: bookmark.url,
      newFolderId: bookmark.folderId
    });
  };

  const handleSaveBookmark = () => {
    if (!editingBookmark) return;
    
    updateBookmark(editingBookmark.id, {
      title: editingBookmark.newTitle,
      url: editingBookmark.newUrl,
      folderId: editingBookmark.newFolderId
    });
    
    setEditingBookmark(null);
  };

  const handleCancelEdit = () => {
    setEditingBookmark(null);
  };

  const handleDeleteBookmark = (bookmarkId) => {
    if (window.confirm('Delete this bookmark?')) {
      removeBookmark(bookmarkId);
    }
  };

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      addBookmarkFolder(newFolderName.trim());
      setNewFolderName('');
      setShowNewFolderInput(false);
    }
  };

  const handleDeleteFolder = (folderId) => {
    const folder = bookmarkFolders.find(f => f.id === folderId);
    const bookmarksInFolder = bookmarks.filter(b => b.folderId === folderId);
    
    if (bookmarksInFolder.length > 0) {
      if (!window.confirm(`Delete folder "${folder.name}" and all ${bookmarksInFolder.length} bookmarks inside?`)) {
        return;
      }
    }
    
    removeBookmarkFolder(folderId);
    if (selectedFolder === folderId) {
      setSelectedFolder('all');
    }
  };

  const handleExportBookmarks = () => {
    const data = exportBookmarks();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bookmarks-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportBookmarks = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const success = importBookmarks(e.target.result);
        if (success) {
          alert('Bookmarks imported successfully!');
        } else {
          alert('Error importing bookmarks. Please check the file format.');
        }
      } catch (error) {
        alert('Error importing bookmarks: ' + error.message);
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleOpenInNewTab = (url) => {
    addTab(url);
  };

  const getFolderName = (folderId) => {
    const folder = bookmarkFolders.find(f => f.id === folderId);
    return folder ? folder.name : 'Unknown Folder';
  };

  const getBookmarkCount = (folderId) => {
    return bookmarks.filter(b => b.folderId === folderId).length;
  };

  return (
    <div className="bookmark-manager">
      <div className="bookmark-header">
        <h2>Bookmark Manager</h2>
        <button className="close-button" onClick={onClose}>×</button>
      </div>

      <div className="bookmark-controls">
        <div className="search-container">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search bookmarks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-controls">
          <select
            value={selectedFolder}
            onChange={(e) => setSelectedFolder(e.target.value)}
            className="folder-filter"
          >
            <option value="all">All Folders</option>
            {bookmarkFolders.map(folder => (
              <option key={folder.id} value={folder.id}>
                {folder.name} ({getBookmarkCount(folder.id)})
              </option>
            ))}
          </select>

          <button
            className="control-button"
            onClick={() => setShowNewFolderInput(true)}
            title="Create new folder"
          >
            <FolderPlus size={16} />
            New Folder
          </button>

          <button
            className="control-button"
            onClick={handleExportBookmarks}
            title="Export bookmarks"
          >
            <Download size={16} />
            Export
          </button>

          <label className="control-button" title="Import bookmarks">
            <Upload size={16} />
            Import
            <input
              type="file"
              accept=".json"
              onChange={handleImportBookmarks}
              style={{ display: 'none' }}
            />
          </label>
        </div>
      </div>

      {showNewFolderInput && (
        <div className="new-folder-input">
          <input
            type="text"
            placeholder="Folder name"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleCreateFolder()}
            autoFocus
          />
          <button onClick={handleCreateFolder} disabled={!newFolderName.trim()}>
            Create
          </button>
          <button onClick={() => {
            setShowNewFolderInput(false);
            setNewFolderName('');
          }}>
            Cancel
          </button>
        </div>
      )}

      <div className="bookmark-content">
        <div className="folders-section">
          <h3>Folders</h3>
          <div className="folder-list">
            {bookmarkFolders.map(folder => (
              <div key={folder.id} className="folder-item">
                <div className="folder-info">
                  <Folder size={16} />
                  <span className="folder-name">{folder.name}</span>
                  <span className="bookmark-count">({getBookmarkCount(folder.id)})</span>
                </div>
                <div className="folder-actions">
                  <button
                    className="action-button"
                    onClick={() => setSelectedFolder(folder.id)}
                    title="View folder"
                  >
                    <ExternalLink size={14} />
                  </button>
                  {folder.id !== 'default' && folder.id !== 'other' && (
                    <button
                      className="action-button danger"
                      onClick={() => handleDeleteFolder(folder.id)}
                      title="Delete folder"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bookmarks-section">
          <h3>
            Bookmarks 
            {selectedFolder !== 'all' && ` in ${getFolderName(selectedFolder)}`}
            <span className="bookmark-count">({filteredBookmarks.length})</span>
          </h3>
          
          {filteredBookmarks.length === 0 ? (
            <div className="empty-state">
              <Star size={48} />
              <h3>No bookmarks found</h3>
              <p>Your bookmarks will appear here</p>
            </div>
          ) : (
            <div className="bookmark-list">
              {filteredBookmarks.map(bookmark => (
                <div key={bookmark.id} className="bookmark-item">
                  {editingBookmark && editingBookmark.id === bookmark.id ? (
                    <div className="bookmark-edit-form">
                      <input
                        type="text"
                        value={editingBookmark.newTitle}
                        onChange={(e) => setEditingBookmark({
                          ...editingBookmark,
                          newTitle: e.target.value
                        })}
                        placeholder="Bookmark title"
                        className="edit-input"
                      />
                      <input
                        type="url"
                        value={editingBookmark.newUrl}
                        onChange={(e) => setEditingBookmark({
                          ...editingBookmark,
                          newUrl: e.target.value
                        })}
                        placeholder="Bookmark URL"
                        className="edit-input"
                      />
                      <select
                        value={editingBookmark.newFolderId}
                        onChange={(e) => setEditingBookmark({
                          ...editingBookmark,
                          newFolderId: e.target.value
                        })}
                        className="edit-select"
                      >
                        {bookmarkFolders.map(folder => (
                          <option key={folder.id} value={folder.id}>
                            {folder.name}
                          </option>
                        ))}
                      </select>
                      <div className="edit-actions">
                        <button onClick={handleSaveBookmark} className="save-button">
                          Save
                        </button>
                        <button onClick={handleCancelEdit} className="cancel-button">
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="bookmark-content-item" onClick={() => handleOpenInNewTab(bookmark.url)}>
                        {bookmark.favicon && (
                          <img src={bookmark.favicon} alt="" className="bookmark-favicon" />
                        )}
                        <div className="bookmark-info">
                          <div className="bookmark-title">{bookmark.title}</div>
                          <div className="bookmark-url">{bookmark.url}</div>
                          <div className="bookmark-meta">
                            <span className="bookmark-folder">{getFolderName(bookmark.folderId)}</span>
                            <span className="bookmark-date">
                              {new Date(bookmark.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bookmark-actions">
                        <button
                          className="action-button"
                          onClick={() => handleOpenInNewTab(bookmark.url)}
                          title="Open in new tab"
                        >
                          <ExternalLink size={14} />
                        </button>
                        <button
                          className="action-button"
                          onClick={() => handleEditBookmark(bookmark)}
                          title="Edit bookmark"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          className="action-button danger"
                          onClick={() => handleDeleteBookmark(bookmark.id)}
                          title="Delete bookmark"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookmarkManager;