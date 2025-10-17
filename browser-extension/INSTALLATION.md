# 📦 Installation Instructions - NBCON Cursor Dev Tools

## Prerequisites

- Google Chrome or Chromium-based browser (Edge, Brave, Opera)
- Node.js (for icon generation)
- Basic knowledge of Chrome extensions

## Installation Steps

### Option 1: Quick Install (Recommended)

1. **Navigate to Extensions**
   ```
   Open Chrome → Settings → Extensions
   Or type: chrome://extensions/
   ```

2. **Enable Developer Mode**
   - Look for the toggle in the top-right corner
   - Click to enable

3. **Load Extension**
   - Click "Load unpacked"
   - Browse to: `D:\nbcon-v1\browser-extension`
   - Click "Select Folder"

4. **⚠️ Important: Add Icons**
   
   The extension needs PNG icons to work. You have 2 options:

   **Option A: Convert SVG to PNG**
   - SVG files are already in `browser-extension/icons/`
   - Visit: https://cloudconvert.com/svg-to-png
   - Upload each SVG file (icon16.svg, icon48.svg, icon128.svg)
   - Download as PNG (keep same dimensions)
   - Save in `browser-extension/icons/` folder

   **Option B: Create Custom Icons**
   - Create 3 PNG files:
     - `icon16.png` (16×16 pixels)
     - `icon48.png` (48×48 pixels)  
     - `icon128.png` (128×128 pixels)
   - Use NBCON branding colors
   - Save in `browser-extension/icons/` folder

5. **Reload Extension**
   - After adding icons, go to `chrome://extensions/`
   - Click the reload icon (↻) under NBCON extension

6. **Verify Installation**
   - Extension should show "No errors"
   - Icon should appear in toolbar
   - Click icon to open popup

### Option 2: Install from ZIP (Production)

1. **Package Extension**
   ```bash
   npm run ext:package
   ```

2. **Install ZIP**
   - Go to `chrome://extensions/`
   - Enable Developer mode
   - Drag and drop the generated ZIP file
   - Or click "Load unpacked" and select the ZIP

## Post-Installation Setup

### 1. Pin Extension to Toolbar

- Click the puzzle piece icon (🧩) in Chrome toolbar
- Find "NBCON Cursor Dev Tools"
- Click the pin icon to keep it visible

### 2. Grant Permissions

The extension requires these permissions:
- ✅ **Storage** - Save settings and logs
- ✅ **Tabs** - Access tab information
- ✅ **Active Tab** - Interact with current tab
- ✅ **Scripting** - Inject monitoring scripts
- ✅ **DevTools** - Create custom DevTools panel
- ✅ **All Sites** - Monitor any website

### 3. Configure Settings

1. Click extension icon
2. Enable "Console Logging" (recommended)
3. Enable "Network Monitoring" (optional)
4. Enable "Performance Tracking" (optional)
5. Click "Toggle Debug Mode" to activate

## Verification

### Test Console Capture

1. Open any website
2. Open Developer Console (F12)
3. Type: `console.log('Testing NBCON')`
4. Click NBCON extension icon
5. Go to "Console" tab
6. You should see your log entry

### Test DevTools Panel

1. Open any website
2. Press F12 to open DevTools
3. Look for "NBCON" tab at the top
4. Click it to open custom panel
5. You should see page info and metrics

### Test Network Monitoring

1. Enable "Network Monitoring" in settings
2. Reload any website
3. Click NBCON icon
4. Go to "Network" tab
5. You should see captured requests

## Troubleshooting

### Extension Won't Load

**Error:** "Manifest file is missing or unreadable"
- **Solution:** Verify all files exist in browser-extension folder
- Check manifest.json is valid JSON

**Error:** "Could not load icon"
- **Solution:** Add PNG icon files (see step 4 above)
- Verify icons are in correct format and size

### Extension Loaded But Not Working

