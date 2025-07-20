---
title: "API Reference"
description: "Complete reference for all components, props, and utility functions"
author: "Ali Safari"
lastModified: "2025-01-20"
category: "API Documentation"
section: "API"
order: 2
tags:
  - api
  - reference
  - components
  - typescript
keywords:
  - MarkdownExplorer
  - FileTree
  - MarkdownViewer
  - FrontMatterDisplay
  - API reference
  - React components
breadcrumbs:
  - name: "Documentation"
    path: "/docs"
  - name: "API"
    path: "/docs/api"
  - name: "Reference"
    path: "/docs/api/reference"
related:
  - title: "API Overview"
    path: "/docs/api/overview.md"
  - title: "Getting Started"
    path: "/docs/getting-started.md"
---

# API Reference

Complete reference for all components, props, and utility functions.

## MarkdownExplorer

The primary component providing the complete markdown exploration experience.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `fileTree` | `FileNode` | - | **Required.** The root node of the file tree |
| `rootPath` | `string` | `'/'` | Root path for navigation |
| `theme` | `'light'` \| `'dark'` \| `'auto'` | `'auto'` | Color theme |
| `className` | `string` | `''` | Additional CSS class |
| `initialRoute` | `string` | - | Initial path to navigate to |
| `onNavigate` | `(path: string, node: FileNode) => void` | - | Navigation callback |
| `enableSearch` | `boolean` | `true` | Enable search functionality |
| `searchPlaceholder` | `string` | `'Search files...'` | Search input placeholder |
| `showIcons` | `boolean` | `true` | Show file/folder icons |
| `showFileTree` | `boolean` | `true` | Show file tree sidebar |
| `renderFileIcon` | `(node: FileNode) => ReactNode` | - | Custom file icon renderer |
| `renderFolderIcon` | `(node: FileNode) => ReactNode` | - | Custom folder icon renderer |
| `sidebarWidth` | `string` | `'280px'` | Sidebar width CSS value |
| `showBreadcrumbs` | `boolean` | `true` | Show breadcrumb navigation |
| `markdownComponents` | `Record<string, ComponentType>` | - | Custom markdown components |

### Usage Examples

#### Basic Setup
```tsx
<MarkdownExplorer fileTree={myFileTree} />
```

#### With Custom Theme
```tsx
<MarkdownExplorer 
  fileTree={myFileTree}
  theme="dark"
  className="documentation-explorer"
/>
```

#### With Navigation Handling
```tsx
<MarkdownExplorer 
  fileTree={myFileTree}
  initialRoute="/docs/introduction.md"
  onNavigate={(path, node) => {
    console.log('Navigated to:', path);
    // Update router, analytics, etc.
  }}
/>
```

## FileTree

Standalone file tree navigation component.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `fileTree` | `FileNode` | - | **Required.** Root file tree node |
| `currentPath` | `string` | - | Currently selected path |
| `theme` | `'light'` \| `'dark'` \| `'auto'` | `'light'` | Color theme |
| `onNodeClick` | `(node: FileNode) => void` | - | **Required.** Node click handler |
| `enableSearch` | `boolean` | `true` | Enable search functionality |
| `searchPlaceholder` | `string` | `'Search files...'` | Search input placeholder |
| `showIcons` | `boolean` | `true` | Show file/folder icons |
| `renderFileIcon` | `(node: FileNode) => ReactNode` | - | Custom file icon renderer |
| `renderFolderIcon` | `(node: FileNode) => ReactNode` | - | Custom folder icon renderer |
| `className` | `string` | `''` | Additional CSS class |

## MarkdownViewer

Pure markdown content renderer.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `content` | `string` | - | **Required.** Markdown content |
| `theme` | `'light'` \| `'dark'` \| `'auto'` | `'light'` | Color theme |
| `className` | `string` | `''` | Additional CSS class |
| `components` | `Record<string, ComponentType>` | - | Custom markdown components |
| `filePath` | `string` | - | File path for relative links |
| `showFrontMatter` | `boolean` | `true` | Show YAML front matter display |
| `frontMatterMode` | `'full'` \| `'minimal'` \| `'header-only'` \| `'hidden'` | `'full'` | Front matter display mode |

### Custom Components Example

```tsx
const customComponents = {
  h1: ({ children }) => (
    <h1 style={{ color: '#2563eb', borderBottom: '2px solid #2563eb' }}>
      {children}
    </h1>
  ),
  code: ({ children, className }) => (
    <code className={className} style={{ background: '#f1f5f9' }}>
      {children}
    </code>
  ),
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children} ↗
    </a>
  )
};

<MarkdownViewer 
  content={markdownContent}
  components={customComponents}
/>
```

