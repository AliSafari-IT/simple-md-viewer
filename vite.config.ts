import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import historyFallback from './vite-history-fallback';
import { resolve } from 'path';

// Vite configuration for the Simple Markdown Viewer package
export default defineConfig(({ mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd(), '');
  const VITE_PORT = parseInt(env.VITE_PORT) || 5174;
  
  console.log("VITE_PORT nr:", VITE_PORT, "mode:", mode);

  if (mode === 'lib') {
    // Library build configuration
    return {
      plugins: [react()],
      build: {
        lib: {
          entry: resolve(__dirname, 'src/index.ts'),
          name: 'SimpleMarkdownViewer',
          fileName: (format) => `index.${format === 'es' ? 'esm' : format}.js`,
          formats: ['es', 'cjs']
        },
        rollupOptions: {
          external: [
            'react', 
            'react-dom', 
            'react-router-dom',
            // Node.js modules that should not be bundled for browser
            'fsevents',
            'tty',
            'util',
            'stream',
            'path',
            'fs',
            'os',
            'crypto',
            'worker_threads',
            'child_process',
            'events',
            'assert',
            'net',
            'url',
            'http',
            'https',
            'zlib',
            'buffer',
            'tls',
            'querystring',
            'module',
            'dns',
            'readline',
            'http2',
            // Node.js modules with 'node:' prefix
            'node:fs',
            'node:path',
            'node:process',
            'node:perf_hooks',
            'node:crypto',
            'node:fs/promises',
            'node:url',
            'node:os',
            'node:module',
            'node:util',
            'node:child_process',
            'node:dns',
            'node:buffer',
            'node:assert',
            'node:v8',
            'node:http',
            'node:https',
            'node:zlib',
            'node:net',
            'node:readline',
            'node:http2'
          ],
          output: {
            globals: {
              react: 'React',
              'react-dom': 'ReactDOM',
              'react-router-dom': 'ReactRouterDOM'
            }
          }
        },
        outDir: 'dist',
        emptyOutDir: true,
        cssCodeSplit: false,
        sourcemap: true
      }
    };
  }

  // Demo build configuration
  return {
    plugins: [react(), historyFallback()],
    // For GitHub Pages deployment, we need to set the base to the repository name
    base: mode === 'production' ? '/simple-md-viewer/' : '/',
    server: {
      port: VITE_PORT,
      strictPort: true,
      // Enable history API fallback for SPA routing
      fs: {
        strict: false
      }
    },
    preview: {
      port: VITE_PORT,
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      // Use a more compatible build configuration for GitHub Pages
      target: 'es2015',
      minify: 'terser',
      cssCodeSplit: false,
      rollupOptions: {
        output: {
          // Use a format that's more compatible with GitHub Pages
          format: 'iife',
          entryFileNames: 'assets/[name].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name].[ext]'
        }
      }
    },
    // Add this to handle client-side routing in preview mode
    appType: 'spa'
  };
});
