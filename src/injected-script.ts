(() => {
  const emailRegex = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;

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

  function detectEmails(text: string): string[] {
    return text.match(emailRegex) || [];
  }

  function anonymizeEmails(text: string, emails: string[]): string {
    let sanitized = text;
    for (const email of emails) {
      // Simple string replacement without regex
      sanitized = sanitized.split(email).join("[ANONYMIZED_EMAIL]");
    }
    return sanitized;
  }

  function logEmailIssue(url: string, emails: string[]): void {
    try {
      const prevIssues = JSON.parse(
        localStorage.getItem("chatgpt_email_issues") || "[]"
      );
      prevIssues.push({
        timestamp: new Date().toISOString(),
        emails,
        url,
      });
      const limited = prevIssues.slice(-100);
      localStorage.setItem("chatgpt_email_issues", JSON.stringify(limited));
    } catch (err) {
      console.error("[Extension] Failed to log email issue:", err);
    }
  }

  async function handleFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    console.log("handleFetch", input, init);
    const method = init?.method?.toUpperCase() || "GET";
    
    if (!["POST", "PUT", "PATCH"].includes(method)) {
      return originalFetch(input, init);
    }

    try {
      const payload = extractPayload(init);
      const emails = detectEmails(payload);

      if (emails.length > 0) {
        const sanitizedBody = anonymizeEmails(payload, emails);
        console.warn(
          `[Extension] ${emails.length} email(s) detected in fetch request to ${typeof input === "string" ? input : input.toString()}. They were anonymized.`
        );

        const url = typeof input === "string" ? input : input.toString();
        logEmailIssue(url, emails);

        const newInit = init ? { ...init, body: sanitizedBody } : undefined;
        return originalFetch(input, newInit);
      }
    } catch (err) {
      console.error("[Extension] Fetch inspection error:", err);
    }

    return originalFetch(input, init);
  }

  const originalFetch = window.fetch.bind(window);
  window.fetch = (input: RequestInfo | URL, init?: RequestInit) => handleFetch(input, init);
  console.log("[Extension] Fetch interceptor active in main world.");
})();
