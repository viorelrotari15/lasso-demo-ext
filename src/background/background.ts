import browser from 'webextension-polyfill';

browser.runtime.onInstalled.addListener(() => {
  browser.storage.local.set({ installedAt: Date.now() });
});

browser.runtime.onMessage.addListener(async (msg: unknown, _sender: unknown) => {
  if (
    typeof msg === 'object' &&
    msg !== null &&
    'type' in msg &&
    (msg as { type?: unknown }).type === 'PING'
  ) {
    return { ok: true, time: Date.now() };
  }
});
