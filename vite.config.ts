import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import historyFallback from './vite-history-fallback';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), historyFallback()],
  // For GitHub Pages deployment, we need to set the base to the repository name
  base: mode === 'production' ? '/simple-md-viewer/' : '/',
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
    emptyOutDir: true,
    // Ensure proper MIME types for GitHub Pages
    rollupOptions: {
      output: {
        // Remove hashes from filenames to avoid MIME type issues
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/chunk-[name].js',
        assetFileNames: 'assets/[name].[ext]'
      }
    }
  },
  // Add this to handle client-side routing in preview mode
  appType: 'spa'
}));
