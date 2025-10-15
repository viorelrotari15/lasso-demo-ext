import browser from 'webextension-polyfill';

(function main() {
  const badge = document.createElement('div');
  badge.textContent = 'Lasso Demo Content';
  badge.style.position = 'fixed';
  badge.style.bottom = '8px';
  badge.style.right = '8px';
  badge.style.padding = '6px 8px';
  badge.style.background = '#1d4ed8';
  badge.style.color = 'white';
  badge.style.fontSize = '12px';
  badge.style.borderRadius = '6px';
  badge.style.zIndex = '2147483647';
  document.documentElement.appendChild(badge);

  browser.runtime.sendMessage({ type: 'PING' }).catch(() => {});

  window.addEventListener('message', async (event) => {
    if (event.source !== window) return;
    
    if (event.data && event.data.type === 'captured-request') {
      try {
        const response = await browser.runtime.sendMessage(event.data);
        
        window.postMessage({
          type: 'captured-request-response',
          requestId: event.data.requestId,
          response: response
        }, '*');
      } catch (error) {        
        window.postMessage({
          type: 'captured-request-response',
          requestId: event.data.requestId,
          response: { hasEmails: false, error: error instanceof Error ? error.message : 'Unknown error' }
        }, '*');
      }
    }
  });
})();