**Symptoms:** No logs appearing, icon not clickable
- **Solution 1:** Reload extension in chrome://extensions/
- **Solution 2:** Close and reopen browser
- **Solution 3:** Check for errors in service worker console

### Console Logs Not Captured

**Symptoms:** Logs appear in console but not in extension
- **Solution 1:** Enable Debug Mode in extension
- **Solution 2:** Refresh the webpage after enabling
- **Solution 3:** Check content script is injected (F12 → Sources → Content Scripts)

### DevTools Panel Not Appearing

**Symptoms:** No NBCON tab in DevTools
- **Solution 1:** Close and reopen DevTools (F12)
- **Solution 2:** Reload extension
- **Solution 3:** Check devtools permission is granted

### High Memory Usage

**Symptoms:** Browser becomes slow
- **Solution 1:** Click "Clear Logs" in extension
- **Solution 2:** Disable unused features (network, performance)
- **Solution 3:** Check auto-cleanup is working (background.js)

## Uninstallation

### Complete Removal

1. Go to `chrome://extensions/`
2. Find "NBCON Cursor Dev Tools"
3. Click "Remove"
4. Confirm removal

### Data Cleanup

Extension data is automatically removed on uninstall. To manually clear:

```javascript
// In any page console:
chrome.storage.local.clear();
```

## Updates

### Manual Update

1. Make changes to extension files
2. Save changes
3. Go to `chrome://extensions/`
4. Click reload icon (↻) for NBCON extension
5. Test changes

### Version Management

Update version in `manifest.json`:

```json
{
  "version": "1.0.0",  // Increment for updates
  ...
}
```

## Support

### Getting Help

1. **Check README.md** - Comprehensive documentation
2. **Check QUICK_START.md** - 5-minute setup guide
3. **Inspect Service Worker** - chrome://extensions/ → NBCON → "Service worker"
4. **Check Console** - Look for [NBCON DevTools] messages
5. **GitHub Issues** - Report bugs with console output

### Useful Commands

```bash
# Generate icons
npm run ext:icons

# Package for distribution
npm run ext:package

# Development mode
npm run ext:dev
```

### Debugging the Extension

**Service Worker Console:**
```
chrome://extensions/ → NBCON → Click "Service worker"
```

**Content Script Console:**
```
Open any page → F12 → Console → Filter: [NBCON DevTools]
```

**Popup Console:**
```
Right-click extension icon → Inspect popup
```

**DevTools Panel Console:**
```
F12 → NBCON tab → Right-click → Inspect
```

## Advanced Configuration

### Custom Settings

Edit values in background.js:

```javascript
// Log retention time
const CLEANUP_INTERVAL = 60 * 60 * 1000; // 1 hour

// Max log items
const MAX_LOGS = 100;
const MAX_ERRORS = 50;
const MAX_NETWORK_LOGS = 50;
```

### Content Script Customization

Edit matches in manifest.json:

```json
"content_scripts": [{
  "matches": ["<all_urls>"],  // Change to specific sites
  "js": ["content.js"]
}]
```

### Permissions Customization

Edit permissions in manifest.json:

```json
"permissions": [
  "storage",    // Required
  "tabs",       // Required
  "activeTab",  // Required
  // Remove others if not needed
]
```

## Security Notes

- Extension has access to all websites (required for monitoring)
- All data stored locally in browser
- No external servers or analytics
- Open source - inspect the code
- Use only on trusted websites

## Performance Tips

1. **Disable unused features** - Turn off network/performance tracking if not needed
2. **Clear logs regularly** - Click "Clear Logs" button periodically
3. **Limit retention** - Reduce cleanup interval in background.js
4. **Monitor storage** - Check chrome.storage usage in DevTools
5. **Use specific sites** - Edit manifest to only match specific URLs

---

**Ready to start?** See [QUICK_START.md](./QUICK_START.md) for a 5-minute setup guide!

**Need help?** See [README.md](./README.md) for full documentation.

