import React from 'react';

export function Popup() {
  return (
    <div className="min-w-72 p-4 bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <h1 className="text-xl font-semibold mb-2">Hello Extension 👋</h1>
      <p className="text-sm mb-3">
        This is the popup page. Tailwind and HMR are enabled.
      </p>
      <button
        className="px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        onClick={() => alert('Hello from Popup!')}
      >
        Click me
      </button>
    </div>
  );
}
