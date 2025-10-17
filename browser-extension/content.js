/**
 * Content Script for NBCON Cursor Dev Tools
 * Runs in the context of web pages and intercepts console, errors, and network
 */

(function() {
  'use strict';
  
  let debugMode = true;
  let isInitialized = false;
  
  console.log('[NBCON DevTools] Content script loaded');
  
  // Initialize debugger
  function initializeDebugger() {
    if (isInitialized) return;
    
    console.log('[NBCON DevTools] Initializing debugger...');
    
    // Intercept console methods
    interceptConsole();
    
    // Capture window errors
    captureErrors();
    
    // Monitor network requests (if supported)
    monitorNetwork();
    
    // Track performance
    trackPerformance();
    
    isInitialized = true;
    console.log('[NBCON DevTools] Debugger initialized successfully');
  }
  
  // Intercept console methods
  function interceptConsole() {
    const consoleMethods = ['log', 'info', 'warn', 'error', 'debug'];
    
    consoleMethods.forEach(method => {
      const original = console[method];
      
      console[method] = function(...args) {
        // Call original method
        original.apply(console, args);
        
        // Send to background script
        if (debugMode) {
          chrome.runtime.sendMessage({
            action: 'captureConsole',
            data: {
              level: method,
              message: args.map(arg => 
                typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
              ).join(' '),
              url: window.location.href
            }
          }).catch(() => {});
        }
      };
    });
  }
  
  // Capture window errors
  function captureErrors() {
    window.addEventListener('error', (event) => {
      if (debugMode) {
        chrome.runtime.sendMessage({
          action: 'captureError',
          error: {
            message: event.message,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            stack: event.error?.stack,
            url: window.location.href
          }
        }).catch(() => {});
      }
    });
    
    window.addEventListener('unhandledrejection', (event) => {
      if (debugMode) {
        chrome.runtime.sendMessage({
          action: 'captureError',
          error: {
            message: `Unhandled Promise Rejection: ${event.reason}`,
            stack: event.reason?.stack,
            url: window.location.href
          }
        }).catch(() => {});
      }
    });
  }
  
  // Monitor network requests
  function monitorNetwork() {
    // Intercept fetch
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
      const startTime = performance.now();
      const url = args[0];
      
      return originalFetch.apply(this, args)
        .then(response => {
          const duration = performance.now() - startTime;
          
          if (debugMode) {
            chrome.runtime.sendMessage({
              action: 'logNetworkRequest',
              data: {
                url: typeof url === 'string' ? url : url.url,
                method: args[1]?.method || 'GET',
                status: response.status,
                duration: Math.round(duration),
                type: 'fetch'
              }
            }).catch(() => {});
          }
          
          return response;
        })
        .catch(error => {
          const duration = performance.now() - startTime;
          
          if (debugMode) {
            chrome.runtime.sendMessage({
              action: 'logNetworkRequest',
              data: {
                url: typeof url === 'string' ? url : url.url,
                method: args[1]?.method || 'GET',
                status: 0,
                duration: Math.round(duration),
                error: error.message,
                type: 'fetch'
              }
            }).catch(() => {});
          }
          
          throw error;
        });
    };
    
    // Intercept XMLHttpRequest
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;
    
    XMLHttpRequest.prototype.open = function(method, url, ...rest) {
      this._nbconMethod = method;
      this._nbconUrl = url;
      this._nbconStartTime = performance.now();
      return originalOpen.apply(this, [method, url, ...rest]);
    };
    
    XMLHttpRequest.prototype.send = function(...args) {
      this.addEventListener('load', function() {
        const duration = performance.now() - this._nbconStartTime;
        
        if (debugMode) {
          chrome.runtime.sendMessage({
            action: 'logNetworkRequest',
            data: {
              url: this._nbconUrl,
              method: this._nbconMethod,
              status: this.status,
              duration: Math.round(duration),
              type: 'xhr'
            }
          }).catch(() => {});
        }
      });
      
      this.addEventListener('error', function() {
        const duration = performance.now() - this._nbconStartTime;
        
        if (debugMode) {
          chrome.runtime.sendMessage({
            action: 'logNetworkRequest',
            data: {
              url: this._nbconUrl,
              method: this._nbconMethod,
              status: 0,
              duration: Math.round(duration),
              error: 'Network error',
              type: 'xhr'
            }
          }).catch(() => {});
        }
      });
      
      return originalSend.apply(this, args);
    };
  }
  
  // Track performance metrics
  function trackPerformance() {
    // Wait for page load
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = performance.getEntriesByType('navigation')[0];
        
        if (perfData && debugMode) {
          chrome.runtime.sendMessage({
            action: 'measurePerformance',
            data: {
              url: window.location.href,
              domContentLoaded: Math.round(perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart),
              loadComplete: Math.round(perfData.loadEventEnd - perfData.loadEventStart),
              domInteractive: Math.round(perfData.domInteractive),
              firstPaint: getFirstPaint()
            }
          }).catch(() => {});
        }
      }, 1000);
    });
  }
  
  // Get first paint timing
  function getFirstPaint() {
    const paintEntries = performance.getEntriesByType('paint');
    const firstPaint = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    return firstPaint ? Math.round(firstPaint.startTime) : null;
  }
  
  // Listen for messages from background script
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.action) {
      case 'initializeDebugger':
        debugMode = request.settings.debugMode;
        initializeDebugger();
        sendResponse({ success: true });
        break;
        
      case 'debugModeChanged':
        debugMode = request.enabled;
        console.log('[NBCON DevTools] Debug mode changed:', debugMode);
        sendResponse({ success: true });
        break;
        
      default:
        console.warn('[NBCON DevTools] Unknown content script action:', request.action);
    }
    
    return false;
  });
  
  // Initialize on load
  initializeDebugger();
})();

