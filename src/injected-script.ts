(() => {
  function extractPayload(init: RequestInit | undefined): string {
    if (!init?.body) return "";
    if (typeof init.body === "string") return init.body;
    if (init.body instanceof FormData) {
      return Array.from(init.body.entries())
        .map(([k, v]) => `${k}: ${v}`)
        .join(", ");
    }
    if (init.body instanceof URLSearchParams) {
      return init.body.toString();
    }
    return "";
  }

  async function handleFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    const method = init?.method?.toUpperCase() || "GET";
    
    if (!["POST", "PUT", "PATCH"].includes(method)) {
      return originalFetch(input, init);
    }

    try {
      const payload = extractPayload(init);
      const url = typeof input === "string" ? input : input.toString();

      const requestId = Math.random().toString(36).substr(2, 9);
      
      return new Promise((resolve) => {
        const handleResponse = (event: MessageEvent) => {
          if (event.data && event.data.type === 'captured-request-response' && event.data.requestId === requestId) {
            window.removeEventListener('message', handleResponse);
            
            const response = event.data.response;
            
            if (response && response.hasEmails) {

              const newInit = init ? { ...init, body: response.sanitizedBody } : undefined;
              resolve(originalFetch(input, newInit));
            } else {
              resolve(originalFetch(input, init));
            }
          }
        };

        window.addEventListener('message', handleResponse);
        
        window.postMessage({
          type: 'captured-request',
          requestId,
          url,
          method,
          body: payload
        }, '*');
      });
    } catch (err) {
      return originalFetch(input, init);
    }
  }

  const originalFetch = window.fetch.bind(window);
  window.fetch = (input: RequestInfo | URL, init?: RequestInit) => handleFetch(input, init);
})();
