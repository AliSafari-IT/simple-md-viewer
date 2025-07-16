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

### Basic Setup

1. **Create your project structure:**
   ```
   my-docs-project/
   ├── package.json
   ├── server.js
   ├── md-docs/          # Your markdown files go here
   │   ├── README.md
   │   ├── guide.md
   │   └── api/
   │       └── reference.md
   └── dist/             # Built files (generated)
   ```

2. **Set up the server (server.js):**
   ```javascript
   const express = require("express");
   const fs = require("fs");
   const path = require("path");
   const cors = require("cors");

   const app = express();
   const PORT = 3500;
   const mdDocsPath = path.join(__dirname, "md-docs");

   // Serve static files
   app.use("/md-docs", express.static(mdDocsPath));

   // Enable CORS
   app.use(cors({
     origin: "http://localhost:3501",
     credentials: false
   }));

   // API to get folder structure
   app.get("/api/folder-structure", (req, res) => {
     try {
       const folderStructure = getFolderStructure(mdDocsPath);
       res.json({ nodes: folderStructure });
     } catch (error) {
       res.status(500).json({ error: "Failed to get folder structure" });
     }
   });

   // API to get file content
   app.get("/api/file", (req, res) => {
     try {
       const filePath = req.query.path;
       if (!filePath) {
         return res.status(400).json({ error: "File path is required" });
       }

       const fullPath = path.join(mdDocsPath, filePath);
       if (!fs.existsSync(fullPath)) {
         return res.status(404).json({ error: "File not found" });
       }

       const content = fs.readFileSync(fullPath, "utf-8");
       res.json({ content, path: filePath });
     } catch (error) {
       res.status(500).json({ error: "Failed to read file" });
     }
   });

   function getFolderStructure(dirPath, relativePath = "") {
     const items = fs.readdirSync(dirPath);
     const result = [];

     for (const item of items) {
       const itemPath = path.join(dirPath, item);
       const stats = fs.statSync(itemPath);
       const itemRelativePath = path.join(relativePath, item).replace(/\\/g, "/");

       if (stats.isDirectory()) {
         result.push({
           name: item,
           path: itemRelativePath,
           type: "folder",
           children: getFolderStructure(itemPath, itemRelativePath),
         });
       } else if (item.endsWith(".md")) {
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
     console.log(`Server running at http://localhost:${PORT}`);
   });
   ```

3. **Update your package.json:**
   ```json
   {
     "name": "my-docs-site",
     "scripts": {
       "dev": "npx kill-port 3501 && vite",
       "serve": "npx kill-port 3500 && node server.js",
       "start": "concurrently \"npm run dev\" \"npm run serve\"",
       "build": "vite build"
     },
     "dependencies": {
       "@asafarim/simple-md-viewer": "^1.0.1",
       "concurrently": "^8.2.2",
       "express": "^4.18.2",
       "cors": "^2.8.5"
     }
   }
   ```

4. **Start the application:**
   ```bash
   npm start
   ```

   This will start both the frontend (port 3501) and backend (port 3500) servers.

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

## 🛠️ Development

### Local Development Setup

```bash
# Clone the repository
git clone https://github.com/your-username/simple-md-viewer.git
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
