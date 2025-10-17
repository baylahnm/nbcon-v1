# 🚀 Quick Start Guide - NBCON Cursor Dev Tools

## 5-Minute Setup

### Step 1: Load the Extension (2 minutes)

1. **Open Chrome Extensions**
   - Navigate to: `chrome://extensions/`
   - Or: Menu → More Tools → Extensions

2. **Enable Developer Mode**
   - Toggle the switch in the top-right corner

3. **Load Unpacked Extension**
   - Click "Load unpacked" button
   - Browse to: `D:\nbcon-v1\browser-extension`
   - Click "Select Folder"

4. **Verify Installation**
   - You should see "NBCON Cursor Dev Tools" card
   - Status should show "Enabled"

### Step 2: Create Icons (1 minute)

**Important:** The extension needs icon files to work properly.

**Option A: Quick Placeholder Icons**
```bash
# From project root
npm run ext:icons
```
This creates SVG files. You need to convert them to PNG:
- Visit: https://cloudconvert.com/svg-to-png
- Upload: `browser-extension/icons/icon16.svg`, `icon48.svg`, `icon128.svg`
- Download as PNG
- Save in `browser-extension/icons/` folder

**Option B: Use Your Own Icons**
- Create or design 3 PNG files:
  - `icon16.png` (16x16 pixels)
  - `icon48.png` (48x48 pixels)
  - `icon128.png` (128x128 pixels)
- Save them in `browser-extension/icons/` folder

### Step 3: Test the Extension (2 minutes)

1. **Open Extension Popup**
   - Click the NBCON icon in your Chrome toolbar
   - If you don't see it, click the puzzle piece icon and pin it

2. **Enable Debug Mode**
   - In the popup, click "Toggle Debug Mode"
   - Status should turn green: "Enabled"

3. **Open a Test Page**
   ```javascript
   // Open any website and press F12
   // In the console, type:
   console.log('Testing NBCON DevTools');
   console.error('Test error');
   
   // Then check the NBCON popup - you should see these logs!
   ```

4. **Open DevTools Panel**
   - Press F12 to open Chrome DevTools
   - Look for the "NBCON" tab at the top
   - Click it to see the advanced panel

## ✅ You're Ready!

The extension is now monitoring:
- ✅ Console output (log, warn, error, debug)
- ✅ JavaScript errors and exceptions
- ✅ Network requests (fetch & XHR)
- ✅ Page performance metrics

## 🎯 Common Tasks

### View Console Logs
1. Click NBCON extension icon
2. Go to "Console" tab
3. See real-time logs

### Track Network Requests
1. Enable "Network Monitoring" in settings
2. Go to "Network" tab
3. View all requests with timing

### Export Debugging Data
1. Click "Export Logs" button
2. Choose save location
3. JSON file with all captured data

### Clear All Logs
1. Click "Clear Logs" button
2. Confirm action
3. Fresh start!

## 🔧 Troubleshooting

### Extension Icon Not Visible
**Solution:** Click the puzzle piece (🧩) icon in toolbar → Pin NBCON

### No Logs Appearing
**Solution:** 
1. Check Debug Mode is enabled (green)
2. Refresh the webpage you're testing
3. Check console for extension errors

### DevTools Panel Not Showing
**Solution:**
1. Go to `chrome://extensions/`
2. Click "Reload" button under NBCON extension
3. Close and reopen DevTools (F12)

### Icons Missing Warning
**Solution:** 
- Run `npm run ext:icons`
- Convert SVG to PNG files
- Place in `browser-extension/icons/` folder
- Reload extension

## 📚 Learn More

- **Full Documentation:** See [README.md](./README.md)
- **Architecture:** See "Extension Architecture" section
- **API Reference:** See "API Reference" section
- **Advanced Debugging:** See "Debugging Guide" section

## 🎓 Next Steps

Now that your extension is set up, try these:

1. **Monitor Your NBCON App**
   - Open your NBCON application
   - Enable debug mode
   - Watch logs in real-time

2. **Inspect Network Calls**
   - Enable network monitoring
   - Track API requests
   - Measure response times

3. **Capture Errors**
   - View all JavaScript errors
   - See stack traces
   - Export for bug reports

4. **Performance Analysis**
   - Check page load times
   - Monitor resource counts
   - Optimize slow pages

## 💡 Pro Tips

1. **Auto-Refresh:** Logs auto-refresh every 2 seconds
2. **Keyboard Shortcut:** Press F12 then click NBCON tab
3. **Multi-Tab:** Extension monitors all open tabs
4. **Export Regularly:** Export logs before closing browser
5. **Custom Settings:** Toggle only what you need for better performance

---

**Need Help?** Check the [README.md](./README.md) or inspect the extension's service worker console.

