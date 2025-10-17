/**
 * Popup Script for NBCON Cursor Dev Tools
 * Handles UI interactions and displays debug information
 */

// DOM Elements
const debugModeStatus = document.getElementById('debugModeStatus');
const activeTabStatus = document.getElementById('activeTabStatus');
const toggleDebugBtn = document.getElementById('toggleDebugBtn');
const clearLogsBtn = document.getElementById('clearLogsBtn');
const exportLogsBtn = document.getElementById('exportLogsBtn');
const openDevToolsBtn = document.getElementById('openDevToolsBtn');
const consoleLoggingCheckbox = document.getElementById('consoleLogging');
const networkMonitoringCheckbox = document.getElementById('networkMonitoring');
const performanceTrackingCheckbox = document.getElementById('performanceTracking');

// Tab elements
const tabs = document.querySelectorAll('.tab');
const tabPanels = document.querySelectorAll('.tab-panel');

// Log lists
const consoleLogsList = document.getElementById('consoleLogsList');
const errorsList = document.getElementById('errorsList');
const networkList = document.getElementById('networkList');
const performanceList = document.getElementById('performanceList');

// State
let currentDebugMode = false;
let currentSettings = {};

// Initialize popup
async function initialize() {
  try {
    // Get current tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    // Get debug info from background
    const response = await chrome.runtime.sendMessage({ action: 'getDebugInfo' });
    
    if (response.success) {
      currentSettings = response.data.settings;
      currentDebugMode = currentSettings.debugMode || false;
      
      // Update UI
      updateStatusDisplay(tab);
      updateSettingsDisplay();
      
      // Load logs
      loadLogs();
    }
  } catch (error) {
    console.error('[NBCON DevTools Popup] Initialization error:', error);
    debugModeStatus.textContent = 'Error';
    debugModeStatus.className = 'status-value status-error';
  }
}

// Update status display
function updateStatusDisplay(tab) {
  // Debug mode status
  debugModeStatus.textContent = currentDebugMode ? 'Enabled' : 'Disabled';
  debugModeStatus.className = `status-value ${currentDebugMode ? 'status-active' : 'status-inactive'}`;
  
  // Active tab status
  if (tab) {
    const url = new URL(tab.url);
    activeTabStatus.textContent = `${url.hostname}${url.pathname}`;
    activeTabStatus.title = tab.url;
  } else {
    activeTabStatus.textContent = 'No active tab';
  }
}

// Update settings display
function updateSettingsDisplay() {
  consoleLoggingCheckbox.checked = currentSettings.consoleLogging !== false;
  networkMonitoringCheckbox.checked = currentSettings.networkMonitoring === true;
  performanceTrackingCheckbox.checked = currentSettings.performanceTracking === true;
}

// Load logs from storage
async function loadLogs() {
  try {
    const data = await chrome.storage.local.get([
      'consoleLogs',
      'errors',
      'networkLogs',
      'performanceLogs'
    ]);
    
    displayConsoleLogs(data.consoleLogs || []);
    displayErrors(data.errors || []);
    displayNetworkLogs(data.networkLogs || []);
    displayPerformanceLogs(data.performanceLogs || []);
  } catch (error) {
    console.error('[NBCON DevTools Popup] Error loading logs:', error);
  }
}

// Display console logs
function displayConsoleLogs(logs) {
  if (logs.length === 0) {
    consoleLogsList.innerHTML = '<p class="empty-state">No console logs yet</p>';
    return;
  }
  
  consoleLogsList.innerHTML = logs.slice(-20).reverse().map(log => `
    <div class="log-item log-${log.level}">
      <div class="log-header">
        <span class="log-level">${log.level.toUpperCase()}</span>
        <span class="log-time">${formatTime(log.timestamp)}</span>
      </div>
      <div class="log-message">${escapeHtml(log.message)}</div>
      <div class="log-url">${escapeHtml(log.url || 'Unknown')}</div>
    </div>
  `).join('');
}

// Display errors
function displayErrors(errors) {
  if (errors.length === 0) {
    errorsList.innerHTML = '<p class="empty-state">No errors yet ✨</p>';
    return;
  }
  
  errorsList.innerHTML = errors.slice(-20).reverse().map(error => `
    <div class="log-item log-error">
      <div class="log-header">
        <span class="log-level">ERROR</span>
        <span class="log-time">${formatTime(error.timestamp)}</span>
      </div>
      <div class="log-message">${escapeHtml(error.message)}</div>
      ${error.filename ? `<div class="log-meta">File: ${escapeHtml(error.filename)}:${error.lineno || 0}:${error.colno || 0}</div>` : ''}
      ${error.stack ? `<details class="log-stack"><summary>Stack Trace</summary><pre>${escapeHtml(error.stack)}</pre></details>` : ''}
    </div>
  `).join('');
}

