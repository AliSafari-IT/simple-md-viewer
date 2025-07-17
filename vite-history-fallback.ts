import { Plugin } from 'vite';
import type { Connect } from 'vite';
import type { ServerResponse } from 'http';

export default function historyFallback(): Plugin {
  return {
    name: 'history-fallback',
    configureServer(server) {
      server.middlewares.use((req: Connect.IncomingMessage, res: ServerResponse, next: Connect.NextFunction) => {
        // Skip API calls, Vite internal modules, and static assets
        if (
          req.url?.startsWith('/api/') ||
          req.url?.startsWith('/@') || // Vite internal modules like @vite/client, @react-refresh
          req.url?.startsWith('/node_modules/') ||
          req.url?.includes('.js') ||
          req.url?.includes('.css') ||
          req.url?.includes('.ts') ||
          req.url?.includes('.tsx') ||
          req.url?.includes('.ico') ||
          req.url?.includes('.png') ||
          req.url?.includes('.svg') ||
          req.url?.includes('.jpg') ||
          req.url?.includes('.woff') ||
          req.url?.includes('.woff2') ||
          req.url === '/'
        ) {
          return next();
        }
        
        // For all other routes (like /docs/api/overview.md), serve index.html
        req.url = '/';
        next();
      });
    },
  };
}
