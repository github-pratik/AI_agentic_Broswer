# 🌐 Comet Browser Clone - AI-Powered Browser

A modern browser clone inspired by Comet Browser, built with React and Electron, featuring AI-powered navigation and task automation.

## 🚀 Features

### Core Browser Features
- **Tab Management**: Create, close, and switch between multiple tabs
- **Navigation Bar**: URL input with back/forward/reload controls
- **Bookmark Management**: Save and organize your favorite sites
- **History Tracking**: View and search your browsing history
- **Settings Panel**: Customize your browsing experience

### AI-Powered Features
- **Natural Language Navigation**: "Go to GitHub" or "Search for React tutorials"
- **Page Content Analysis**: Ask questions about the current page
- **Task Automation**: Automate complex multi-step tasks
- **Smart Suggestions**: AI-powered recommendations and shortcuts

### Cross-Platform Support
- **Electron App**: Full desktop browser experience
- **Web Demo**: Browser interface demo for web environments

## 🛠️ Tech Stack

- **Frontend**: React.js with modern hooks and context
- **Desktop**: Electron for cross-platform desktop app
- **AI Integration**: OpenAI GPT, Anthropic Claude, Google Gemini
- **Styling**: CSS3 with modern design patterns
- **State Management**: React Context API

## 🎯 Hackathon Demo

This project demonstrates:
1. **Modern Browser Architecture**: Clean, modular component design
2. **AI Integration**: Seamless AI-powered browsing experience
3. **Cross-Platform Development**: Single codebase for web and desktop
4. **User Experience**: Intuitive interface with powerful features

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18.18.0 or higher (recommended: Node.js 20+)
- **npm** (included with Node.js)
- **Git** (for cloning the repository)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/github-pratik/AI_agentic_Broswer.git
   cd AI_agentic_Broswer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

### Running the Application

#### Option 1: Desktop App (Recommended)
```bash
npm run electron-dev
```
This will start both the React development server and Electron app.

#### Option 2: Web Demo Only
```bash
npm start
```
Visit `http://localhost:3000` to see the browser interface demo.

#### Option 3: Manual Start
```bash
# Terminal 1: Start React development server
npm start

# Terminal 2: Start Electron (after React is running)
npm run electron
```

## 🎨 Demo Features

When running in web mode, you can:
- ✅ Navigate between tabs
- ✅ Use the AI sidebar for natural language commands
- ✅ Manage bookmarks and history
- ✅ Explore settings and customization options
- ✅ See the browser interface in action

## 🤖 AI Capabilities Demo

Try these commands in the AI sidebar:
- "Go to GitHub"
- "Search for React tutorials"
- "What's on this page?"
- "Extract all links from this page"
- "Automate filling out a contact form"

## 📱 Screenshots

The interface includes:
- Modern tab bar with close buttons
- Clean navigation bar with URL input
- AI sidebar with chat interface
- Settings panel with customization options
- Bookmark and history management

## 🔧 Development

The project uses a web adapter pattern to provide a consistent API across Electron and web environments, making it perfect for hackathon demonstrations.

## 🐛 Troubleshooting Guide

### Common Issues and Solutions

#### 1. **Port Already in Use**
**Error:** `Something is already running on port 3000`
**Solution:**
```bash
# Kill existing processes
pkill -f "react-scripts"
pkill -f "electron"

# Or use a different port
PORT=3001 npm start
```

#### 2. **Node.js Version Issues**
**Error:** `EBADENGINE Unsupported engine`
**Solution:**
```bash
# Check your Node.js version
node --version

# Update to Node.js 18+ (recommended: 20+)
# Using nvm (Node Version Manager):
nvm install 20
nvm use 20

# Or download from https://nodejs.org/
```

#### 3. **Electron Installation Issues**
**Error:** `electron: command not found`
**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Or install Electron globally
npm install -g electron
```

#### 4. **React Errors**
**Error:** `Objects are not valid as a React child`
**Solution:**
- This has been fixed in the latest version
- Make sure you're using the latest code from GitHub
- Clear browser cache if running in web mode

#### 5. **AI Sidebar Not Working**
**Issue:** AI commands not responding
**Solution:**
- Check if you have API keys configured in Settings
- Ensure internet connection is working
- Try restarting the application

#### 6. **Desktop App Won't Start**
**Error:** Electron app crashes on startup
**Solution:**
```bash
# Clear Electron cache
rm -rf ~/Library/Application\ Support/ai-browser

