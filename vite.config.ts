import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import historyFallback from './vite-history-fallback';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
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
          external: ['react', 'react-dom', 'react-router-dom'],
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
