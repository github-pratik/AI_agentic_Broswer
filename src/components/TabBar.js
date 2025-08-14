import React from 'react';
import { X, Plus } from 'lucide-react';
import './TabBar.css';

const TabBar = ({ tabs, activeTab, onTabChange, onTabClose, onNewTab }) => {
  const handleTabClick = (tabId) => {
    onTabChange(tabId);
  };

  const handleTabClose = (e, tabId) => {
    e.stopPropagation();
    onTabClose(tabId);
  };

  const handleNewTabClick = () => {
    onNewTab();
  };

  return (
    <div className="tab-bar">
      <div className="tabs-container">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`tab ${tab.id === activeTab ? 'active' : ''}`}
            onClick={() => handleTabClick(tab.id)}
          >
            <div className="tab-content">
              <span className="tab-title">{tab.title || 'New Tab'}</span>
              <button
                className="tab-close"
                onClick={(e) => handleTabClose(e, tab.id)}
                title="Close tab"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <button className="new-tab-button" onClick={handleNewTabClick} title="New tab">
        <Plus size={16} />
      </button>
    </div>
  );
};

export default TabBar; 