// Display network logs
function displayNetworkLogs(logs) {
  if (logs.length === 0) {
    networkList.innerHTML = '<p class="empty-state">No network requests yet</p>';
    return;
  }
  
  networkList.innerHTML = logs.slice(-20).reverse().map(log => {
    const statusClass = log.status >= 200 && log.status < 300 ? 'success' : 
                       log.status >= 400 ? 'error' : 'warning';
    
    return `
      <div class="log-item">
        <div class="log-header">
          <span class="log-level log-${statusClass}">${log.method} ${log.status}</span>
          <span class="log-time">${log.duration}ms</span>
        </div>
        <div class="log-message">${escapeHtml(log.url)}</div>
        <div class="log-meta">${log.type.toUpperCase()} • ${formatTime(log.timestamp)}</div>
        ${log.error ? `<div class="log-error-msg">Error: ${escapeHtml(log.error)}</div>` : ''}
      </div>
    `;
  }).join('');
}

// Display performance logs
function displayPerformanceLogs(logs) {
  if (logs.length === 0) {
    performanceList.innerHTML = '<p class="empty-state">No performance data yet</p>';
    return;
  }
  
  performanceList.innerHTML = logs.slice(-10).reverse().map(log => `
    <div class="log-item">
      <div class="log-header">
        <span class="log-level">PERF</span>
        <span class="log-time">${formatTime(log.timestamp)}</span>
      </div>
      <div class="log-url">${escapeHtml(log.url)}</div>
      <div class="perf-metrics">
        ${log.domContentLoaded ? `<div class="perf-item">DOM Ready: <strong>${log.domContentLoaded}ms</strong></div>` : ''}
        ${log.loadComplete ? `<div class="perf-item">Load Complete: <strong>${log.loadComplete}ms</strong></div>` : ''}
        ${log.domInteractive ? `<div class="perf-item">DOM Interactive: <strong>${log.domInteractive}ms</strong></div>` : ''}
        ${log.firstPaint ? `<div class="perf-item">First Paint: <strong>${log.firstPaint}ms</strong></div>` : ''}
      </div>
    </div>
  `).join('');
}

// Event Listeners

// Toggle debug mode
toggleDebugBtn.addEventListener('click', async () => {
  try {
    const response = await chrome.runtime.sendMessage({
      action: 'toggleDebugMode',
      enabled: !currentDebugMode
    });
    
    if (response.success) {
      currentDebugMode = response.enabled;
      updateStatusDisplay(await chrome.tabs.query({ active: true, currentWindow: true }).then(tabs => tabs[0]));
    }
  } catch (error) {
    console.error('[NBCON DevTools Popup] Error toggling debug mode:', error);
  }
});

// Clear logs
clearLogsBtn.addEventListener('click', async () => {
  if (confirm('Are you sure you want to clear all logs?')) {
    await chrome.storage.local.set({
      consoleLogs: [],
      errors: [],
      networkLogs: [],
      performanceLogs: []
    });
    
    loadLogs();
  }
});

// Export logs
exportLogsBtn.addEventListener('click', async () => {
  try {
    const data = await chrome.storage.local.get([
      'consoleLogs',
      'errors',
      'networkLogs',
      'performanceLogs'
    ]);
    
    const exportData = {
      timestamp: new Date().toISOString(),
      ...data
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    await chrome.downloads.download({
      url,
      filename: `nbcon-devtools-logs-${Date.now()}.json`,
      saveAs: true
    });
    
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('[NBCON DevTools Popup] Error exporting logs:', error);
  }
});

// Open DevTools panel
openDevToolsBtn.addEventListener('click', () => {
  alert('Press F12 to open Chrome DevTools, then navigate to the "NBCON" panel');
});

// Settings checkboxes
consoleLoggingCheckbox.addEventListener('change', async (e) => {
  await chrome.storage.local.set({ consoleLogging: e.target.checked });
});

networkMonitoringCheckbox.addEventListener('change', async (e) => {
  await chrome.storage.local.set({ networkMonitoring: e.target.checked });
});

performanceTrackingCheckbox.addEventListener('change', async (e) => {
  await chrome.storage.local.set({ performanceTracking: e.target.checked });
});

// Tab switching
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const tabName = tab.dataset.tab;
    
    // Update tab buttons
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    
    // Update tab panels
    tabPanels.forEach(panel => {
      panel.classList.remove('active');
      if (panel.id === `${tabName}Tab`) {
        panel.classList.add('active');
      }
    });
  });
});

// Utility functions
function formatTime(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleTimeString();
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Auto-refresh logs every 2 seconds
setInterval(loadLogs, 2000);

// Initialize on load
initialize();

