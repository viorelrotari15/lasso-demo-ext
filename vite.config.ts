import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { crx } from '@crxjs/vite-plugin';
import manifest from './public/manifest.json';

export default defineConfig({
  plugins: [
    react(), 
    crx({ 
      manifest,
      contentScripts: {
        injectCss: true
      }
    })
  ],
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      input: {
        'injected-script': './src/injected-script.ts'
      },
      output: {
        entryFileNames: '[name].js'
      }
    }
  },
  server: {
    port: 5173,
    strictPort: true
  },
  resolve: {
    alias: {
      '@': '/Users/rotariviorel/lasso-demo-ext/src'
    }
  }
});
