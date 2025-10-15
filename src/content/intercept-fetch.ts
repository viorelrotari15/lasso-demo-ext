import browser from 'webextension-polyfill';

const script = document.createElement('script');
const runtime = typeof browser !== 'undefined' ? browser : chrome;
script.src = runtime.runtime.getURL('injected-script.js');

script.onload = () => {
  console.log("[Extension] Injected script loaded successfully");
  script.remove();
};

script.onerror = () => {
  console.error("[Extension] Failed to load injected script");
  script.remove();
};

(document.head || document.documentElement).appendChild(script);
