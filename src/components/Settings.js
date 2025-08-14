import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Save,
  Key,
  Shield,
  Globe,
  Database,
  Trash2,
  Download,
  Upload,
  Eye,
  EyeOff,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAI } from "../contexts/AIContext";
import { useBrowser } from "../contexts/BrowserContext";
import "./Settings.css";

const Settings = () => {
  const navigate = useNavigate();
  const {
    currentModel,
    availableModels,
    apiKeys,
    saveSettings,
    getProviderForModel,
  } = useAI();

  const {
    settings,
    updateSettings,
    clearHistory,
    exportBookmarks,
    exportHistory,
    importBookmarks,
    history,
    bookmarks,
  } = useBrowser();

  const [localApiKeys, setLocalApiKeys] = useState(
    apiKeys || { openai: "", gemini: "", openrouter: "" }
  );
  const [localModel, setLocalModel] = useState(currentModel || "gpt-4");
  const [localSettings, setLocalSettings] = useState(settings);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");
  const [showApiKeys, setShowApiKeys] = useState({
    openai: false,
    gemini: false,
    openrouter: false,
  });
  const [activeTab, setActiveTab] = useState("ai");

  useEffect(() => {
    console.log("Settings useEffect called with:");
    console.log("apiKeys from context:", apiKeys);
    console.log("currentModel from context:", currentModel);
    console.log("settings from context:", settings);
    
    setLocalApiKeys(apiKeys || { openai: "", gemini: "", openrouter: "" });
    setLocalModel(currentModel || "gpt-4");
    setLocalSettings(settings);
  }, [apiKeys, currentModel, settings]);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus("");

    console.log("Settings handleSave called with:");
    console.log("localModel:", localModel);
    console.log("localApiKeys:", localApiKeys);

    // Manual test - let's try saving directly to localStorage
    console.log("Testing direct localStorage save...");
    localStorage.setItem('test-gemini-key', localApiKeys.gemini);
    const testRead = localStorage.getItem('test-gemini-key');
    console.log("Direct localStorage test - saved and read back:", testRead);

    try {
      await saveSettings(localModel, localApiKeys);
      updateSettings(localSettings);
      setSaveStatus("Settings saved successfully!");
      setTimeout(() => setSaveStatus(""), 3000);
    } catch (error) {
      console.error("Error saving settings:", error);
      setSaveStatus("Error saving settings: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const getCurrentProvider = () => {
    return getProviderForModel(localModel);
  };

  const getProviderName = (provider) => {
    switch (provider) {
      case "openai":
        return "OpenAI";
      case "gemini":
        return "Google Gemini";
      case "openrouter":
        return "OpenRouter";
      default:
        return provider;
    }
  };

  const getApiKeyPlaceholder = (provider) => {
    switch (provider) {
      case "openai":
        return "sk-...";
      case "gemini":
        return "AIza... (Google AI Studio API key)";
      case "openrouter":
        return "sk-or-...";
      default:
        return "Enter API key";
    }
  };

  const getApiKeyInstructions = (provider) => {
    switch (provider) {
      case "openai":
        return "Get your API key from https://platform.openai.com/api-keys";
      case "gemini":
        return "Get your API key from Google AI Studio: https://aistudio.google.com/app/apikey";
      case "openrouter":
        return "Get your API key from https://openrouter.ai/keys";
      default:
        return "Enter your API key for this provider";
    }
  };

  const handleClearHistory = () => {
    if (
      window.confirm(
        "Are you sure you want to clear all browsing history? This action cannot be undone."
      )
    ) {
      clearHistory();
      setSaveStatus("History cleared successfully!");
      setTimeout(() => setSaveStatus(""), 3000);
    }
  };

  const handleExportData = (type) => {
    try {
      let data, filename;
      if (type === "bookmarks") {
        data = exportBookmarks();
        filename = `bookmarks-${new Date().toISOString().split("T")[0]}.json`;
      } else if (type === "history") {
        data = exportHistory();
        filename = `history-${new Date().toISOString().split("T")[0]}.json`;
      }

      const blob = new Blob([data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setSaveStatus(`${type} exported successfully!`);
      setTimeout(() => setSaveStatus(""), 3000);
    } catch (error) {
      setSaveStatus(`Error exporting ${type}: ` + error.message);
    }
  };

  const handleImportBookmarks = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const success = importBookmarks(e.target.result);
        if (success) {
          setSaveStatus("Bookmarks imported successfully!");
        } else {
          setSaveStatus(
            "Error importing bookmarks. Please check the file format."
          );
        }
        setTimeout(() => setSaveStatus(""), 3000);
      } catch (error) {
        setSaveStatus("Error importing bookmarks: " + error.message);
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  const handleBack = () => {
    navigate("/");
  };

  const getModelInfo = (modelId) => {
    const model = availableModels.find((m) => m.id === modelId);
    return model || { name: "Unknown", description: "Unknown model" };
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <button className="back-button" onClick={handleBack}>
          <ArrowLeft size={20} />
          Back to Browser
        </button>
        <h1>Settings</h1>
      </div>

      <div className="settings-tabs">
        <button
          className={`tab-button ${activeTab === "ai" ? "active" : ""}`}
          onClick={() => setActiveTab("ai")}
        >
          <Key size={16} />
          AI Assistant
        </button>
        <button
          className={`tab-button ${activeTab === "browser" ? "active" : ""}`}
          onClick={() => setActiveTab("browser")}
        >
          <Globe size={16} />
          Browser
        </button>
        <button
          className={`tab-button ${activeTab === "privacy" ? "active" : ""}`}
          onClick={() => setActiveTab("privacy")}
        >
          <Shield size={16} />
          Privacy
        </button>
        <button
          className={`tab-button ${activeTab === "data" ? "active" : ""}`}
          onClick={() => setActiveTab("data")}
        >
          <Database size={16} />
          Data
        </button>
      </div>

      <div className="settings-content">
        {activeTab === "ai" && (
          <>
            <div className="settings-section">
              <h2>AI Assistant Configuration</h2>

              <div className="setting-group">
                <label htmlFor="model-select">AI Model</label>
                <select
                  id="model-select"
                  value={localModel}
                  onChange={(e) => setLocalModel(e.target.value)}
                  className="setting-input"
                >
                  <optgroup label="OpenAI">
                    {availableModels
                      .filter((m) => m.provider === "openai")
                      .map((model) => (
                        <option key={model.id} value={model.id}>
                          {model.name}
                        </option>
                      ))}
                  </optgroup>
                  <optgroup label="Google Gemini">
                    {availableModels
                      .filter((m) => m.provider === "gemini")
                      .map((model) => (
                        <option key={model.id} value={model.id}>
                          {model.name}
                        </option>
                      ))}
                  </optgroup>
                  <optgroup label="OpenRouter">
                    {availableModels
                      .filter((m) => m.provider === "openrouter")
                      .map((model) => (
                        <option key={model.id} value={model.id}>
                          {model.name}
                        </option>
                      ))}
                  </optgroup>
                  <optgroup label="Open Source">
                    {availableModels
                      .filter((m) => m.provider === "huggingface")
                      .map((model) => (
                        <option key={model.id} value={model.id}>
                          {model.name}
                        </option>
                      ))}
                  </optgroup>
                </select>
                <p className="setting-description">
                  {getModelInfo(localModel).description}
                </p>
              </div>

              <div className="api-keys-section">
                <h3>API Keys</h3>
                <p className="setting-description">
                  Configure API keys for different AI providers. Only the key
                  for your selected model is required.
                </p>

                {/* OpenAI API Key */}
                <div className="setting-group">
                  <label htmlFor="openai-key">
                    OpenAI API Key
                    {getCurrentProvider() === "openai" && (
                      <span className="required-indicator">
                        {" "}
                        (Required for selected model)
                      </span>
                    )}
                  </label>
                  <div className="api-key-container">
                    <input
                      id="openai-key"
                      type={showApiKeys.openai ? "text" : "password"}
                      value={localApiKeys.openai}
                      onChange={(e) =>
                        setLocalApiKeys({
                          ...localApiKeys,
                          openai: e.target.value,
                        })
                      }
                      placeholder={getApiKeyPlaceholder("openai")}
                      className="setting-input"
                    />
                    <button
                      type="button"
                      className="api-key-toggle"
                      onClick={() =>
                        setShowApiKeys({
                          ...showApiKeys,
                          openai: !showApiKeys.openai,
                        })
                      }
                    >
                      {showApiKeys.openai ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>
                  <p className="setting-description">
                    {getApiKeyInstructions("openai")}
                  </p>
                </div>

                {/* Gemini API Key */}
                <div className="setting-group">
                  <label htmlFor="gemini-key">
                    Google Gemini API Key
                    {getCurrentProvider() === "gemini" && (
                      <span className="required-indicator">
                        {" "}
                        (Required for selected model)
                      </span>
                    )}
                  </label>
                  <div className="api-key-container">
                    <input
                      id="gemini-key"
                      type={showApiKeys.gemini ? "text" : "password"}
                      value={localApiKeys.gemini}
                      onChange={(e) =>
                        setLocalApiKeys({
                          ...localApiKeys,
                          gemini: e.target.value,
                        })
                      }
                      placeholder={getApiKeyPlaceholder("gemini")}
                      className="setting-input"
                    />
                    <button
                      type="button"
                      className="api-key-toggle"
                      onClick={() =>
                        setShowApiKeys({
                          ...showApiKeys,
                          gemini: !showApiKeys.gemini,
                        })
                      }
                    >
                      {showApiKeys.gemini ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>
                  <p className="setting-description">
                    {getApiKeyInstructions("gemini")}
                  </p>
                  {/* Debug button - remove in production */}
                  <button 
                    type="button"
                    onClick={() => {
                      console.log("=== DEBUG INFO ===");
                      console.log("Current localApiKeys:", localApiKeys);
                      console.log("Current apiKeys from context:", apiKeys);
                      console.log("Current model:", localModel);
                      console.log("localStorage gemini key:", localStorage.getItem('ai-api-key-gemini'));
                      console.log("All localStorage AI keys:");
                      console.log("- openai:", localStorage.getItem('ai-api-key-openai'));
                      console.log("- gemini:", localStorage.getItem('ai-api-key-gemini'));
                      console.log("- openrouter:", localStorage.getItem('ai-api-key-openrouter'));
                    }}
                    style={{ 
                      padding: '4px 8px', 
                      fontSize: '12px', 
                      background: '#007bff', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '4px',
                      marginTop: '8px'
                    }}
                  >
                    Debug Info
                  </button>
                </div>

                {/* OpenRouter API Key */}
                <div className="setting-group">
                  <label htmlFor="openrouter-key">
                    OpenRouter API Key
                    {getCurrentProvider() === "openrouter" && (
                      <span className="required-indicator">
                        {" "}
                        (Required for selected model)
                      </span>
                    )}
                  </label>
                  <div className="api-key-container">
                    <input
                      id="openrouter-key"
                      type={showApiKeys.openrouter ? "text" : "password"}
                      value={localApiKeys.openrouter}
                      onChange={(e) =>
                        setLocalApiKeys({
                          ...localApiKeys,
                          openrouter: e.target.value,
                        })
                      }
                      placeholder={getApiKeyPlaceholder("openrouter")}
                      className="setting-input"
                    />
                    <button
                      type="button"
                      className="api-key-toggle"
                      onClick={() =>
                        setShowApiKeys({
                          ...showApiKeys,
                          openrouter: !showApiKeys.openrouter,
                        })
                      }
                    >
                      {showApiKeys.openrouter ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>
                  <p className="setting-description">
                    {getApiKeyInstructions("openrouter")}
                  </p>
                </div>
              </div>

              <div className="model-info">
                <h3>{getModelInfo(localModel).name}</h3>
                <p>{getModelInfo(localModel).description}</p>
                <div className="provider-info">
                  <h4>Provider: {getProviderName(getCurrentProvider())}</h4>
                </div>
                <div className="model-features">
                  <h4>Capabilities:</h4>
                  <ul>
                    <li>Web content summarization and analysis</li>
                    <li>Natural language question answering</li>
                    <li>AI-powered web search and research</li>
                    <li>Task automation and form filling</li>
                    <li>Content translation and extraction</li>
                    <li>Tab and session management</li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "browser" && (
          <div className="settings-section">
            <h2>Browser Configuration</h2>

            <div className="setting-group">
              <label htmlFor="homepage">Homepage</label>
              <input
                id="homepage"
                type="url"
                value={localSettings.homepage}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    homepage: e.target.value,
                  })
                }
                className="setting-input"
                placeholder="https://www.google.com"
              />
            </div>

            <div className="setting-group">
              <label htmlFor="search-engine">Default Search Engine</label>
              <select
                id="search-engine"
                value={localSettings.defaultSearchEngine}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    defaultSearchEngine: e.target.value,
                  })
                }
                className="setting-input"
              >
                <option value="https://www.google.com/search?q=">Google</option>
                <option value="https://www.bing.com/search?q=">Bing</option>
                <option value="https://duckduckgo.com/?q=">DuckDuckGo</option>
                <option value="https://search.yahoo.com/search?p=">
                  Yahoo
                </option>
              </select>
            </div>

            <div className="setting-group">
              <label>
                <input
                  type="checkbox"
                  checked={localSettings.autoSaveHistory}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      autoSaveHistory: e.target.checked,
                    })
                  }
                />
                Automatically save browsing history
              </label>
            </div>

            <div className="setting-group">
              <label htmlFor="max-history">Maximum History Items</label>
              <input
                id="max-history"
                type="number"
                min="100"
                max="10000"
                value={localSettings.maxHistoryItems}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    maxHistoryItems: parseInt(e.target.value),
                  })
                }
                className="setting-input"
              />
            </div>
          </div>
        )}

        {activeTab === "privacy" && (
          <div className="settings-section">
            <h2>Privacy & Security</h2>

            <div className="setting-group">
              <label>
                <input
                  type="checkbox"
                  checked={localSettings.incognitoMode}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      incognitoMode: e.target.checked,
                    })
                  }
                />
                Enable incognito mode by default
              </label>
              <p className="setting-description">
                In incognito mode, browsing history and data are not saved.
              </p>
            </div>

            <div className="privacy-info">
              <div className="privacy-item">
                <Shield size={20} />
                <div>
                  <h4>Local Storage</h4>
                  <p>
                    All your data is stored locally on your device and never
                    sent to external servers.
                  </p>
                </div>
              </div>

              <div className="privacy-item">
                <Eye size={20} />
                <div>
                  <h4>No Tracking</h4>
                  <p>
                    We do not track your browsing behavior or collect any
                    personal information.
                  </p>
                </div>
              </div>

              <div className="privacy-item">
                <Key size={20} />
                <div>
                  <h4>Secure API</h4>
                  <p>
                    API keys are encrypted and stored securely on your local
                    machine.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "data" && (
          <div className="settings-section">
            <h2>Data Management</h2>

            <div className="data-stats">
              <div className="stat-item">
                <h4>History Items</h4>
                <span>{history.length}</span>
              </div>
              <div className="stat-item">
                <h4>Bookmarks</h4>
                <span>{bookmarks.length}</span>
              </div>
            </div>

            <div className="setting-group">
              <h3>Export Data</h3>
              <div className="button-group">
                <button
                  className="action-button"
                  onClick={() => handleExportData("bookmarks")}
                >
                  <Download size={16} />
                  Export Bookmarks
                </button>
                <button
                  className="action-button"
                  onClick={() => handleExportData("history")}
                >
                  <Download size={16} />
                  Export History
                </button>
              </div>
            </div>

            <div className="setting-group">
              <h3>Import Data</h3>
              <div className="button-group">
                <label className="action-button">
                  <Upload size={16} />
                  Import Bookmarks
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportBookmarks}
                    style={{ display: "none" }}
                  />
                </label>
              </div>
            </div>

            <div className="setting-group">
              <h3>Clear Data</h3>
              <div className="button-group">
                <button
                  className="action-button danger"
                  onClick={handleClearHistory}
                >
                  <Trash2 size={16} />
                  Clear History
                </button>
              </div>
              <p className="setting-description">
                This will permanently delete all browsing history. This action
                cannot be undone.
              </p>
            </div>
          </div>
        )}

        <div className="setting-actions">
          <button
            className="save-button"
            onClick={handleSave}
            disabled={
              isSaving ||
              (activeTab === "ai" &&
                getCurrentProvider() !== "huggingface" &&
                !localApiKeys[getCurrentProvider()]?.trim())
            }
          >
            {isSaving ? "Saving..." : "Save Settings"}
            <Save size={16} />
          </button>
          {saveStatus && (
            <div
              className={`save-status ${
                saveStatus.includes("Error") ? "error" : "success"
              }`}
            >
              {saveStatus}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
