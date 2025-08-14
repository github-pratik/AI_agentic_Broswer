import React, { useState, useMemo } from 'react';
import { Search, Trash2, Download, Calendar, Clock, ExternalLink } from 'lucide-react';
import { useBrowser } from '../contexts/BrowserContext';
import './HistoryManager.css';

const HistoryManager = ({ onClose }) => {
  const { 
    history, 
    clearHistory, 
    removeHistoryItem, 
    searchHistory, 
    exportHistory,
    addTab 
  } = useBrowser();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [dateFilter, setDateFilter] = useState('all');

  const filteredHistory = useMemo(() => {
    let filtered = searchQuery ? searchHistory(searchQuery) : history;
    
    if (dateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
        default:
          break;
      }
      
      filtered = filtered.filter(item => new Date(item.visitedAt) >= filterDate);
    }
    
    return filtered.sort((a, b) => new Date(b.visitedAt) - new Date(a.visitedAt));
  }, [history, searchQuery, dateFilter, searchHistory]);

  const handleSelectItem = (itemId) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedItems.size === filteredHistory.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(filteredHistory.map(item => item.id)));
    }
  };

  const handleDeleteSelected = () => {
    if (selectedItems.size === 0) return;
    
    if (window.confirm(`Delete ${selectedItems.size} history items?`)) {
      clearHistory(Array.from(selectedItems));
      setSelectedItems(new Set());
    }
  };

  const handleDeleteAll = () => {
    if (window.confirm('Delete all browsing history? This action cannot be undone.')) {
      clearHistory();
      setSelectedItems(new Set());
    }
  };

  const handleExportHistory = () => {
    const data = exportHistory();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `browser-history-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleOpenInNewTab = (url) => {
    addTab(url);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    
    return date.toLocaleDateString();
  };

  const groupedHistory = useMemo(() => {
    const groups = {};
    filteredHistory.forEach(item => {
      const date = formatDate(item.visitedAt);
      if (!groups[date]) groups[date] = [];
      groups[date].push(item);
    });
    return groups;
  }, [filteredHistory]);

  return (
    <div className="history-manager">
      <div className="history-header">
        <h2>Browsing History</h2>
        <button className="close-button" onClick={onClose}>×</button>
      </div>

      <div className="history-controls">
        <div className="search-container">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search history..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-controls">
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="date-filter"
          >
            <option value="all">All time</option>
            <option value="today">Today</option>
            <option value="week">Past week</option>
            <option value="month">Past month</option>
          </select>

          <button
            className="control-button"
            onClick={handleSelectAll}
            title={selectedItems.size === filteredHistory.length ? 'Deselect all' : 'Select all'}
          >
            {selectedItems.size === filteredHistory.length ? 'Deselect all' : 'Select all'}
          </button>

          <button
            className="control-button danger"
            onClick={handleDeleteSelected}
            disabled={selectedItems.size === 0}
            title="Delete selected"
          >
            <Trash2 size={16} />
            Delete ({selectedItems.size})
          </button>

          <button
            className="control-button"
            onClick={handleExportHistory}
            title="Export history"
          >
            <Download size={16} />
            Export
          </button>

          <button
            className="control-button danger"
            onClick={handleDeleteAll}
            title="Clear all history"
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="history-content">
        {Object.keys(groupedHistory).length === 0 ? (
          <div className="empty-state">
            <Clock size={48} />
            <h3>No history found</h3>
            <p>Your browsing history will appear here</p>
          </div>
        ) : (
          Object.entries(groupedHistory).map(([date, items]) => (
            <div key={date} className="history-group">
              <div className="group-header">
                <Calendar size={16} />
                <h3>{date}</h3>
                <span className="item-count">({items.length} items)</span>
              </div>
              
              <div className="history-items">
                {items.map(item => (
                  <div
                    key={item.id}
                    className={`history-item ${selectedItems.has(item.id) ? 'selected' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedItems.has(item.id)}
                      onChange={() => handleSelectItem(item.id)}
                      className="item-checkbox"
                    />
                    
                    <div className="item-content" onClick={() => handleOpenInNewTab(item.url)}>
                      <div className="item-title">{item.title}</div>
                      <div className="item-url">{item.url}</div>
                      <div className="item-time">
                        {new Date(item.visitedAt).toLocaleTimeString()}
                      </div>
                    </div>
                    
                    <div className="item-actions">
                      <button
                        className="action-button"
                        onClick={() => handleOpenInNewTab(item.url)}
                        title="Open in new tab"
                      >
                        <ExternalLink size={14} />
                      </button>
                      <button
                        className="action-button danger"
                        onClick={() => removeHistoryItem(item.id)}
                        title="Remove from history"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HistoryManager;