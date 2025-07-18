// Test file to verify library exports
import { 
  MarkdownContent, 
  FileTree, 
  MarkdownViewer, 
  HomePage, 
  ThemeProvider, 
  ThemeContext,
  App
} from './dist/index.esm.js';

console.log('✅ Library exports test:');
console.log('MarkdownContent:', typeof MarkdownContent);
console.log('FileTree:', typeof FileTree);
console.log('MarkdownViewer:', typeof MarkdownViewer);
console.log('HomePage:', typeof HomePage);
console.log('ThemeProvider:', typeof ThemeProvider);
console.log('ThemeContext:', typeof ThemeContext);
console.log('App:', typeof App);

console.log('✅ All exports are available!');