# Rebuild the app
npm run electron-dev
```

#### 7. **Permission Issues (macOS)**
**Error:** `Permission denied` or security warnings
**Solution:**
- Go to System Preferences > Security & Privacy
- Allow the application to run
- If using nvm, ensure proper permissions:
```bash
sudo chown -R $(whoami) ~/.nvm
```

#### 8. **Build Issues**
**Error:** `electron-builder` fails
**Solution:**
```bash
# Install build tools
npm install --save-dev electron-builder

# Clear build cache
rm -rf dist/

# Try building again
npm run electron-pack
```

### Performance Issues

#### 1. **Slow Startup**
**Solution:**
- Close other applications to free up memory
- Ensure you have at least 4GB RAM available
- Use SSD storage for better performance

#### 2. **High Memory Usage**
**Solution:**
- Close unused tabs
- Restart the application periodically
- Monitor with Activity Monitor (macOS) or Task Manager (Windows)

## 🐛 Known Bugs and Limitations

### Current Issues

#### 1. **Web Demo Limitations**
- **Issue:** Cannot browse real websites in web mode
- **Workaround:** Use desktop app for full functionality
- **Status:** Working as designed (demo mode)

#### 2. **AI API Key Requirements**
- **Issue:** AI features require API keys
- **Workaround:** Configure API keys in Settings panel
- **Status:** Expected behavior

#### 3. **Page Interaction Errors**
- **Issue:** Some page automation may fail on complex sites
- **Workaround:** Try simpler commands or refresh the page
- **Status:** Known limitation of web automation

#### 4. **Cross-Platform Compatibility**
- **Issue:** Some features may work differently on different OS
- **Workaround:** Test on target platform
- **Status:** Under development

### Browser Compatibility

#### Desktop App (Electron)
- ✅ **macOS** 10.14+ (Mojave and later)
- ✅ **Windows** 10+ (64-bit)
- ✅ **Linux** Ubuntu 18.04+, CentOS 7+

#### Web Demo
- ✅ **Chrome** 90+
- ✅ **Firefox** 88+
- ✅ **Safari** 14+
- ✅ **Edge** 90+

## 🔧 Advanced Configuration

### Environment Variables
Create a `.env` file in the root directory:
```env
# AI API Keys (optional for demo)
OPENAI_API_KEY=your_openai_key_here
GEMINI_API_KEY=your_gemini_key_here
ANTHROPIC_API_KEY=your_anthropic_key_here

# Development settings
REACT_APP_DEBUG=true
ELECTRON_IS_DEV=true
```

### Custom Build Configuration
Edit `package.json` build section for custom distribution:
```json
{
  "build": {
    "appId": "com.yourcompany.aibrowser",
    "productName": "Your AI Browser",
    "directories": {
      "output": "dist"
    }
  }
}
```

## 📦 Building for Distribution

### Create Desktop App Package
```bash
# Build for current platform
npm run electron-pack

# Build for all platforms
npm run electron-pack-all
```

### Distribution Files
Built applications will be in the `dist/` directory:
- **Windows**: `.exe` installer
- **macOS**: `.dmg` disk image
- **Linux**: `.AppImage` or `.deb` package

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Test thoroughly
5. Commit: `git commit -m 'Add amazing feature'`
6. Push: `git push origin feature/amazing-feature`
7. Open a Pull Request

## 📄 License

MIT License - Feel free to use this project for your own hackathon submissions!

## 🆘 Getting Help

### Before Asking for Help
1. Check this troubleshooting guide
2. Search existing issues on GitHub
3. Try the solutions listed above
4. Check the console for error messages

### Creating an Issue
When reporting a bug, please include:
- Operating system and version
- Node.js version (`node --version`)
- npm version (`npm --version`)
- Steps to reproduce the issue
- Console error messages
- Screenshots if applicable

### Community Support
- **GitHub Issues**: Report bugs and request features
- **Discussions**: Ask questions and share ideas
- **Wiki**: Additional documentation and guides

---

**Happy coding! 🚀**