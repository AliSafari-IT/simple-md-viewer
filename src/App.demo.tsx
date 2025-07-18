import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import MarkdownContent from './components/MarkdownContent';
import './App.css';
import './styles.css';
import { useState, useEffect } from 'react';

/**
 * Demo App for @asafarim/simple-md-viewer v1.3.0
 * 
 * This showcases the latest features:
 * - Persistent theme preference with localStorage
 * - Mobile-responsive design
 * - Homepage feature
 * - Configurable API base URL
 * - Global theme application
 * - Package integration features
 * 
 * For production use, users would import like:
 * import { MarkdownContent, ThemeProvider } from '@asafarim/simple-md-viewer';
 * import '@asafarim/simple-md-viewer/dist/style.css';
 */

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    // Check localStorage for saved theme preference
    const savedTheme = localStorage.getItem('smv-theme');
    return (savedTheme as 'light' | 'dark') || 'light';
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
                  apiBaseUrl="http://localhost:3500"
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
