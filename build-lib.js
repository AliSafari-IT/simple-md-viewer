const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Building library...');

// First, create a temporary vite.config.js that only externalizes React dependencies
const tempConfigContent = `
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'SimpleMarkdownViewer',
      fileName: (format) => \`index.\${format === 'es' ? 'esm' : format}.js\`,
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
});
`;

// Write temporary config
fs.writeFileSync('vite.lib.config.js', tempConfigContent);

try {
  // Run vite build with the temporary config
  execSync('vite build --config vite.lib.config.js', { stdio: 'inherit' });
  
  // Run TypeScript for declarations
  execSync('tsc --project tsconfig.build.json', { stdio: 'inherit' });
  
  // Create CSS declaration file
  fs.writeFileSync(
    'dist/style.css.d.ts', 
    'declare module "@asafarim/simple-md-viewer/style.css";\ndeclare module "@asafarim/simple-md-viewer/dist/style.css";'
  );
  
  console.log('Library build completed successfully!');
} catch (error) {
  console.error('Library build failed:', error);
  process.exit(1);
} finally {
  // Clean up temporary config
  fs.unlinkSync('vite.lib.config.js');
}
