import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import historyFallback from './vite-history-fallback';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), historyFallback()],
  // For HashRouter, we don't need the base path in production since the hash handles routing
  base: '/',
  server: {
    port: 3501,
    strictPort: true,
    // Enable history API fallback for SPA routing
    fs: {
      strict: false
    }
  },
  preview: {
    port: 3501,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true
  },
  // Add this to handle client-side routing in preview mode
  appType: 'spa'
}));
