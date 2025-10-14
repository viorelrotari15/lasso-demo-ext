## Lasso Demo Extension

React 18 + TypeScript + TailwindCSS + Vite + `vite-plugin-web-extension`, compatible with Chrome (Manifest V3) and Firefox.

### Scripts

- `pnpm dev` or `npm run dev`: Start dev server for Chrome HMR
- `pnpm dev:firefox` or `npm run dev:firefox`: Start dev server for Firefox HMR
- `pnpm build` or `npm run build`: Build production extension into `dist/`

### Development

1. Install dependencies:
   - `pnpm install` (recommended) or `npm install`

2. Start dev:
   - Chrome/Edge: `pnpm dev` or `npm run dev`
   - Firefox: `pnpm dev:firefox` or `npm run dev:firefox`

3. Load the extension:
   - Chrome/Edge:
     - Open `chrome://extensions`
     - Enable Developer Mode
     - Click “Load unpacked” and choose the `dist/` directory
   - Firefox:
     - Open `about:debugging#/runtime/this-firefox`
     - Click “Load Temporary Add-on”
     - Select any file inside `dist/` (e.g., `manifest.json`)

HMR:
- Popup and Options pages hot-reload instantly.
- Content script auto-reinjects on change.
- Background service worker reloads when changed (via plugin `reloadOnChange`).

### Build

- `pnpm build` or `npm run build` produces a production-ready `dist/` folder. Load it as above.

### Notes

- Icons should be located under `public/icons/` and referenced by `manifest.json`.
- Manifest v3 is used; Firefox supports most MV3 features in latest versions, with the plugin assisting during development.
