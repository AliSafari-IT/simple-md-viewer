# @asafarim/simple-md-viewer

A professional, responsive markdown viewer library for React applications that displays markdown files from a specified folder structure with an elegant file tree navigation.

[![npm version](https://badge.fury.io/js/@asafarim%2Fsimple-md-viewer.svg)](https://www.npmjs.com/package/@asafarim/simple-md-viewer)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://alisafari-it.github.io/simple-md-viewer/)

## ✨ Features

- 🎨 **Modern UI with Theming**: Built-in light/dark themes with glassmorphism effects and smooth animations
- 📱 **Fully Responsive**: Professional mobile-first design that works perfectly on all devices
- 🌳 **Interactive File Tree**: Collapsible folder navigation with persistent state and smooth transitions
- 📖 **Advanced Markdown Rendering**: Complete markdown support with syntax highlighting and custom styling
- 🚀 **Zero Configuration**: Works out of the box with minimal setup required
- 🔧 **Highly Customizable**: Flexible theming system and component composition
- 🎯 **URL-based Navigation**: Direct linking to specific markdown files with browser history support
- ⚡ **High Performance**: Built with React 18, Vite, and optimized for speed
- 🔗 **Package Integration**: Built-in support for npm package links and GitHub repository links
- ♿ **Accessibility**: WCAG compliant with keyboard navigation and screen reader support

## 🎪 Live Demo

Experience the viewer in action: **[Live Demo](https://alisafari-it.github.io/simple-md-viewer/#/)**

![Simple Markdown Viewer Demo](https://raw.githubusercontent.com/AliSafari-IT/simple-md-viewer/main/public/smv.png)

## 📦 Installation

```bash
npm install @asafarim/simple-md-viewer
```

## 🚀 Quick Start

### Option 1: Complete Markdown Viewer (Recommended)

The easiest way to get started - includes everything you need:

```tsx
import React, { useState, useEffect } from 'react';
import { HashRouter } from 'react-router-dom';
import { MarkdownContent, ThemeProvider } from '@asafarim/simple-md-viewer';
import '@asafarim/simple-md-viewer/dist/style.css';

function App() {
  const [theme, setTheme] = useState(() => {
    // Check localStorage for saved theme preference
    const savedTheme = localStorage.getItem('smv-theme');
    return savedTheme || 'light';
  });

  const toggleTheme = () => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      localStorage.setItem('smv-theme', newTheme);
      return newTheme;
    });
  };

  // Apply theme to document root for global styling
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeProvider theme={theme} toggleTheme={toggleTheme}>
      <div className={`app ${theme}`}>
        <HashRouter>
          <MarkdownContent 
            apiBaseUrl="http://localhost:3500" 
            showHomePage={true}
          />
        </HashRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;
```

### Option 2: Individual Components

For more control, use individual components:

```tsx
import React, { useState, useEffect } from 'react';
import { 
  MarkdownViewer, 
  FileTree, 
  ThemeProvider 
} from '@asafarim/simple-md-viewer';
import '@asafarim/simple-md-viewer/dist/style.css';

function CustomApp() {
  const [content, setContent] = useState('# Hello World\nYour markdown here...');
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('smv-theme') || 'light';
  });

  const toggleTheme = () => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      localStorage.setItem('smv-theme', newTheme);
      return newTheme;
    });
  };

  // Apply theme globally
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeProvider theme={theme} toggleTheme={toggleTheme}>
      <div className={`app ${theme}`}>
        <MarkdownViewer content={content} />
      </div>
    </ThemeProvider>
  );
}
```

## 🏗️ Backend Setup

Create a simple Express server to serve your markdown files:

```javascript
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3500;
const mdDocsPath = path.join(__dirname, 'md-docs'); // Your markdown folder

app.use(cors({ origin: 'http://localhost:3501' }));

// API to return folder structure
app.get('/api/folder-structure', (req, res) => {
  const folderStructure = getFolderStructure(mdDocsPath);
  res.json({ nodes: folderStructure });
});

// API to serve markdown files
app.get('/api/file', (req, res) => {
  const filePath = path.join(mdDocsPath, req.query.path);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf-8');
    res.json({ content });
  } else {
    res.status(404).json({ error: 'File not found' });
  }
});

function getFolderStructure(dirPath, relativePath = '') {
  const items = fs.readdirSync(dirPath);
  const result = [];

  for (const item of items) {
    const itemPath = path.join(dirPath, item);
    const stats = fs.statSync(itemPath);
    const itemRelativePath = path.join(relativePath, item).replace(/\\/g, '/');

    if (stats.isDirectory()) {
      result.push({
        name: item,
        path: itemRelativePath,
        type: 'folder',
        children: getFolderStructure(itemPath, itemRelativePath)
      });
    } else if (item.endsWith('.md')) {
      result.push({
        name: item,
        path: itemRelativePath,
        type: 'file'
      });
    }
  }

  return result;
}

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
```

## 🎨 Styling & Theming

### Import Required Styles

```tsx
import '@asafarim/simple-md-viewer/dist/style.css';
```

### Theme Customization

Override CSS custom properties to customize the appearance:

```css
:root {
  /* Light theme colors */
  --bg-color-light: #ffffff;
  --text-color-light: #333333;
  --accent-primary-light: #2196f3;
  --header-bg-light: #f8f9fa;
  
  /* Dark theme colors */
  --bg-color-dark: #1e1e1e;
  --text-color-dark: #e0e0e0;
  --accent-primary-dark: #64b5f6;
  --header-bg-dark: #252526;
  
  /* Typography */
  --font-family-primary: 'Inter', -apple-system, sans-serif;
  
  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
}
```

## 📚 API Reference

### Components

#### `MarkdownContent`
The main component providing a complete markdown viewer experience.

```tsx
<MarkdownContent 
  apiBaseUrl="http://localhost:3500"
  showHomePage={true}
/>
```

**Props:**
- `apiBaseUrl?` (string): Base URL for API endpoints (default: "http://localhost:3500")
- `showHomePage?` (boolean): Whether to show homepage when no file is selected (default: true)

#### `ThemeProvider`
Provides theme context to all child components.

```tsx
<ThemeProvider theme="light" toggleTheme={() => setTheme('dark')}>
  {children}
</ThemeProvider>
```

**Props:**
- `theme` ("light" | "dark"): Current theme
- `toggleTheme?` (function): Optional theme toggle function
- `children` (ReactNode): Child components

#### `MarkdownViewer`
Renders markdown content with syntax highlighting.

```tsx
<MarkdownViewer content="# Hello World\nYour markdown content here..." />
```

**Props:**
- `content` (string): Markdown content to render

#### `FileTree`
Interactive file tree navigation component.

```tsx
<FileTree 
  fileTree={fileTreeData}
  onFileSelect={(path) => handleFileSelect(path)}
  selectedFile="/current/file.md"
/>
```

**Props:**
- `fileTree` (FileNode | null): File tree data structure
- `onFileSelect` (function): Callback when a file is selected
- `selectedFile` (string | null): Currently selected file path

#### `HomePage`
Landing page component showing available documentation.

```tsx
<HomePage 
  fileTree={fileTreeData}
  findReadmeNode={findReadmeFunction}
  loading={false}
/>
```

**Props:**
- `fileTree` (FileNode | null): File tree data
- `findReadmeNode` (function): Function to find README file
- `loading` (boolean): Loading state

### Types

#### `FileNode`
```typescript
interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'folder';
  children?: FileNode[];
}
```

#### `ThemeContextType`
```typescript
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme?: () => void;
}
```

## 🔧 Complete Project Setup

### 1. Create Your Documentation Project

```bash
mkdir my-docs-site
cd my-docs-site
npm init -y
```

### 2. Install Dependencies

```bash
npm install @asafarim/simple-md-viewer react react-dom react-router-dom
npm install --save-dev vite @vitejs/plugin-react typescript
npm install express cors concurrently
```

### 3. Create Project Structure

```
my-docs-site/
├── package.json
├── vite.config.ts
├── server.js
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   └── vite-env.d.ts
├── public/
│   └── index.html
└── md-docs/                    # Your markdown files
    ├── README.md
    ├── getting-started.md
    └── api/
        └── reference.md
```

### 4. Configure Vite

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3501,
  },
});
```

### 5. Setup Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "serve": "node server.js",
    "start": "concurrently \"npm run dev\" \"npm run serve\""
  }
}
```

### 6. Create Your App

```tsx
// src/App.tsx
import React, { useState, useEffect } from 'react';
import { HashRouter } from 'react-router-dom';
import { MarkdownContent, ThemeProvider } from '@asafarim/simple-md-viewer';
import '@asafarim/simple-md-viewer/dist/style.css';

function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('smv-theme') || 'light';
  });

  const toggleTheme = () => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      localStorage.setItem('smv-theme', newTheme);
      return newTheme;
    });
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeProvider theme={theme} toggleTheme={toggleTheme}>
      <div className={`app ${theme}`}>
        <HashRouter>
          <MarkdownContent 
            apiBaseUrl="http://localhost:3500"
            showHomePage={true}
          />
        </HashRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;
```

```tsx
// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### 7. Run Your Documentation Site

```bash
npm start
```

Your documentation site will be available at `http://localhost:3501`

## 📱 Mobile Responsiveness

The viewer is fully responsive with:

- **Mobile (< 768px)**: Collapsible sidebar overlay with touch-friendly navigation
- **Tablet (768px - 1024px)**: Optimized layout with compressed sidebar
- **Desktop (> 1024px)**: Full sidebar and content layout

### Mobile-Specific Features

- Touch-friendly navigation
- Collapsible sidebar with backdrop overlay
- Optimized typography scaling
- Gesture-friendly interface elements
- Proper viewport handling

## 🎯 Use Cases

### 1. 📖 Project Documentation
Perfect for API documentation, user guides, and technical specifications.

### 2. 🏢 Team Knowledge Base
Organize team processes, onboarding materials, and internal documentation.

### 3. 📝 Blog & Articles
Create a clean, navigable blog or article collection.

### 4. 🎓 Educational Content
Build course materials, tutorials, and learning resources.

### 5. 📋 Specification Documents
Document project requirements, architecture, and technical specifications.

## 🔧 Advanced Configuration

### Environment Variables

```env
# .env
VITE_API_BASE_URL=http://localhost:3500
VITE_DEFAULT_THEME=light
```

### Custom Package Links

The viewer includes built-in support for package links:

```tsx
import { CollapsiblePackageLinks } from '@asafarim/simple-md-viewer';

<CollapsiblePackageLinks
  packageName="@asafarim/simple-md-viewer"
  githubPath="AliSafari-IT/simple-md-viewer"
  demoPath="https://alisafari-it.github.io/simple-md-viewer/"
/>
```

### Advanced Theme Configuration

```tsx
import { ThemeProvider } from '@asafarim/simple-md-viewer';

function App() {
  const [theme, setTheme] = useState(() => {
    // Check localStorage and system preference
    const savedTheme = localStorage.getItem('smv-theme');
    if (savedTheme) return savedTheme;
    
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  const toggleTheme = () => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      localStorage.setItem('smv-theme', newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
      return newTheme;
    });
  };

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      if (!localStorage.getItem('smv-theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <ThemeProvider theme={theme} toggleTheme={toggleTheme}>
      {/* Your app content */}
    </ThemeProvider>
  );
}
```

## 🚀 Deployment

### GitHub Pages

```bash
# Build your project
npm run build

# Deploy to GitHub Pages
npm run deploy
```

### Netlify/Vercel

Simply connect your repository and deploy the `dist` folder.

### Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3501
CMD ["npm", "start"]
```

## 🛠️ Development

### Local Development

```bash
git clone https://github.com/AliSafari-IT/simple-md-viewer.git
cd simple-md-viewer
npm install
npm start
```

### Building the Library

```bash
npm run build:lib    # Build library for npm
npm run build        # Build demo application
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](https://github.com/AliSafari-IT/simple-md-viewer/blob/main/CONTRIBUTING.md).

### Development Workflow

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/AliSafari-IT/simple-md-viewer/blob/main/LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [React](https://reactjs.org/) and [Vite](https://vitejs.dev/)
- Powered by [react-markdown](https://github.com/remarkjs/react-markdown)
- Syntax highlighting by [react-syntax-highlighter](https://github.com/react-syntax-highlighter/react-syntax-highlighter)
- Package links from [@asafarim/shared](https://www.npmjs.com/package/@asafarim/shared)

## 📞 Support & Links

- 📦 **NPM Package**: [npmjs.com/package/@asafarim/simple-md-viewer](https://www.npmjs.com/package/@asafarim/simple-md-viewer)
- 🌐 **Live Demo**: [alisafari-it.github.io/simple-md-viewer](https://alisafari-it.github.io/simple-md-viewer/#/)
- 📂 **GitHub Repository**: [github.com/AliSafari-IT/simple-md-viewer](https://github.com/AliSafari-IT/simple-md-viewer)
- 🐛 **Issues**: [GitHub Issues](https://github.com/AliSafari-IT/simple-md-viewer/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/AliSafari-IT/simple-md-viewer/discussions)

---

**Made with ❤️ by [Ali Safari](https://github.com/AliSafari-IT)**

*Transform your markdown files into a beautiful, professional documentation site! 📖✨*
