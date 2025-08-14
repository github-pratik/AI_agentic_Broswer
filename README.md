# 🚀 AI-Powered Browser

A next-generation cross-platform browser built with **Electron** and **React**, featuring an integrated AI assistant that revolutionizes web browsing with intelligent automation, content analysis, and natural language interactions.

![AI Browser](https://img.shields.io/badge/AI-Powered-blue) ![Electron](https://img.shields.io/badge/Electron-Cross--Platform-green) ![React](https://img.shields.io/badge/React-UI-blue) ![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Key Features

### 🤖 **Advanced AI Integration**
- **Multi-Provider Support**: OpenAI GPT-4, Google Gemini, OpenRouter, and more
- **Natural Language Commands**: "Search for jobs on LinkedIn", "Summarize this article"
- **Intelligent Content Extraction**: Automatically extract key information from any webpage
- **Context-Aware Responses**: AI understands current page content for better assistance
- **Smart Page Analysis**: Get insights, summaries, and actionable information instantly

### 🌐 **Powerful Browser Features**
- **Modern Tab Management**: Intuitive tab system with easy navigation
- **Advanced Navigation**: Back, forward, refresh with smart URL handling
- **Comprehensive Bookmarks**: Organize with folders, tags, and smart search
- **Detailed History**: Track, search, and analyze your browsing patterns
- **Privacy-First Design**: All data stored locally, no tracking

### 🔧 **Automation & Productivity**
- **Web Task Automation**: Automate form filling, job applications, and workflows
- **Page Interaction**: Click buttons, fill forms, and navigate pages via AI commands
- **Complex Workflows**: Multi-step automation for repetitive tasks
- **Smart Element Detection**: AI finds and interacts with page elements intelligently

### 🎯 **User Experience**
- **Clean, Modern Interface**: Intuitive design with customizable layouts
- **Responsive Design**: Optimized for different screen sizes
- **Dark/Light Themes**: Comfortable viewing in any environment
- **Keyboard Shortcuts**: Power user features for efficiency

## 🛠 Tech Stack

### **Frontend**
- **React 18** - Modern UI framework with hooks and context
- **React Router** - Client-side routing and navigation
- **Lucide React** - Beautiful, customizable icons
- **CSS3** - Modern styling with flexbox and grid

### **Backend/Desktop**
- **Electron** - Cross-platform desktop application framework
- **Node.js** - JavaScript runtime for desktop integration
- **IPC Communication** - Secure communication between processes

### **AI Integration**
- **OpenAI API** - GPT-4, GPT-3.5-turbo models
- **Google Gemini API** - Latest Gemini models including 2.0 Flash
- **OpenRouter** - Access to Claude, Llama, and other models
- **Custom AI Context** - Intelligent prompt engineering

### **Development Tools**
- **Concurrently** - Run multiple processes simultaneously
- **Electron Builder** - Package and distribute desktop apps
- **Wait-on** - Synchronize development processes

## 🚀 Quick Start

### Prerequisites
- **Node.js** 16+ ([Download](https://nodejs.org/))
- **npm** (included with Node.js)
- **Git** ([Download](https://git-scm.com/))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/ai-browser.git
   cd ai-browser
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development environment**
   ```bash
   npm run electron-dev
   ```

### Alternative Start Methods

**Option 1: Using the start script**
```bash
chmod +x start-dev.sh
./start-dev.sh
```

**Option 2: Manual start**
```bash
# Terminal 1: Start React development server
npm start

# Terminal 2: Start Electron (after React is running)
npm run electron
```

## ⚙️ Configuration

### 🔑 **API Keys Setup**

1. **OpenAI** (Recommended)
   - Visit [OpenAI API Keys](https://platform.openai.com/api-keys)
   - Create a new API key
   - Add to Settings → AI Assistant → OpenAI API Key

2. **Google Gemini** (Free tier available)
   - Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Generate API key
   - Add to Settings → AI Assistant → Gemini API Key

3. **OpenRouter** (Access to multiple models)
   - Visit [OpenRouter](https://openrouter.ai/keys)
   - Create account and generate key
   - Add to Settings → AI Assistant → OpenRouter API Key

### 🎛 **Available AI Models**

#### **OpenAI Models**
- **GPT-4** - Most capable, best for complex reasoning
- **GPT-3.5 Turbo** - Fast and efficient for most tasks

#### **Google Gemini Models**
- **Gemini 2.0 Flash (Experimental)** - Latest cutting-edge model
- **Gemini 1.5 Pro** - Advanced reasoning and analysis
- **Gemini 1.5 Flash** - Fast multimodal processing
- **Gemini 1.5 Flash-8B** - Most cost-efficient option

#### **OpenRouter Models**
- **Claude 3 Opus** - Anthropic's most capable model
- **Claude 3 Sonnet** - Balanced performance and speed
- **Llama 2 70B** - Open-source alternative

## 📖 Usage Guide

### 🌐 **Basic Browsing**

1. **Navigation**
   - Enter URLs or search terms in the address bar
   - Use back/forward buttons for navigation
   - Refresh pages with the reload button

2. **Tab Management**
   - Click "+" to open new tabs
   - Switch between tabs by clicking them
   - Close tabs with the "×" button

### 🤖 **AI Assistant**

1. **Open AI Sidebar**
   - Click the AI button (🤖) in the navigation bar
   - Choose from quick action categories

2. **Natural Language Commands**
   ```
   "What's on this page?"
   "Summarize this article"
   "Search for software engineer jobs"
   "Click the first search result"
   "Fill out this form with my information"
   ```

3. **Page Analysis**
   - **Summarize**: Get key points from any webpage
   - **Extract Data**: Pull specific information
   - **Translate**: Convert content to different languages
   - **Generate Questions**: Create study questions from content

### 🔧 **Advanced Features**

1. **Task Automation**
   - Create workflows for repetitive tasks
   - Automate job applications on LinkedIn
   - Fill forms automatically
   - Navigate complex websites

2. **Data Management**
   - Export/import bookmarks and history
   - Search through browsing history
   - Organize bookmarks in folders
   - Clear data for privacy

## 📁 Project Structure

```
ai-browser/
├── 📁 public/                    # Static assets and Electron main process
│   ├── electron.js              # Main Electron process with BrowserView
│   ├── preload.js               # Secure IPC communication bridge
│   └── index.html               # Application entry point
├── 📁 src/                      # React application source
│   ├── 📁 components/           # React components
│   │   ├── BrowserWindow.js     # Main browser interface
│   │   ├── TabBar.js           # Tab management component
│   │   ├── NavigationBar.js    # Address bar and navigation
│   │   ├── AISidebar.js        # AI assistant interface
│   │   ├── Settings.js         # Configuration panel
│   │   ├── HistoryManager.js   # Browsing history management
│   │   ├── BookmarkManager.js  # Bookmark organization
│   │   └── TaskAutomation.js   # Workflow automation
│   ├── 📁 contexts/            # React context providers
│   │   ├── BrowserContext.js   # Browser state management
│   │   └── AIContext.js        # AI integration and API calls
│   ├── 📁 styles/              # CSS stylesheets
│   ├── App.js                  # Main application component
│   └── index.js                # React application entry
├── 📄 package.json             # Dependencies and scripts
├── 📄 start-dev.sh            # Development startup script
└── 📄 README.md               # This documentation
```

## 🎨 **Key Components Explained**

### **AIContext.js** - AI Integration Hub
- Multi-provider API management
- Natural language command processing
- Page content analysis and extraction
- Browser action execution (click, fill, navigate)

### **BrowserContext.js** - Browser State Management
- Tab and navigation state
- History and bookmark management
- Settings and preferences
- Local data storage

### **electron.js** - Desktop Integration
- BrowserView management for web content
- Page interaction capabilities
- Secure IPC communication
- Cross-platform desktop features

## 🔒 Privacy & Security

### **Data Protection**
- ✅ **Local Storage Only** - All data stays on your device
- ✅ **No Tracking** - Zero telemetry or analytics
- ✅ **Encrypted API Keys** - Secure credential storage
- ✅ **Incognito Mode** - Private browsing option

### **Security Features**
- **Context Isolation** - Secure Electron configuration
- **Content Security Policy** - Protection against XSS
- **Sandboxed Processes** - Isolated execution environments
- **Secure IPC** - Protected inter-process communication

## 🐛 Troubleshooting

### **Common Issues**

#### **Application Won't Start**
```bash
# Clear dependencies and reinstall
rm -rf node_modules package-lock.json
npm install
npm run electron-dev
```

#### **AI Assistant Not Responding**
1. Check API key configuration in Settings
2. Verify internet connection
3. Ensure API provider has sufficient credits
4. Try switching to a different AI model

#### **Page Interactions Failing**
1. Wait for page to fully load
2. Try refreshing the page
3. Use "show page elements" command to see available options
4. Check browser console for detailed error messages

#### **Build Issues**
```bash
# For development issues
npm start  # Ensure React dev server starts
npm run electron  # Then start Electron

# For production builds
npm run build
npm run electron-pack
```

### **Debug Mode**
Enable detailed logging by opening Developer Tools:
- **macOS**: `Cmd + Option + I`
- **Windows/Linux**: `Ctrl + Shift + I`

## 🚀 Building for Production

### **Create Distributable Package**
```bash
# Build React application
npm run build

# Package for current platform
npm run electron-pack

# Package for all platforms (requires additional setup)
npm run electron-pack-all
```

### **Distribution Files**
Built applications will be in the `dist/` directory:
- **Windows**: `.exe` installer
- **macOS**: `.dmg` disk image
- **Linux**: `.AppImage` or `.deb` package

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### **Development Setup**
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Test thoroughly
5. Commit: `git commit -m 'Add amazing feature'`
6. Push: `git push origin feature/amazing-feature`
7. Open a Pull Request

### **Contribution Guidelines**
- Follow existing code style and patterns
- Add tests for new features
- Update documentation as needed
- Ensure cross-platform compatibility

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

### **Technologies**
- [Electron](https://electronjs.org/) - Cross-platform desktop apps
- [React](https://reactjs.org/) - User interface framework
- [OpenAI](https://openai.com/) - AI model integration
- [Google AI](https://ai.google.dev/) - Gemini model access
- [Lucide](https://lucide.dev/) - Beautiful icon library

### **Inspiration**
Built to bridge the gap between traditional browsing and AI-powered productivity, making the web more intelligent and accessible.

---

## 🌟 **Star this project if you find it useful!**

**Made with ❤️ by developers who believe in the power of AI-enhanced browsing**

---

*For support, questions, or feature requests, please [open an issue](../../issues) or [start a discussion](../../discussions).*