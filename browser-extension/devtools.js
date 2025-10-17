/**
 * DevTools Integration for NBCON Cursor Extension
 * Creates a custom panel in Chrome DevTools
 */

// Create a custom DevTools panel
chrome.devtools.panels.create(
  'NBCON',
  'icons/icon48.png',
  'devtools-panel.html',
  (panel) => {
    console.log('[NBCON DevTools] Custom panel created');
    
    // Panel lifecycle
    panel.onShown.addListener((window) => {
      console.log('[NBCON DevTools] Panel shown');
    });
    
    panel.onHidden.addListener(() => {
      console.log('[NBCON DevTools] Panel hidden');
    });
  }
);

// Add sidebar pane to Elements panel
chrome.devtools.panels.elements.createSidebarPane(
  'NBCON Inspector',
  (sidebar) => {
    console.log('[NBCON DevTools] Sidebar pane created');
    
    // Update sidebar when element is selected
    chrome.devtools.panels.elements.onSelectionChanged.addListener(() => {
      chrome.devtools.inspectedWindow.eval(
        '($0 && $0.tagName) ? {' +
        '  tag: $0.tagName,' +
        '  id: $0.id,' +
        '  classes: Array.from($0.classList),' +
        '  attributes: Array.from($0.attributes).map(a => ({name: a.name, value: a.value}))' +
        '} : null',
        (result, isException) => {
          if (isException) {
            sidebar.setObject({ error: 'Unable to inspect element' });
          } else if (result) {
            sidebar.setObject(result);
          } else {
            sidebar.setExpression('null');
          }
        }
      );
    });
  }
);

// Network monitoring
chrome.devtools.network.onRequestFinished.addListener((request) => {
  // Send network data to background script
  chrome.runtime.sendMessage({
    action: 'devtoolsNetworkRequest',
    data: {
      url: request.request.url,
      method: request.request.method,
      status: request.response.status,
      statusText: request.response.statusText,
      contentType: request.response.content.mimeType,
      size: request.response.bodySize,
      time: request.time,
      timestamp: Date.now()
    }
  }).catch(() => {});
});

// Console integration
chrome.devtools.inspectedWindow.eval(
  `
  (function() {
    // Inject console interceptor
    const originalConsole = {
      log: console.log,
      info: console.info,
      warn: console.warn,
      error: console.error,
      debug: console.debug
    };
    
    ['log', 'info', 'warn', 'error', 'debug'].forEach(method => {
      console[method] = function(...args) {
        originalConsole[method].apply(console, args);
        
        // Send to extension
        window.postMessage({
          source: 'nbcon-devtools-console',
          level: method,
          args: args.map(arg => {
            try {
              return JSON.parse(JSON.stringify(arg));
            } catch {
              return String(arg);
            }
          })
        }, '*');
      };
    });
    
    console.log('[NBCON DevTools] Console interceptor injected');
  })();
  `,
  (result, isException) => {
    if (isException) {
      console.error('[NBCON DevTools] Failed to inject console interceptor:', result);
    }
  }
);

