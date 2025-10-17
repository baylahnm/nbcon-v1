# 🌐 Browser Tools MCP Guide

## Available Browser MCP Servers

Your Cursor setup now includes **3 powerful browser automation tools**:

### 1️⃣ **Chrome DevTools MCP**
- **Purpose**: Direct access to Chrome DevTools Protocol
- **Capabilities**:
  - Inspect DOM elements
  - Execute JavaScript in browser context
  - Monitor network requests
  - View console logs
  - Debug running applications
  
**Example Usage**:
```
"Open Chrome DevTools and inspect the Network tab"
"Execute this JavaScript in the browser console: console.log('test')"
"Show me the DOM structure of the current page"
```

### 2️⃣ **Puppeteer MCP** 
- **Purpose**: Full browser automation and control
- **Capabilities**:
  - Open and navigate web pages
  - Click buttons and fill forms
  - Take screenshots
  - Generate PDFs
  - Scrape content
  - Test web applications
  - Automate workflows
  
**Example Usage**:
```
"Open https://example.com and take a screenshot"
"Navigate to the login page and fill in the form"
"Click the submit button and wait for navigation"
"Extract all links from the current page"
"Generate a PDF of the current page"
```

### 3️⃣ **Browser Automation MCP**
- **Purpose**: Advanced browser interactions with AI
- **Capabilities**:
  - Natural language browser control
  - Complex multi-step workflows
  - Visual element recognition
  - Form automation
  - Data extraction
  - Testing automation
  
**Example Usage**:
```
"Go to Google, search for 'NBCON', and click the first result"
"Fill out the registration form with test data"
"Navigate through the checkout process"
"Find all buttons with 'Submit' text and click the first one"
```

## 🚀 How to Use

### Restart Cursor
After updating the MCP configuration, **restart Cursor** to load the new tools:

1. Close Cursor completely
2. Reopen Cursor
3. The AI will now have access to browser control tools

### Test the Tools

**Test Chrome DevTools**:
```
@chrome-devtools Open DevTools and show me the console
```

**Test Puppeteer**:
```
@puppeteer Open a browser window and navigate to localhost:5173
```

**Test Browser Automation**:
```
@browser-automation Open my NBCON app and show me the dashboard
```

## 🎯 Common Use Cases

### 1. **Debug Your NBCON App**
```
"Open localhost:5173 in browser and check for console errors"
"Navigate to the dashboard and take a screenshot"
"Inspect the network requests when loading the page"
```

### 2. **Test Features**
```
"Open the login page, enter credentials, and click login"
"Test the registration flow from start to finish"
"Click through all navigation menu items and verify they load"
```

### 3. **Visual Testing**
```
"Take screenshots of all main pages"
"Compare the mobile vs desktop layout"
"Verify all buttons are visible and clickable"
```

### 4. **Data Extraction**
```
"Extract all form field names from the registration page"
"Get all API endpoints called on page load"
"List all images and their src URLs"
```

### 5. **Performance Testing**
```
"Measure page load time for the dashboard"
"Check network waterfall for slow requests"
"Identify render-blocking resources"
```

## 📋 Configuration Details

### Puppeteer Options
Edit `.cursor/mcp.json` to customize:

```json
"puppeteer": {
  "command": "npx",
  "args": [
    "-y",
    "@modelcontextprotocol/server-puppeteer"
  ],
  "env": {
    "PUPPETEER_HEADLESS": "false",  // Show browser window
    "PUPPETEER_SLOWMO": "50"        // Slow down actions (ms)
  }
}
```

### Browser Automation Options
```json
"browser-automation": {
  "env": {
    "BROWSER_HEADLESS": "false",     // Show browser
    "BROWSER_TIMEOUT": "30000",      // Page load timeout
    "BROWSER_VIEWPORT_WIDTH": "1920", // Window width
    "BROWSER_VIEWPORT_HEIGHT": "1080" // Window height
  }
}
```

## 🛠️ Troubleshooting

### MCP Server Not Available
**Problem**: AI doesn't respond to browser commands

**Solution**:
1. Restart Cursor completely
2. Check Windows Defender/Firewall isn't blocking npx
3. Verify Node.js is installed: `node --version`
4. Manually test: `npx -y @modelcontextprotocol/server-puppeteer`

### Browser Doesn't Open
**Problem**: Commands execute but no browser window appears

**Solution**:
1. Set `BROWSER_HEADLESS: "false"` in mcp.json
2. Ensure Chrome is installed
3. Check if Chrome is already running
4. Try closing all Chrome instances first

### Connection Timeouts
**Problem**: Browser commands timeout

**Solution**:
1. Increase timeout in env config
2. Check internet connection
3. Try simpler commands first
4. Verify localhost apps are running

### Permission Errors
**Problem**: Access denied errors

**Solution**:
1. Run Cursor as Administrator (right-click → Run as Admin)
2. Check antivirus isn't blocking browser automation
3. Whitelist npx and chrome in security settings

## 💡 Pro Tips

1. **Use with NBCON Development**:
   ```
   "Open localhost:5173, login as engineer, navigate to jobs page, and take screenshot"
   ```

2. **Automated Testing**:
   ```
   "Test the complete user registration flow and report any errors"
   ```

3. **Debug Production Issues**:
   ```
   "Open production site, reproduce the bug, and capture the console errors"
   ```

4. **Screenshot Documentation**:
   ```
   "Take screenshots of all dashboard pages for documentation"
   ```

5. **Performance Monitoring**:
   ```
   "Open the app, measure load times, and identify bottlenecks"
   ```

## 🔗 Official Documentation

- **Chrome DevTools Protocol**: https://chromedevtools.github.io/devtools-protocol/
- **Puppeteer**: https://pptr.dev/
- **MCP Specification**: https://modelcontextprotocol.io/

## 🎓 Next Steps

1. **Restart Cursor** to activate the new tools
2. **Test each tool** with simple commands
3. **Integrate with your workflow** for debugging
4. **Automate repetitive tasks** with browser automation
5. **Create testing scripts** for NBCON features

---

**Ready to Use!** Just restart Cursor and start commanding the browser through AI! 🚀

