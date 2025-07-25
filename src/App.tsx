import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import MarkdownContent from './components/MarkdownContent';
import './App.css';
import './styles.css';
import { useState, useEffect } from 'react';

/**
 * Demo App for @asafarim/simple-md-viewer v1.3.0
 * 
 * 🚀 Latest Features Showcased:
 * - ✅ Persistent theme preference with localStorage
 * - ✅ Mobile-responsive design with collapsible sidebar
 * - ✅ Homepage feature with showHomePage prop
 * - ✅ Configurable API base URL
 * - ✅ Global theme application to document root
 * - ✅ Package integration with @asafarim/shared
 * - ✅ Modern React 18 with TypeScript
 * - ✅ HashRouter for GitHub Pages compatibility
 * - ✅ Advanced markdown rendering with syntax highlighting
 * - ✅ Accessibility features and keyboard navigation
 * - ✅ Flexible layout with hideFileTree option
 * 
 * 📦 For production use, users would import like:
 * import { MarkdownContent, ThemeProvider } from '@asafarim/simple-md-viewer';
 * import '@asafarim/simple-md-viewer/dist/style.css';
 * 
 * 🎯 This demonstrates the complete markdown viewer experience
 * with all the latest v1.3.0 enhancements and mobile optimizations.
 */

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    // Check localStorage for saved theme preference
    const savedTheme = localStorage.getItem('smv-theme');
    return (savedTheme as 'light' | 'dark') || 'light';
  });

  // Load environment variables for API base URL
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3300';
  console.log("API Base URL:", apiBaseUrl);

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
    document.body.className = theme; // For body-level theme styles
  }, [theme]);

  return (
    <ThemeProvider theme={theme} toggleTheme={toggleTheme}>
      <div className={`app ${theme}`}>
        <Router>
          <Routes>
            <Route 
              path="/*" 
              element={
                <MarkdownContent 
                  showHomePage={true}
                  apiBaseUrl={apiBaseUrl}
                  hideFileTree={false}
                  hideHeader={false}
                  hideFooter={false}
                  showFrontMatter={true}
                  frontMatterMode={'full'}
                  packageLinks={{
                    packageName: "@asafarim/simple-md-viewer",
                    githubPath: "simple-md-viewer",
                    demoPath: "https://alisafari-it.github.io/simple-md-viewer/#/README.md",
                    show: true
                  }}
                />
              } 
            />
          </Routes>
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;
