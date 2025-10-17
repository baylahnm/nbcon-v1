/**
 * Background Service Worker for NBCON Cursor Dev Tools
 * Handles background tasks, messaging, and state management
 */

// Initialize extension
chrome.runtime.onInstalled.addListener((details) => {
  console.log('[NBCON DevTools] Extension installed:', details.reason);
  
  if (details.reason === 'install') {
    // First time installation
    chrome.storage.local.set({
      debugMode: true,
      consoleLogging: true,
      networkMonitoring: false,
      performanceTracking: false
    });
  }
});

// Listen for messages from content scripts and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('[NBCON DevTools] Message received:', request);
  
  switch (request.action) {
    case 'getDebugInfo':
      handleGetDebugInfo(sender.tab?.id).then(sendResponse);
      return true; // Indicates async response
      
    case 'toggleDebugMode':
      handleToggleDebugMode(request.enabled).then(sendResponse);
      return true;
      
    case 'captureConsole':
      handleCaptureConsole(request.data, sender.tab?.id);
      break;
      
    case 'captureError':
      handleCaptureError(request.error, sender.tab?.id);
      break;
      
    case 'logNetworkRequest':
      handleNetworkRequest(request.data, sender.tab?.id);
      break;
      
    case 'measurePerformance':
      handlePerformanceMeasure(request.data, sender.tab?.id);
      break;
      
    default:
      console.warn('[NBCON DevTools] Unknown action:', request.action);
  }
  
  return false;
});

// Handle tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    console.log('[NBCON DevTools] Tab loaded:', tab.url);
    
    // Inject debugging capabilities
    injectDebugger(tabId);
  }
});

// Debug info handler
async function handleGetDebugInfo(tabId) {
  try {
    const settings = await chrome.storage.local.get([
      'debugMode',
      'consoleLogging',
      'networkMonitoring',
      'performanceTracking'
    ]);
    
    const tab = tabId ? await chrome.tabs.get(tabId) : null;
    
    return {
      success: true,
      data: {
        settings,
        tab: tab ? {
          id: tab.id,
          url: tab.url,
          title: tab.title
        } : null,
        timestamp: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('[NBCON DevTools] Error getting debug info:', error);
    return { success: false, error: error.message };
  }
}

// Toggle debug mode
async function handleToggleDebugMode(enabled) {
  try {
    await chrome.storage.local.set({ debugMode: enabled });
    console.log('[NBCON DevTools] Debug mode:', enabled ? 'enabled' : 'disabled');
    
    // Notify all tabs
    const tabs = await chrome.tabs.query({});
    tabs.forEach(tab => {
      chrome.tabs.sendMessage(tab.id, {
        action: 'debugModeChanged',
        enabled
      }).catch(() => {}); // Ignore errors for tabs without content script
    });
    
    return { success: true, enabled };
  } catch (error) {
    console.error('[NBCON DevTools] Error toggling debug mode:', error);
    return { success: false, error: error.message };
  }
}

// Console capture handler
function handleCaptureConsole(data, tabId) {
  console.log(`[NBCON DevTools] Console [${data.level}] from tab ${tabId}:`, data.message);
  
  // Store in local storage for popup to display
  chrome.storage.local.get(['consoleLogs'], (result) => {
    const logs = result.consoleLogs || [];
    logs.push({
      ...data,
      tabId,
      timestamp: Date.now()
    });
    
    // Keep only last 100 logs
    const trimmedLogs = logs.slice(-100);
    chrome.storage.local.set({ consoleLogs: trimmedLogs });
  });
}

// Error capture handler
function handleCaptureError(error, tabId) {
  console.error(`[NBCON DevTools] Error from tab ${tabId}:`, error);
  
  // Store errors separately
  chrome.storage.local.get(['errors'], (result) => {
    const errors = result.errors || [];
    errors.push({
      ...error,
      tabId,
      timestamp: Date.now()
    });
    
    // Keep only last 50 errors
    const trimmedErrors = errors.slice(-50);
    chrome.storage.local.set({ errors: trimmedErrors });
  });
}

// Network request handler
function handleNetworkRequest(data, tabId) {
  console.log(`[NBCON DevTools] Network request from tab ${tabId}:`, data.url);
  
  chrome.storage.local.get(['networkLogs'], (result) => {
    const logs = result.networkLogs || [];
    logs.push({
      ...data,
      tabId,
      timestamp: Date.now()
    });
    
    // Keep only last 50 requests
    const trimmedLogs = logs.slice(-50);
    chrome.storage.local.set({ networkLogs: trimmedLogs });
  });
}

// Performance measurement handler
function handlePerformanceMeasure(data, tabId) {
  console.log(`[NBCON DevTools] Performance from tab ${tabId}:`, data);
  
  chrome.storage.local.get(['performanceLogs'], (result) => {
    const logs = result.performanceLogs || [];
    logs.push({
      ...data,
      tabId,
      timestamp: Date.now()
    });
    
    const trimmedLogs = logs.slice(-50);
    chrome.storage.local.set({ performanceLogs: trimmedLogs });
  });
}

// Inject debugger into tab
async function injectDebugger(tabId) {
  try {
    const settings = await chrome.storage.local.get(['debugMode']);
    
    if (settings.debugMode) {
      // Send initialization message to content script
      chrome.tabs.sendMessage(tabId, {
        action: 'initializeDebugger',
        settings
      }).catch(() => {
        // Tab might not have content script yet
      });
    }
  } catch (error) {
    console.error('[NBCON DevTools] Error injecting debugger:', error);
  }
}

// Cleanup old data periodically (every hour)
setInterval(() => {
  chrome.storage.local.get(['consoleLogs', 'errors', 'networkLogs', 'performanceLogs'], (result) => {
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    
    const cleanup = (logs) => {
      return logs ? logs.filter(log => log.timestamp > oneHourAgo) : [];
    };
    
    chrome.storage.local.set({
      consoleLogs: cleanup(result.consoleLogs),
      errors: cleanup(result.errors),
      networkLogs: cleanup(result.networkLogs),
      performanceLogs: cleanup(result.performanceLogs)
    });
  });
}, 60 * 60 * 1000); // Every hour

