import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, X } from 'lucide-react';
import { useAI } from '../contexts/AIContext';
import { useBrowser } from '../contexts/BrowserContext';
import './AISidebar.css';

const AISidebar = ({ onClose }) => {
  const { 
    messages, 
    sendMessage, 
    isLoading, 
    currentModel, 
    availableModels,
    setCurrentModel,
    error
  } = useAI();
  const { activeTab, tabs } = useBrowser();
  const [inputMessage, setInputMessage] = useState('');
  const [activeActionTab, setActiveActionTab] = useState('quick');
  const messagesEndRef = useRef(null);

  const currentTab = tabs.find(tab => tab.id === activeTab);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const message = inputMessage.trim();
    console.log('AISidebar: Sending message:', message);
    setInputMessage('');
    
    // Add context about current tab if available
    let context = '';
    if (currentTab) {
      context = `Current page: ${currentTab.title} (${currentTab.url})`;
    }

    console.log('AISidebar: Context:', context);
    await sendMessage(message, context);
  };

  const handleQuickAction = async (action) => {
    let message = '';
    let pageContent = '';
    
    // Try to extract page content for analysis
    try {
      const webview = document.querySelector('webview');
      if (webview) {
        // In a real implementation, you'd extract content from the webview
        pageContent = `Page title: ${currentTab?.title || 'Unknown'}\nURL: ${currentTab?.url || 'Unknown'}`;
      }
    } catch (error) {
      console.log('Could not extract page content:', error);
    }
    
    switch (action) {
      case 'summarize':
        message = `Please summarize the content of the current page: ${currentTab?.title || 'current page'}`;
        break;
      case 'explain':
        message = `Please explain the key points and main ideas from the current page: ${currentTab?.title || 'current page'}`;
        break;
      case 'search':
        message = 'Search the web for the latest news on artificial intelligence and machine learning';
        break;
      case 'extract':
        message = 'Extract the main data, facts, and important information from this page';
        break;
      case 'translate':
        message = 'Translate the main content of this page to English (if not already in English)';
        break;
      case 'questions':
        message = 'Generate 5 important questions that this page content answers';
        break;
      case 'navigate':
        message = 'Go to wikipedia.org';
        break;
      case 'websearch':
        message = 'search for George Mason University';
        break;
      case 'linkedin_jobs':
        message = 'Apply for software engineer jobs on LinkedIn';
        break;
      case 'fill_form':
        message = 'Fill out the contact form on this page with my information';
        break;
      case 'auto_login':
        message = 'Help me login to this website';
        break;
      default:
        return;
    }
    
    setInputMessage(message);
    
    // Auto-send for quick actions
    if (message) {
      const context = currentTab ? `Current page: ${currentTab.title} (${currentTab.url})` : '';
      
      // Clean execution without test code
      
      await sendMessage(message, context, pageContent);
      setInputMessage('');
    }
  };

  return (
    <div className="ai-sidebar">
      <div className="sidebar-header">
        <div className="sidebar-title">
          <Bot size={20} />
          <span>AI Assistant</span>
        </div>
        <div className="sidebar-controls">
          <select
            value={currentModel}
            onChange={(e) => setCurrentModel(e.target.value)}
            className="model-selector"
          >
            {availableModels.map(model => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </select>
          <button 
            className="sidebar-close-btn" 
            onClick={onClose}
            title="Close AI Assistant"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="sidebar-content">
        <div className="action-tabs">
          <button 
            className={`action-tab ${activeActionTab === 'quick' ? 'active' : ''}`}
            onClick={() => setActiveActionTab('quick')}
          >
            Quick
          </button>
          <button 
            className={`action-tab ${activeActionTab === 'auto' ? 'active' : ''}`}
            onClick={() => setActiveActionTab('auto')}
          >
            Auto
          </button>
          <button 
            className={`action-tab ${activeActionTab === 'help' ? 'active' : ''}`}
            onClick={() => setActiveActionTab('help')}
          >
            Help
          </button>
        </div>

        <div className="action-content">
          {activeActionTab === 'quick' && (
            <div className="action-grid">
              <button 
                className="grid-action-btn"
                onClick={() => handleQuickAction('summarize')}
                disabled={!currentTab || isLoading}
                title="Summarize current page"
              >
                📄 Summarize
              </button>
              <button 
                className="grid-action-btn"
                onClick={() => handleQuickAction('explain')}
                disabled={!currentTab || isLoading}
                title="Explain page content"
              >
                💡 Explain
              </button>
              <button 
                className="grid-action-btn"
                onClick={() => handleQuickAction('extract')}
                disabled={!currentTab || isLoading}
                title="Extract key data"
              >
                📊 Extract
              </button>
              <button 
                className="grid-action-btn"
                onClick={() => handleQuickAction('translate')}
                disabled={!currentTab || isLoading}
                title="Translate content"
              >
                🌐 Translate
              </button>
              <button 
                className="grid-action-btn"
                onClick={() => handleQuickAction('questions')}
                disabled={!currentTab || isLoading}
                title="Generate questions"
              >
                ❓ Questions
              </button>
              <button 
                className="grid-action-btn"
                onClick={() => handleQuickAction('websearch')}
                disabled={isLoading}
                title="Web search"
              >
                🔍 Search
              </button>
            </div>
          )}

          {activeActionTab === 'auto' && (
            <div className="action-grid">
              <button 
                className="grid-action-btn"
                onClick={() => handleQuickAction('linkedin_jobs')}
                disabled={isLoading}
                title="Apply for jobs on LinkedIn"
              >
                💼 LinkedIn
              </button>
              <button 
                className="grid-action-btn"
                onClick={() => handleQuickAction('fill_form')}
                disabled={isLoading}
                title="Fill out forms automatically"
              >
                📝 Fill Form
              </button>
              <button 
                className="grid-action-btn"
                onClick={() => handleQuickAction('auto_login')}
                disabled={isLoading}
                title="Assist with login"
              >
                🔐 Login
              </button>
              <button 
                className="grid-action-btn"
                onClick={() => handleQuickAction('navigate')}
                disabled={isLoading}
                title="Navigate to websites"
              >
                🌐 Navigate
              </button>
            </div>
          )}

          {activeActionTab === 'help' && (
            <div className="help-content">
              <div className="help-section">
                <h4>💬 Natural Commands</h4>
                <div className="help-examples">
                  <div className="help-example">"search for AI news"</div>
                  <div className="help-example">"apply for jobs on LinkedIn"</div>
                  <div className="help-example">"fill out this form"</div>
                  <div className="help-example">"go to wikipedia.org"</div>
                </div>
              </div>
              <div className="help-section">
                <h4>🤖 What I Can Do</h4>
                <ul className="help-list">
                  <li>Analyze web pages</li>
                  <li>Automate form filling</li>
                  <li>Navigate websites</li>
                  <li>Search the web</li>
                  <li>Extract information</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        <div className="messages-container">
          {error && (
            <div className="message error">
              <div className="message-content" style={{ backgroundColor: '#fee', color: '#c00', border: '1px solid #fcc' }}>
                ❌ {error}
              </div>
            </div>
          )}
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.role}`}>
              <div className="message-content">
                {message.content}
              </div>
              <div className="message-timestamp">
                {new Date(message.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="message assistant">
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <form className="message-input-container" onSubmit={handleSendMessage}>
        <input
          type="text"
          className="message-input"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Try: 'apply for jobs on LinkedIn' or 'fill out this form'"
          disabled={isLoading}
        />
        <button 
          type="submit" 
          className="send-button"
          disabled={!inputMessage.trim() || isLoading}
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
};

export default AISidebar; 