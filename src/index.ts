// Main exports for the @asafarim/simple-md-viewer package
export { default as MarkdownContent } from './components/MarkdownContent';
export { default as FileTree } from './components/FileTree';
export { default as MarkdownViewer } from './components/MarkdownViewer';
export { default as HomePage } from './components/HomePage';
export { default as FrontMatterDisplay } from './components/FrontMatterDisplay';
export { ThemeContext, ThemeProvider } from './contexts/ThemeContext';
export type { ThemeContextType } from './contexts/ThemeContext';

// Export types
export type { FileNode } from './types';

// Export front matter utilities
export { parseFrontMatter, formatDate } from './utils/frontMatter';
export type { FrontMatter, ParsedMarkdown } from './utils/frontMatter';

// Export the main App component for demo purposes
export { default as App } from './App';

// Note: Users need to import styles manually:
// import '@asafarim/simple-md-viewer/dist/style.css';
