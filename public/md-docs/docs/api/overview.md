---
title: "API Overview"
description: "Comprehensive API documentation for the Markdown Explorer Viewer component with core components, data types, and utility functions"
category: "API Documentation"
section: "API"
order: 1
tags:
  - api
  - components
  - typescript
  - documentation
keywords:
  - MarkdownExplorer
  - FileTree
  - MarkdownViewer
  - API reference
  - React components
author: "Ali Safari"
lastModified: "2025-07-19"
version: "1.3.7"
toc: true
sidebar: true
breadcrumbs:
  - name: "Documentation"
    path: "/docs"
  - name: "API"
    path: "/docs/api"
  - name: "Overview"
    path: "/docs/api/overview"
related:
  - title: "API Reference"
    path: "/simple-md-viewer/#/docs/api/reference.md"
  - title: "Getting Started"
    path: "/simple-md-viewer/#/docs/getting-started.md"
  - title: "Examples"
    path: "/simple-md-viewer/#/docs/examples"
---

# API Overview

The Markdown Explorer Viewer provides a comprehensive API for customizing and controlling the component behavior.

## Core Components

### MarkdownExplorer

The main component that orchestrates the entire experience.

**Props:**
- `fileTree`: FileNode - The hierarchical file structure
- `theme`: 'light' | 'dark' | 'auto' - Color theme
- `enableSearch`: boolean - Enable/disable search functionality
- `showBreadcrumbs`: boolean - Show navigation breadcrumbs
- `onNavigate`: function - Callback for navigation events

### FileTree

Standalone file tree component for custom layouts.

**Props:**
- `fileTree`: FileNode - File structure to display
- `currentPath`: string - Currently selected path
- `onNodeClick`: function - Handle file/folder clicks
- `enableSearch`: boolean - Enable search within tree

### MarkdownViewer

Pure markdown rendering component.

**Props:**
- `content`: string - Markdown content to render
- `theme`: 'light' | 'dark' | 'auto' - Color theme
- `components`: object - Custom React components for markdown elements

## Data Types

### FileNode

```typescript
interface FileNode {
  name: string;           // Display name
  path: string;           // Full path identifier
  type: 'file' | 'folder'; // Node type
  children?: FileNode[];  // Child nodes (folders only)
  content?: string;       // File content (files only)
  lastModified?: string;  // ISO date string
  size?: number;          // File size in bytes
}
```

## Utility Functions

### parseFileTree(files: Record<string, string>): FileNode

Converts a flat file structure into a hierarchical tree.

```typescript
const files = {
  '/docs/readme.md': '# Documentation',
  '/docs/api/overview.md': '# API Overview'
};

const tree = parseFileTree(files);
```

### findNodeByPath(tree: FileNode, path: string): FileNode | null

Locates a specific node in the file tree.

```typescript
const node = findNodeByPath(fileTree, '/docs/api/overview.md');
```

### searchNodes(tree: FileNode, query: string): FileNode[]

Searches for nodes matching the given query.

```typescript
const results = searchNodes(fileTree, 'api');
```

## Event Handling

### Navigation Events

```typescript
const handleNavigate = (path: string, node: FileNode) => {
  // Called when user navigates to a different file/folder
  console.log('Navigated to:', path);
  
  // Update browser URL
  window.history.pushState({}, '', `/docs\$path}`);
  
  // Track analytics
  analytics.track('documentation_view', { path });
};
```

### Search Events

Search is handled internally, but you can control it programmatically:

```typescript
// Custom search implementation
const MyCustomExplorer = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const filteredTree = useMemo(() => {
    return searchQuery 
      ? filterTreeByQuery(fileTree, searchQuery)
      : fileTree;
  }, [fileTree, searchQuery]);

  return (
    <MarkdownExplorer
      fileTree={filteredTree}
      enableSearch={false} // Disable built-in search
    />
  );
};
```

For more detailed examples, see the [API Reference](/docs/api/reference.md).