# 📖 Simple Markdown Viewer

A beautiful, responsive markdown viewer that displays files from a specified folder with an interactive file tree navigation. Perfect for documentation sites, project wikis, and markdown-based content management.

[![npm version](https://badge.fury.io/js/@asafarim%2Fsimple-md-viewer.svg)](https://www.npmjs.com/package/@asafarim/simple-md-viewer)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- 🎨 **Dual Theme Support** - Light and dark themes with smooth transitions
- 📱 **Fully Responsive** - Works seamlessly on desktop, tablet, and mobile
- 🌳 **Interactive File Tree** - Collapsible folder navigation with persistent state
- 🎯 **URL-based Navigation** - Direct linking to specific markdown files
- ⚡ **Fast & Lightweight** - Built with React and Vite for optimal performance
- 🔍 **Syntax Highlighting** - Beautiful code block rendering
- 🎪 **Modern UI** - Glassmorphism effects, smooth animations, and gradient accents
- ♿ **Accessible** - Keyboard navigation and screen reader friendly
- 🔗 **Deep Linking** - Share direct links to specific markdown files

## 📸 Markdown Explorer Viewer Demo

<!-- Image will be displayed once the smv.png file is committed to the repository -->
See [the demo](https://alisafari-it.github.io/simple-md-viewer/#/README.md) for a live example!
![Markdown Explorer Viewer Demo](https://raw.githubusercontent.com/AliSafari-IT/simple-md-viewer/refs/heads/main/public/smv.png)

## 🚀 Quick Start

### Installation

```bash
# Using npm
npm install @asafarim/simple-md-viewer

# Using yarn
yarn add @asafarim/simple-md-viewer

# Using pnpm
pnpm add @asafarim/simple-md-viewer
```

### Basic Setup - Display Your Markdown Folder

The Simple Markdown Viewer package helps you create a beautiful web interface to display any folder containing markdown files. Here's how to set it up:

#### Step 1: Prepare Your Markdown Files

Organize your markdown files in a folder structure. The viewer will automatically detect and display all `.md` files:

```
my-docs-project/
├── package.json
├── server.js
├── src/                # React app files (from this package)
├── md-docs/            # 📁 YOUR MARKDOWN FILES GO HERE
│   ├── README.md       # Will be shown as homepage
│   ├── guide.md        # Individual files
│   ├── tutorial.md
│   ├── getting-started/
│   │   ├── installation.md
│   │   └── setup.md
│   ├── api/
│   │   ├── overview.md
│   │   └── endpoints/
│   │       ├── users.md
│   │       └── posts.md
│   └── examples/
│       ├── basic.md
│       └── advanced.md
└── dist/               # Built files (generated)
```

#### Step 2: Create the Server

Create a `server.js` file that serves your markdown folder:

2. **Set up the server (server.js):**

   ```javascript
   const express = require("express");
   const fs = require("fs");
   const path = require("path");
   const cors = require("cors");

   const app = express();
   const PORT = 3500;
   
   // 📁 Point to YOUR markdown folder
   const mdDocsPath = path.join(__dirname, "md-docs");

   // Serve static files from your markdown folder
   app.use("/md-docs", express.static(mdDocsPath));

   // Enable CORS for the frontend
   app.use(cors({
     origin: "http://localhost:3501",
     credentials: false
   }));

   // 🔍 API to scan and return your folder structure
   app.get("/api/folder-structure", (req, res) => {
     try {
       const folderStructure = getFolderStructure(mdDocsPath);
       res.json({ nodes: folderStructure });
     } catch (error) {
       console.error("Error scanning folder:", error);
       res.status(500).json({ error: "Failed to scan markdown folder" });
     }
   });

   // 📄 API to serve individual markdown files
   app.get("/api/file", (req, res) => {
     try {
       const filePath = req.query.path;
       if (!filePath) {
         return res.status(400).json({ error: "File path is required" });
       }

       const fullPath = path.join(mdDocsPath, filePath);
       
       // Security check: ensure file is within md-docs folder
       if (!fullPath.startsWith(mdDocsPath)) {
         return res.status(403).json({ error: "Access denied" });
       }

       if (!fs.existsSync(fullPath)) {
         return res.status(404).json({ error: "File not found" });
       }

       const content = fs.readFileSync(fullPath, "utf-8");
       res.json({ content, path: filePath });
     } catch (error) {
       console.error("Error reading file:", error);
       res.status(500).json({ error: "Failed to read file" });
     }
   });

   // 🔧 Function to recursively scan your markdown folder
   function getFolderStructure(dirPath, relativePath = "") {
     const items = fs.readdirSync(dirPath);
     const result = [];

     for (const item of items) {
       const itemPath = path.join(dirPath, item);
       const stats = fs.statSync(itemPath);
       const itemRelativePath = path.join(relativePath, item).replace(/\\/g, "/");

       if (stats.isDirectory()) {
         // Include folders and scan them recursively
         result.push({
           name: item,
           path: itemRelativePath,
           type: "folder",
           children: getFolderStructure(itemPath, itemRelativePath),
         });
       } else if (item.endsWith(".md")) {
         // Include only markdown files
         result.push({
           name: item,
           path: itemRelativePath,
           type: "file",
         });
       }
     }

     return result;
   }

   app.listen(PORT, () => {
     console.log(`🚀 Server running at http://localhost:${PORT}`);
     console.log(`📁 Serving markdown files from: ${mdDocsPath}`);
   });
   ```

#### Step 3: Configure Your Project

Update your `package.json` to include the necessary dependencies and scripts:

   ```json
   {
     "name": "my-docs-site",
     "version": "1.0.0",
     "description": "My documentation site powered by Simple Markdown Viewer",
     "scripts": {
       "dev": "npx kill-port 3501 && vite",
       "serve": "npx kill-port 3500 && node server.js",
       "start": "concurrently \"npm run dev\" \"npm run serve\"",
       "build": "vite build",
       "preview": "vite preview"
     },
     "dependencies": {
       "@asafarim/simple-md-viewer": "^1.0.1",
       "concurrently": "^8.2.2",
       "express": "^4.18.2",
       "cors": "^2.8.5"
     },
     "devDependencies": {
       "vite": "^4.4.5"
     }
   }
   ```

#### Step 4: Set Up the Frontend

Now you need to create a simple React app that uses the Simple Markdown Viewer package:

**Option A: Create a new React project**

```bash
# Create a new React project with Vite
npm create vite@latest my-docs-site -- --template react-ts
cd my-docs-site

# Install the Simple Markdown Viewer package
npm install @asafarim/simple-md-viewer

# Install additional dependencies
npm install express cors concurrently
```

**Option B: Add to existing React project**

```bash
# In your existing React project
npm install @asafarim/simple-md-viewer
```

**Create the main application file:**

Create or update `src/main.tsx`:

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

**Create your App component:**

Create or update `src/App.tsx`:

```typescript
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { MarkdownContent } from '@asafarim/simple-md-viewer';
import '@asafarim/simple-md-viewer/dist/style.css';

function App() {
  return (
    <BrowserRouter>
      <MarkdownContent />
    </BrowserRouter>
  );
}

export default App;
```

**Create a basic `index.html`:**

Ensure your `index.html` (in the `public` folder) has:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My Documentation Site</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

**Create a `vite.config.ts` file:**

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3501,
  },
});
```

**Install additional dev dependencies:**

```bash
npm install --save-dev @vitejs/plugin-react vite typescript @types/react @types/react-dom
```

#### Step 5: Start Your Documentation Site

```bash
# Install dependencies
npm install

# Start both frontend and backend servers
npm start
```

This will:
- 🚀 Start the markdown viewer on `http://localhost:3501`
- 📡 Start the API server on `http://localhost:3500`
- 🔍 Automatically scan your `md-docs` folder
- 🌳 Display an interactive file tree in the sidebar
- 📖 Render markdown files with syntax highlighting

### 📁 Complete Project Structure

After following the steps above, your project should look like this:

```
my-docs-site/
├── package.json                 # Dependencies and scripts
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript config (auto-generated)
├── server.js                   # Backend server for API
├── src/
│   ├── main.tsx                # React entry point
│   ├── App.tsx                 # Main App component
│   └── vite-env.d.ts           # Vite types (auto-generated)
├── public/
│   ├── index.html              # HTML template
│   └── vite.svg                # Favicon
├── md-docs/                    # 📁 YOUR MARKDOWN FILES
│   ├── README.md               # Homepage
│   ├── guide.md
│   ├── getting-started/
│   │   └── installation.md
│   └── api/
│       └── reference.md
├── node_modules/               # Dependencies
└── dist/                       # Built files (after npm run build)
```

### 🔧 Package Usage Details

When you install `@asafarim/simple-md-viewer`, you get access to these components:

```typescript
// Available exports from @asafarim/simple-md-viewer
import { 
  MarkdownContent,    // Main component that handles everything
  FileTree,          // Sidebar file tree component
  MarkdownViewer,    // Markdown renderer component
  FileNode          // TypeScript types
} from '@asafarim/simple-md-viewer';

// CSS styles (required)
import '@asafarim/simple-md-viewer/dist/style.css';
```

**Most users will only need the `MarkdownContent` component**, which includes:
- ✅ File tree navigation
- ✅ Markdown rendering
- ✅ Theme switching
- ✅ Responsive design
- ✅ URL routing

### 🎯 What Happens Next?

1. **Automatic Folder Scanning**: The viewer automatically scans your `md-docs` folder and creates a navigable file tree
2. **File Tree Navigation**: Click on any file in the sidebar to view its content
3. **URL-based Navigation**: Each file gets its own URL for easy sharing
4. **Theme Support**: Users can toggle between light and dark themes
5. **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices

### 🔧 Customizing Your Folder Path

You can point the viewer to any folder containing markdown files:

```javascript
// In server.js, change the folder path
const mdDocsPath = path.join(__dirname, "my-custom-docs-folder");
// or use an absolute path
const mdDocsPath = "/path/to/your/documentation";
// or use environment variables
const mdDocsPath = process.env.DOCS_PATH || path.join(__dirname, "md-docs");
```

### 📁 Supported Folder Structures

The viewer works with any folder structure containing `.md` files:

```
✅ Simple flat structure:
docs/
├── README.md
├── guide.md
├── tutorial.md
└── faq.md

✅ Nested documentation:
documentation/
├── README.md
├── getting-started/
│   ├── installation.md
│   └── configuration.md
├── api/
│   ├── overview.md
│   └── endpoints/
│       ├── users.md
│       └── posts.md
└── examples/
    └── code-samples.md

✅ Project wiki:
wiki/
├── README.md
├── development/
│   ├── setup.md
│   └── guidelines.md
└── deployment/
    └── production.md

✅ Blog or articles:
blog/
├── README.md
├── 2024/
│   ├── article-1.md
│   └── article-2.md
└── categories/
    └── technology.md
```

### ⚡ Quick Examples

#### Example 1: Complete Setup from Scratch

```bash
# 1. Create a new project
mkdir my-docs-site
cd my-docs-site

# 2. Initialize npm project
npm init -y

# 3. Install the Simple Markdown Viewer package
npm install @asafarim/simple-md-viewer

# 4. Install additional dependencies
npm install express cors concurrently
npm install --save-dev vite @vitejs/plugin-react typescript @types/react @types/react-dom

# 5. Create your markdown folder and files
mkdir md-docs
echo "# My Documentation\nWelcome to my docs!" > md-docs/README.md
echo "# Getting Started\nLet's begin..." > md-docs/getting-started.md

# 6. Create the server.js file (copy from Step 2 above)
# 7. Create the React app files (copy from Step 4 above)
# 8. Update package.json scripts (copy from Step 3 above)

# 9. Start your documentation site
npm start
```

#### Example 2: Using the Package in Your App

```typescript
// src/App.tsx - Basic usage
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { MarkdownContent } from '@asafarim/simple-md-viewer';
import '@asafarim/simple-md-viewer/dist/style.css';

function App() {
  return (
    <BrowserRouter>
      <div className="my-app">
        <header>
          <h1>My Custom Documentation Site</h1>
        </header>
        <main>
          <MarkdownContent />
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
```

#### Example 3: Advanced Usage with Custom Components

```typescript
// src/App.tsx - Advanced usage with individual components
import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { 
  FileTree, 
  MarkdownViewer, 
  FileNode 
} from '@asafarim/simple-md-viewer';
import '@asafarim/simple-md-viewer/dist/style.css';

function App() {
  const [fileTree, setFileTree] = useState<FileNode | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [content, setContent] = useState<string>('');

  // Custom logic for fetching files
  useEffect(() => {
    // Fetch your file tree and content
    // This gives you full control over the data fetching
  }, []);

  return (
    <BrowserRouter>
      <div className="custom-layout">
        <aside className="sidebar">
          <h2>My Custom Sidebar</h2>
          <FileTree 
            fileTree={fileTree}
            onFileSelect={setSelectedFile}
            selectedFile={selectedFile}
          />
        </aside>
        <main className="content">
          <MarkdownViewer content={content} />
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
```

#### Example 4: Display Your Project Documentation

```bash
# If you have existing markdown files in your project
cd my-existing-project

# Install the viewer package
npm install @asafarim/simple-md-viewer express cors concurrently

# Create the server and React setup (follow steps 2-4 above)
# Point the server to your existing docs folder
# In server.js, change:
const mdDocsPath = path.join(__dirname, "docs"); // or wherever your .md files are

# Start the viewer
npm start
```

#### Example 5: Display Existing Documentation

If you already have a folder with markdown files:

```bash
# Point the server to your existing docs
# In server.js, change the path to your documentation folder:
const mdDocsPath = path.join(__dirname, "path/to/your/existing/docs");

# Or use environment variable for flexibility
const mdDocsPath = process.env.DOCS_PATH || path.join(__dirname, "md-docs");

# Then start with custom path
DOCS_PATH=/path/to/docs npm start
```

#### Example 6: Multiple Documentation Sets

You can create multiple instances for different documentation sets:

```javascript
// server.js - serve multiple doc sets
const express = require("express");
const app = express();

// Documentation set 1: API docs
app.use("/api-docs", express.static("./api-documentation"));

// Documentation set 2: User guides  
app.use("/user-guides", express.static("./user-documentation"));

// Configure different endpoints for each set
app.get("/api/api-docs/folder-structure", (req, res) => {
  const folderStructure = getFolderStructure("./api-documentation");
  res.json({ nodes: folderStructure });
});

app.get("/api/user-guides/folder-structure", (req, res) => {
  const folderStructure = getFolderStructure("./user-documentation");
  res.json({ nodes: folderStructure });
});
```

## 📚 Use Cases & Examples

### 1. 📖 **Documentation Site**

Perfect for project documentation with nested folder structure:

```
docs/
├── README.md
├── getting-started/
│   ├── installation.md
│   ├── configuration.md
│   └── first-steps.md
├── api/
│   ├── overview.md
│   ├── authentication.md
│   └── endpoints/
│       ├── users.md
│       └── posts.md
└── examples/
    ├── basic-usage.md
    └── advanced-features.md
```

**Example markdown content:**

```markdown
# Getting Started

Welcome to our documentation! This guide will help you get up and running quickly.

## Installation

```bash
npm install awesome-package
```

## Quick Example

```javascript
import { AwesomePackage } from 'awesome-package';

const app = new AwesomePackage({
  apiKey: 'your-api-key'
});
```

### 2. 🏢 **Team Wiki**

Organize team knowledge and processes:

```
wiki/
├── README.md
├── onboarding/
│   ├── new-hire-checklist.md
│   └── company-policies.md
├── processes/
│   ├── code-review.md
│   ├── deployment.md
│   └── incident-response.md
└── resources/
    ├── tools.md
    └── learning-materials.md
```

### 3. 📝 **Blog/Articles**

Share articles and blog posts:

```
blog/
├── README.md
├── 2024/
│   ├── 01-january/
│   │   ├── new-year-resolutions.md
│   │   └── tech-trends-2024.md
│   └── 02-february/
│       └── react-best-practices.md
└── categories/
    ├── technology.md
    └── productivity.md
```

### 4. 🎓 **Educational Content**

Create learning materials and courses:

```
course/
├── README.md
├── module-1-basics/
│   ├── introduction.md
│   ├── concepts.md
│   └── exercises.md
├── module-2-advanced/
│   ├── advanced-topics.md
│   └── projects.md
└── resources/
    ├── cheat-sheet.md
    └── references.md
```

### 5. 🔧 **Project Specifications**

Document project requirements and specifications:

```
specs/
├── README.md
├── requirements/
│   ├── functional.md
│   └── non-functional.md
├── architecture/
│   ├── system-design.md
│   └── database-schema.md
└── testing/
    ├── test-plan.md
    └── user-acceptance.md
```

## ⚙️ Configuration Options

### Environment Variables

Create a `.env` file to customize your setup:

```env
# Server Configuration
SERVER_PORT=3500
CLIENT_PORT=3501
DOCS_FOLDER=md-docs

# CORS Settings
CORS_ORIGIN=http://localhost:3501

# Theme Settings
DEFAULT_THEME=light
```

### Custom Styling

Override default styles by modifying the CSS custom properties:

```css
:root {
  --accent-primary-light: #your-color;
  --accent-primary-dark: #your-dark-color;
  --font-family-primary: 'Your-Font', sans-serif;
}
```

## 🔧 Troubleshooting Common Issues

### Problem: "No files available" in the sidebar

**Solution**: Check your folder structure and server configuration:

```bash
# Verify your md-docs folder exists and contains .md files
ls -la md-docs/

# Check server logs for folder scanning errors
npm run serve
```

### Problem: "Failed to load file tree" error

**Solutions**:
1. **Check server is running**: Make sure `http://localhost:3500` is accessible
2. **Verify CORS settings**: Ensure CORS origin matches your frontend URL
3. **Check folder permissions**: Ensure the server can read your markdown folder

```javascript
// Debug: Add logging to see what's happening
console.log('Scanning folder:', mdDocsPath);
console.log('Found files:', fs.readdirSync(mdDocsPath));
```

### Problem: Files not loading or showing 404 errors

**Solutions**:
1. **Check file paths**: Ensure file paths don't have special characters
2. **Verify file encoding**: Make sure files are saved as UTF-8
3. **Check relative paths**: Verify the server is serving files from the correct directory

```javascript
// Debug: Log file access attempts
app.get("/api/file", (req, res) => {
  console.log('Requested file:', req.query.path);
  console.log('Full path:', path.join(mdDocsPath, req.query.path));
  // ... rest of the code
});
```

### Problem: Styling issues or blank page

**Solutions**:
1. **Check Vite config**: Ensure your `vite.config.ts` is properly configured
2. **Verify CSS imports**: Make sure you're importing the styles correctly
3. **Check browser console**: Look for JavaScript errors

```typescript
// Make sure you're importing the styles
import '@asafarim/simple-md-viewer/dist/style.css';
```

### Problem: Port conflicts

**Solution**: Change the default ports in your configuration:

```json
{
  "scripts": {
    "dev": "npx kill-port 3502 && vite --port 3502",
    "serve": "npx kill-port 3501 && node server.js",
    "start": "concurrently \"npm run dev\" \"npm run serve\""
  }
}
```

```javascript
// In server.js, update CORS origin
app.use(cors({
  origin: "http://localhost:3502", // Match your new frontend port
  credentials: false
}));
```

## 🎨 Theming

The viewer supports both light and dark themes with automatic persistence:

```javascript
// Theme is automatically saved to localStorage
// Users can toggle between themes using the theme button
// Theme preference persists across browser sessions
```

### Custom Theme Colors

```css
/* Light theme customization */
:root {
  --bg-color-light: #ffffff;
  --text-color-light: #333333;
  --accent-primary-light: #2196f3;
  --header-bg-light: #f8f9fa;
}

/* Dark theme customization */
:root {
  --bg-color-dark: #1e1e1e;
  --text-color-dark: #e0e0e0;
  --accent-primary-dark: #64b5f6;
  --header-bg-dark: #252526;
}
```

## 📱 Responsive Design

The viewer automatically adapts to different screen sizes:

- **Desktop (1024px+)**: Full sidebar and content layout
- **Tablet (768px-1024px)**: Compressed sidebar
- **Mobile (<768px)**: Collapsible sidebar that becomes a top panel

## 🔗 URL Structure

The viewer supports clean URLs for deep linking:

```
http://localhost:3501/                    # Homepage (README.md)
http://localhost:3501/guide.md            # Direct file access
http://localhost:3501/api/reference.md    # Nested file access
http://localhost:3501/docs/getting-started.md  # Deep nested access
```

## 🚀 Advanced Usage

### Custom Server Setup

For production deployment:

```javascript
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3500;

// Serve built React app
app.use(express.static(path.join(__dirname, 'dist')));

// API routes
app.use('/api', require('./routes/api'));

// Handle React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.listen(PORT);
```

### Docker Deployment

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3500
CMD ["npm", "start"]
```

### GitHub Pages Deployment

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

## � Deployment Options

### 1. Local Development Server

Perfect for local documentation viewing:

```bash
# Start development mode
npm start

# Access your docs at http://localhost:3501
```

### 2. Production Server

For hosting your documentation online:

```javascript
// production-server.js
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files (your built React app)
app.use(express.static(path.join(__dirname, 'dist')));

// Serve markdown files
app.use('/md-docs', express.static(path.join(__dirname, 'md-docs')));

// API routes (same as development)
// ... include your API routes here

// Handle React Router (for client-side routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Documentation site running on port ${PORT}`);
});
```

### 3. Static Site Generation (GitHub Pages)

For static hosting without a backend server:

```bash
# Build your site
npm run build