## Breadcrumbs

Navigation breadcrumb component.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `path` | `string` | - | **Required.** Current path |
| `rootPath` | `string` | `'/'` | Root path |
| `theme` | `'light'` \| `'dark'` \| `'auto'` | `'light'` | Color theme |
| `onPathClick` | `(path: string) => void` | - | **Required.** Path click handler |
| `className` | `string` | `''` | Additional CSS class |

## FrontMatterDisplay

Component for displaying YAML front matter from markdown files.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `frontMatter` | `FrontMatter` | - | **Required.** Parsed front matter object |
| `mode` | `'full'` \| `'minimal'` \| `'header-only'` | `'full'` | Display mode |

### Display Modes

- **`full`**: Shows all front matter metadata in organized sections
- **`minimal`**: Shows only basic info (author, date, version)
- **`header-only`**: Shows only title and description
- **`hidden`**: Hides front matter display entirely

### Front Matter Support

The component automatically parses YAML front matter from markdown content and supports:

- **Title & Description**: Page title and description
- **Metadata**: Author, dates, version, category, section
- **Navigation**: Breadcrumbs and related pages
- **Content Organization**: Tags, keywords, TOC settings
- **Localization**: Custom date formatting with `locale` field

#### Supported Date Locales

- `en-US` - US English (default)
- `nl-BE` - Belgian Dutch  
- `fr-BE` - Belgian French
- `be`, `belgian`, `belgium` - Shortcuts for Belgian Dutch

### Example Front Matter

```yaml
---
title: "My Document"
description: "A comprehensive guide"
author: "John Doe"
lastModified: "2025-01-20"
locale: "nl-BE"
category: "Documentation"
tags:
  - guide
  - tutorial
breadcrumbs:
  - name: "Home"
    path: "/"
  - name: "Docs" 
    path: "/docs"
---
```

## TypeScript Types

### FileNode
```typescript
interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  content?: string;
  lastModified?: string;
  size?: number;
}
```

### FrontMatter
```typescript
interface FrontMatter {
  title?: string;
  description?: string;
  author?: string;
  date?: string;
  lastModified?: string;
  version?: string;
  category?: string;
  section?: string;
  order?: number;
  tags?: string[];
  keywords?: string[];
  toc?: boolean;
  sidebar?: boolean;
  locale?: string; // Date formatting locale (e.g., 'en-US', 'nl-BE', 'fr-BE')
  breadcrumbs?: Array<{
    name: string;
    path: string;
  }>;
  related?: Array<{
    title: string;
    path: string;
  }>;
  [key: string]: any; // Allow additional custom properties
}
```

### Theme
```typescript
type Theme = 'light' | 'dark' | 'auto';
```

### NavigationState
```typescript
interface NavigationState {
  currentPath: string;
  currentNode: FileNode | null;
  history: string[];
  historyIndex: number;
}
```

## Utility Functions

### parseFileTree(files: Record<string, string>): FileNode
Converts flat file structure to hierarchical tree.

### findNodeByPath(tree: FileNode, path: string): FileNode | null
Finds node by path in the tree.

### searchNodes(tree: FileNode, query: string): FileNode[]
Searches nodes matching the query.

### generateBreadcrumbs(path: string, rootPath?: string): Array<{name: string, path: string}>
Generates breadcrumb items from path.

### isMarkdownFile(filename: string): boolean
Checks if file is a markdown file.

### getFileExtension(filename: string): string
Extracts file extension from filename.

### normalizePath(path: string): string
Normalizes path format.

### parseFrontMatter(markdown: string): ParsedMarkdown
Parses YAML front matter from markdown content and returns separated front matter and content.

```typescript
interface ParsedMarkdown {
  frontMatter: FrontMatter | null;
  content: string;
}
```

### formatDate(dateString: string, locale?: string): string
Formats a date string for display with optional locale support.

**Parameters:**
- `dateString`: ISO date string or other date format
- `locale`: Locale for formatting (defaults to 'en-US')

**Supported locales:**
- `'en-US'` - US English (default)
- `'nl-BE'` - Belgian Dutch
- `'fr-BE'` - Belgian French  
- `'be'`, `'belgian'`, `'belgium'` - Shortcuts for Belgian Dutch

**Example:**
```typescript
formatDate('2025-01-20', 'nl-BE'); // "20 januari 2025"
formatDate('2025-01-20', 'fr-BE'); // "20 janvier 2025"
```

---

This concludes the complete API reference. For examples and guides, see the other documentation sections.