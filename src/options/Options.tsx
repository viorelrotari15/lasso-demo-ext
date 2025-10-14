import React, { useState, useEffect } from 'react';
import browser from 'webextension-polyfill';

export function Options() {
  const [name, setName] = useState('');

  useEffect(() => {
    browser.storage.local.get('name').then(({ name }) => {
      if (typeof name === 'string') setName(name);
    });
  }, []);

  const save = async () => {
    await browser.storage.local.set({ name });
    alert('Saved!');
  };

  return (
    <div className="min-h-screen p-6 bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <h1 className="text-2xl font-semibold mb-4">Extension Options</h1>
      <label className="block mb-2 text-sm font-medium">Your name</label>
      <input
        className="border rounded px-3 py-2 w-64 bg-white dark:bg-gray-800"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Type your name"
      />
      <div className="mt-4">
        <button
          className="px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          onClick={save}
        >
          Save
        </button>
      </div>
    </div>
  );
}