# Deploy the dist folder to any static host
# (GitHub Pages, Netlify, Vercel, etc.)
```

### 4. Docker Deployment

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code and markdown files
COPY . .

# Build the frontend
RUN npm run build

# Expose port
EXPOSE 3000

# Start the production server
CMD ["node", "production-server.js"]
```

### 5. Integration with Existing Projects

Add documentation to an existing project:

```javascript
// In your existing Express app
const express = require('express');
const app = express();

// Your existing routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

// Add documentation routes
app.use('/docs-static', express.static('./documentation'));
app.get('/api/docs/folder-structure', (req, res) => {
  // Handle docs folder structure
});
app.get('/api/docs/file', (req, res) => {
  // Handle docs file serving
});

// Serve the documentation viewer at /docs
app.use('/docs', express.static('./dist'));
```

## �🛠️ Development

### Local Development Setup

```bash
# Clone the repository
git clone https://github.com/AliSafari-IT/simple-md-viewer.git
cd simple-md-viewer

# Install dependencies
pnpm install

# Start development servers
pnpm start
```

### Building for Production

```bash
# Build the application
pnpm build

# Preview the build
pnpm preview
```

### Project Structure

```
simple-md-viewer/
├── src/
│   ├── components/
│   │   ├── FileTree.tsx
│   │   └── MarkdownViewer.tsx
│   ├── App.tsx
│   ├── App.css
│   └── main.tsx
├── public/
├── md-docs/           # Your markdown content
├── server.js          # Express server
└── package.json
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `npm test`
5. Commit: `git commit -m 'Add amazing feature'`
6. Push: `git push origin feature/amazing-feature`
7. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [React](https://reactjs.org/) and [Vite](https://vitejs.dev/)
- Markdown rendering powered by [react-markdown](https://github.com/remarkjs/react-markdown)
- Syntax highlighting by [react-syntax-highlighter](https://github.com/react-syntax-highlighter/react-syntax-highlighter)
- Icons and styling inspired by modern design systems

## 📞 Support

- 📧 Email: [contact@asafarim.com](mailto:contact@asafarim.com)
- 🐛 Issues: [GitHub Issues](https://github.com/AliSafari-IT/simple-md-viewer/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/AliSafari-IT/simple-md-viewer/discussions)

---

**Made with ❤️ by [SMV simple-md-viewer](https://github.com/AliSafari-IT/simple-md-viewer)**

*Happy documenting! 📖✨*
