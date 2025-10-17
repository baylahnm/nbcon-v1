/**
 * DevTools Panel Script for NBCON Cursor Extension
 * Handles the custom DevTools panel UI and interactions
 */

// DOM Elements
const pageUrl = document.getElementById('pageUrl');
const pageTitle = document.getElementById('pageTitle');
const pageProtocol = document.getElementById('pageProtocol');
const loadTime = document.getElementById('loadTime');
const domReady = document.getElementById('domReady');
const resourceCount = document.getElementById('resourceCount');
const debugMode = document.getElementById('debugMode');
const monitoring = document.getElementById('monitoring');
const consoleOutput = document.getElementById('consoleOutput');

// Buttons
const reloadPageBtn = document.getElementById('reloadPageBtn');
const clearCacheBtn = document.getElementById('clearCacheBtn');
const analyzePageBtn = document.getElementById('analyzePageBtn');
const captureScreenshotBtn = document.getElementById('captureScreenshotBtn');
const exportDataBtn = document.getElementById('exportDataBtn');

// State
const logs = [];

// Initialize panel
function initialize() {
  console.log('[NBCON DevTools Panel] Initializing...');
  
  // Get page info
  updatePageInfo();
  
  // Get performance metrics
  updatePerformanceMetrics();
  
  // Get extension status
  updateExtensionStatus();
  
  // Set up event listeners
  setupEventListeners();
  
  addLog('info', 'DevTools panel ready');
}

// Update page information
function updatePageInfo() {
  chrome.devtools.inspectedWindow.eval(
    'window.location.href',
    (result) => {
      const url = new URL(result);
      pageUrl.textContent = url.hostname + url.pathname;
      pageUrl.title = result;
      pageProtocol.textContent = url.protocol.replace(':', '');
    }
  );
  
  chrome.devtools.inspectedWindow.eval(
    'document.title',
    (result) => {
      pageTitle.textContent = result || 'Untitled';
    }
  );
}

// Update performance metrics
function updatePerformanceMetrics() {
  chrome.devtools.inspectedWindow.eval(
    `({
      loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart,
      domReady: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
      resourceCount: performance.getEntriesByType('resource').length
    })`,
    (result) => {
      if (result) {
        loadTime.textContent = result.loadTime ? `${result.loadTime}ms` : '-';
        domReady.textContent = result.domReady ? `${result.domReady}ms` : '-';
        resourceCount.textContent = result.resourceCount || 0;
      }
    }
  );
}

// Update extension status
async function updateExtensionStatus() {
  try {
    const settings = await chrome.storage.local.get(['debugMode', 'consoleLogging']);
    debugMode.textContent = settings.debugMode ? 'Enabled' : 'Disabled';
    monitoring.textContent = settings.consoleLogging !== false ? 'Active' : 'Inactive';
  } catch (error) {
    debugMode.textContent = 'Error';
    addLog('error', `Failed to get extension status: ${error.message}`);
  }
}

// Set up event listeners
function setupEventListeners() {
  reloadPageBtn.addEventListener('click', reloadPage);
  clearCacheBtn.addEventListener('click', clearCache);
  analyzePageBtn.addEventListener('click', analyzePage);
  captureScreenshotBtn.addEventListener('click', captureScreenshot);
  exportDataBtn.addEventListener('click', exportData);
}

// Reload page
function reloadPage() {
  chrome.devtools.inspectedWindow.reload();
  addLog('info', 'Page reloaded');
}

// Clear cache and reload
function clearCache() {
  chrome.devtools.inspectedWindow.reload({ 
    ignoreCache: true,
    injectedScript: 'sessionStorage.clear(); localStorage.clear();'
  });
  addLog('info', 'Cache cleared and page reloaded');
}

// Analyze page
function analyzePage() {
  addLog('info', 'Starting page analysis...');
  
  chrome.devtools.inspectedWindow.eval(
    `({
      scripts: Array.from(document.scripts).length,
      stylesheets: Array.from(document.styleSheets).length,
      images: Array.from(document.images).length,
      links: Array.from(document.links).length,
      forms: Array.from(document.forms).length,
      iframes: Array.from(document.querySelectorAll('iframe')).length,
      domNodes: document.querySelectorAll('*').length,
      localStorage: Object.keys(localStorage).length,
      sessionStorage: Object.keys(sessionStorage).length
    })`,
    (result) => {
      if (result) {
        addLog('info', `Page Analysis Results:`);
        addLog('info', `  • Scripts: ${result.scripts}`);
        addLog('info', `  • Stylesheets: ${result.stylesheets}`);
        addLog('info', `  • Images: ${result.images}`);
        addLog('info', `  • Links: ${result.links}`);
        addLog('info', `  • Forms: ${result.forms}`);
        addLog('info', `  • iFrames: ${result.iframes}`);
        addLog('info', `  • DOM Nodes: ${result.domNodes}`);
        addLog('info', `  • localStorage Items: ${result.localStorage}`);
        addLog('info', `  • sessionStorage Items: ${result.sessionStorage}`);
      }
    }
  );
}

// Capture screenshot
function captureScreenshot() {
  chrome.tabs.captureVisibleTab((dataUrl) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `nbcon-screenshot-${Date.now()}.png`;
    link.click();
    addLog('info', 'Screenshot captured');
  });
}

// Export data
async function exportData() {
  try {
    const data = await chrome.storage.local.get([
      'consoleLogs',
      'errors',
      'networkLogs',
      'performanceLogs'
    ]);
    
    const exportData = {
      timestamp: new Date().toISOString(),
      pageInfo: {
        url: pageUrl.textContent,
        title: pageTitle.textContent,
        protocol: pageProtocol.textContent
      },
      performance: {
        loadTime: loadTime.textContent,
        domReady: domReady.textContent,
        resourceCount: resourceCount.textContent
      },
      logs: data
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `nbcon-devtools-export-${Date.now()}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    addLog('info', 'Data exported successfully');
  } catch (error) {
    addLog('error', `Failed to export data: ${error.message}`);
  }
}

// Add log entry to console output
function addLog(level, message) {
  const timestamp = new Date().toLocaleTimeString();
  logs.push({ level, message, timestamp });
  
  const entry = document.createElement('div');
  entry.className = 'log-entry';
  entry.innerHTML = `
    <span class="log-time">${timestamp}</span>
    <span class="log-level ${level}">${level.toUpperCase()}</span>
    <span>${message}</span>
  `;
  
  consoleOutput.appendChild(entry);
  consoleOutput.scrollTop = consoleOutput.scrollHeight;
  
  // Keep only last 100 logs
  if (logs.length > 100) {
    logs.shift();
    consoleOutput.removeChild(consoleOutput.firstChild);
  }
}

// Listen for storage changes
chrome.storage.onChanged.addListener((changes) => {
  if (changes.debugMode) {
    updateExtensionStatus();
  }
});

// Auto-refresh page info and performance metrics
setInterval(() => {
  updatePageInfo();
  updatePerformanceMetrics();
}, 5000);

// Initialize on load
initialize();

