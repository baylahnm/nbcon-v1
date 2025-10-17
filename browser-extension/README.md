# 🛠️ NBCON Cursor Dev Tools - Browser Extension

A comprehensive browser extension for developing and debugging Cursor extensions with integrated DevTools capabilities.

## 📋 Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Development](#development)
- [Extension Architecture](#extension-architecture)
- [Debugging Guide](#debugging-guide)
- [API Reference](#api-reference)
- [Troubleshooting](#troubleshooting)

## ✨ Features

### 🔍 **Debugging Tools**
- **Console Interception** - Capture all console.log, warn, error, and debug messages
- **Error Tracking** - Automatic capture of JavaScript errors and unhandled promise rejections
- **Network Monitoring** - Track fetch and XMLHttpRequest calls with performance metrics
- **Performance Tracking** - Monitor page load times, DOM ready events, and resource counts

### 🎛️ **DevTools Integration**
- **Custom DevTools Panel** - Dedicated panel in Chrome DevTools
- **Elements Sidebar** - NBCON-specific inspector in Elements panel
- **Network Analysis** - Real-time network request monitoring
- **Console Integration** - Enhanced console with filtering and search

### 📊 **Data Management**
- **Log Export** - Export all logs, errors, and metrics to JSON
- **Auto-cleanup** - Automatic removal of old logs (1 hour retention by default)
- **Storage Management** - Efficient Chrome storage usage with size limits
- **Screenshot Capture** - Capture visible tab screenshots

### ⚙️ **Settings & Controls**
- **Toggle Debug Mode** - Enable/disable debugging on the fly
- **Selective Monitoring** - Choose what to track (console, network, performance)
- **Live Updates** - Real-time log streaming to popup and DevTools
- **Cross-tab Support** - Monitor multiple tabs simultaneously

## 🚀 Installation

### Method 1: Load Unpacked (Development)

1. **Open Chrome Extensions Page**
   ```
   chrome://extensions/
   ```

2. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top right

3. **Load Extension**
   - Click "Load unpacked"
   - Navigate to `d:\nbcon-v1\browser-extension`
   - Click "Select Folder"

4. **Verify Installation**
   - You should see "NBCON Cursor Dev Tools" in your extensions
   - Click the extension icon to open the popup

### Method 2: Using npm Scripts

```bash
# From project root
npm run ext:dev
```

## 🎯 Quick Start

### Basic Usage

1. **Open Extension Popup**
   - Click the NBCON extension icon in your toolbar
   - View current status and recent logs

2. **Enable Debug Mode**
   - Click "Toggle Debug Mode" button
   - Green status = Active monitoring

3. **View Logs**
   - Switch between tabs: Console, Errors, Network, Performance
   - Logs auto-refresh every 2 seconds

4. **Open DevTools Panel**
   - Press F12 to open Chrome DevTools
   - Navigate to the "NBCON" tab
   - View advanced debugging information

### Example: Monitoring a Web Page

```javascript
// In your web page console
console.log('Testing NBCON DevTools');
console.error('This will be captured');

fetch('https://api.example.com/data')
  .then(res => res.json())
  .then(data => console.log('Data:', data));

// All of the above will be captured and displayed in the extension
```

## 🔧 Development

### Project Structure

```
browser-extension/
├── manifest.json           # Extension manifest (Chrome Extension v3)
├── background.js           # Service worker (background tasks)
├── content.js             # Content script (injected into pages)
├── popup.html             # Extension popup UI
├── popup.js               # Popup logic and interaction
├── devtools.html          # DevTools entry point
├── devtools.js            # DevTools initialization
├── devtools-panel.html    # Custom DevTools panel UI
├── devtools-panel.js      # DevTools panel logic
├── styles.css             # Global styles
└── icons/                 # Extension icons (to be created)
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

### Creating Icons

You need to create icon files or use the icon generator:

```bash
# Generate icons automatically
npm run ext:icons
```

Or create manually:
- **icon16.png** - 16x16px (toolbar icon)
- **icon48.png** - 48x48px (extension page)
- **icon128.png** - 128x128px (Chrome Web Store)

Place them in `browser-extension/icons/` folder.

### Live Development

1. **Make Changes**
   - Edit any `.js`, `.html`, or `.css` file
   - Save your changes

2. **Reload Extension**
   - Go to `chrome://extensions/`
   - Click the reload icon for NBCON Cursor Dev Tools
   - Or press Ctrl+R on the extensions page

3. **Test Changes**
   - Open a new tab or reload existing tabs
   - Check the popup and DevTools panel

### Debugging the Extension

#### Debugging Background Script

```javascript
// View background script console
chrome://extensions/ → NBCON Cursor Dev Tools → "Service worker"
```

#### Debugging Content Script

```javascript
// In any web page console
console.log('[NBCON DevTools] Content script loaded');
```

#### Debugging Popup

```javascript
// Right-click extension icon → Inspect popup
// Or click "Inspect views: popup.html" on extensions page
```

#### Debugging DevTools Panel

```javascript
// Open DevTools → NBCON tab
// Right-click in panel → Inspect
```

## 🏗️ Extension Architecture

### Component Communication

```
┌─────────────────┐
│  Background.js  │ ← Service Worker (persistent)
│  (Hub)          │
└────────┬────────┘
         │
    ┌────┼────┬────────┐
    ↓    ↓    ↓        ↓
┌────────┐ ┌────────┐ ┌──────────┐ ┌──────────┐
│Content │ │ Popup  │ │ DevTools │ │ DevTools │
│Script  │ │        │ │          │ │  Panel   │
└────────┘ └────────┘ └──────────┘ └──────────┘
    ↓
┌────────┐
│ Web    │
│ Page   │
└────────┘
```

### Message Flow

1. **Content Script → Background**
   ```javascript
   chrome.runtime.sendMessage({
     action: 'captureConsole',
     data: { level: 'log', message: 'Hello' }
   });
   ```

2. **Background → Content Script**
   ```javascript
   chrome.tabs.sendMessage(tabId, {
     action: 'debugModeChanged',
     enabled: true
   });
   ```

3. **Popup ↔ Background**
   ```javascript
   const response = await chrome.runtime.sendMessage({
     action: 'getDebugInfo'
   });
   ```

### Storage Schema

```javascript
{
  // Settings
  debugMode: boolean,
  consoleLogging: boolean,
  networkMonitoring: boolean,
  performanceTracking: boolean,
  
  // Logs (arrays with max 100 items)
  consoleLogs: [{
    level: string,
    message: string,
    url: string,
    tabId: number,
    timestamp: number
  }],
  
  errors: [{
    message: string,
    filename: string,
    lineno: number,
    colno: number,
    stack: string,
    url: string,
    tabId: number,
    timestamp: number
  }],
  
  networkLogs: [{
    url: string,
    method: string,
    status: number,
    duration: number,
    type: 'fetch' | 'xhr',
    error?: string,
    tabId: number,
    timestamp: number
  }],
  
  performanceLogs: [{
    url: string,
    domContentLoaded: number,
    loadComplete: number,
    domInteractive: number,
    firstPaint: number,
    tabId: number,
    timestamp: number
  }]
}
```

## 🐛 Debugging Guide

### Common Issues

#### 1. Extension Not Loading

**Problem:** Extension fails to load or shows errors

**Solution:**
```bash
# Check manifest.json syntax
# Ensure all files exist
# Check Chrome DevTools console for errors
```

#### 2. Content Script Not Injecting

**Problem:** Console interception not working

**Solution:**
```javascript
// Check if content script is loaded
chrome://extensions/ → Details → Allow on all sites
```

#### 3. Popup Not Opening

**Problem:** Clicking icon does nothing

**Solution:**
```javascript
// Check popup.html path in manifest
// Right-click icon → Inspect popup
// Check for JavaScript errors
```

#### 4. DevTools Panel Not Appearing

**Problem:** NBCON tab not in DevTools

**Solution:**
```javascript
// Reload extension
// Close and reopen DevTools (F12)
// Check devtools.html exists
```

### Debug Logging

Enable verbose logging:

```javascript
// In background.js, add at top:
const DEBUG = true;

function log(...args) {
  if (DEBUG) console.log('[NBCON Debug]', ...args);
}
```

### Performance Monitoring

```javascript
// Check extension performance
chrome://extensions/ → Details → Inspect views

// Monitor memory usage
chrome.storage.local.getBytesInUse(null, (bytes) => {
  console.log('Storage used:', bytes, 'bytes');
});
```

## 📚 API Reference

### Background Script API

#### `handleGetDebugInfo(tabId)`
Get current debug information and settings.

```javascript
const response = await chrome.runtime.sendMessage({
  action: 'getDebugInfo'
});
```

#### `handleToggleDebugMode(enabled)`
Enable or disable debug mode.

```javascript
const response = await chrome.runtime.sendMessage({
  action: 'toggleDebugMode',
  enabled: true
});
```

#### `handleCaptureConsole(data, tabId)`
Capture console output.

```javascript
chrome.runtime.sendMessage({
  action: 'captureConsole',
  data: {
    level: 'log',
    message: 'Hello World',
    url: window.location.href
  }
});
```

### Content Script API

The content script automatically intercepts:
- Console methods (log, info, warn, error, debug)
- Window errors
- Unhandled promise rejections
- Fetch and XMLHttpRequest calls
- Performance metrics

### Storage API

```javascript
// Get settings
const settings = await chrome.storage.local.get([
  'debugMode',
  'consoleLogging',
  'networkMonitoring',
  'performanceTracking'
]);

// Update settings
await chrome.storage.local.set({
  debugMode: true,
  consoleLogging: true
});

// Get logs
const logs = await chrome.storage.local.get([
  'consoleLogs',
  'errors',
  'networkLogs',
  'performanceLogs'
]);
```

## 🔧 Troubleshooting

### Extension Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Can't load extension | Invalid manifest | Check manifest.json syntax |
| Console not intercepted | Content script blocked | Check site permissions |
| No network logs | Monitoring disabled | Enable in settings |
| High memory usage | Too many logs | Clear logs or reduce retention |
| DevTools not opening | Permission issue | Check devtools permission |

### Performance Tips

1. **Reduce Log Retention**
   ```javascript
   // Modify background.js cleanup interval
   setInterval(() => { /* cleanup */ }, 30 * 60 * 1000); // 30 min
   ```

2. **Disable Unused Features**
   - Turn off network monitoring if not needed
   - Disable performance tracking for better speed
   - Clear logs regularly

3. **Optimize Storage**
   ```javascript
   // Limit log array sizes in background.js
   const MAX_LOGS = 50; // Instead of 100
   ```

### Getting Help

- **Check Console**: F12 → Console for errors
- **Extension Page**: chrome://extensions/ for details
- **Service Worker**: Click "Service worker" link for background logs
- **GitHub Issues**: Report bugs with console output

## 📝 License

MIT License - See LICENSE file for details

## 👥 Contributing

1. Fork the repository
2. Create feature branch
3. Make your changes
4. Test thoroughly
5. Submit pull request

## 🚀 Future Enhancements

- [ ] Advanced filtering and search
- [ ] Log persistence across sessions
- [ ] Custom log formats
- [ ] Integration with external logging services
- [ ] Visual performance profiling
- [ ] Network waterfall view
- [ ] Redux/Zustand state inspection
- [ ] React component tree viewer

---

**Version:** 1.0.0  
**Last Updated:** October 17, 2025  
**Maintainer:** NBCON Development Team

