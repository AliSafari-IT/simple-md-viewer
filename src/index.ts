// Main exports for the @asafarim/simple-md-viewer package
export { default as MarkdownContent } from './components/MarkdownContent';
export { default as FileTree } from './components/FileTree';
export { default as MarkdownViewer } from './components/MarkdownViewer';
export { default as HomePage } from './components/HomePage';
export { ThemeContext, ThemeProvider } from './contexts/ThemeContext';
export type { ThemeContextType } from './contexts/ThemeContext';

// Export types
export type { FileNode } from './types';

// Export the main App component for demo purposes
export { default as App } from './App';

// Export styles - users need to import these manually
import './App.css';
import './styles.css';
