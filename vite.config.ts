import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// Vite configuration for the Simple Markdown Viewer package
export default defineConfig(({ mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd(), '');
  const VITE_PORT = parseInt(env.VITE_PORT) || 5173;
  
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
          external: (id) => {
            // Always externalize React dependencies
            if (['react', 'react-dom', 'react-router-dom'].includes(id)) {
              return true;
            }
            
            // Externalize all Node.js built-in modules
            if (id.startsWith('node:') || [
              'fs', 'path', 'os', 'crypto', 'util', 'stream', 'events', 'assert',
              'net', 'url', 'http', 'https', 'zlib', 'buffer', 'tls', 'querystring',
              'module', 'dns', 'readline', 'http2', 'child_process', 'worker_threads',
              'fsevents', 'tty'
            ].includes(id)) {
              return true;
            }
            
            return false;
          },
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

  // Default config for development/build
  return {
    plugins: [react()],
    server: {
      port: VITE_PORT,
      host: true
    },
    define: {
      // Ensure import.meta.env is available
      'import.meta.env.VITE_API_BASE_URL': JSON.stringify(env.VITE_API_BASE_URL || 'http://localhost:3500'),
      'import.meta.env.VITE_PORT': JSON.stringify(VITE_PORT.toString())
    },
    optimizeDeps: {
      exclude: [
        'chokidar',
        '@rollup/rollup-linux-x64-gnu',
        '@rollup/rollup-win32-x64-msvc'
      ],
      // Force include React dependencies to avoid issues
      include: ['react', 'react-dom', 'react-router-dom']
    },
    resolve: {
      conditions: ['default', 'module', 'browser', 'development|production'],
      alias: {
        'fsevents': resolve(__dirname, 'fsevents-shim.js')
      }
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      rollupOptions: {
        external: (id) => {
          // Externalize problematic dependencies but not fsevents (we have a shim)
          if (id === 'chokidar' || id.startsWith('@rollup/rollup-')) {
            return true;
          }
          return false;
        }
      }
    }
  };
});
