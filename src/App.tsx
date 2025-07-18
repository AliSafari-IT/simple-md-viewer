import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import MarkdownContent from './components/MarkdownContent';
import './App.css';
import './styles.css';
import { useState } from 'react';

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeProvider theme={theme} toggleTheme={toggleTheme}>
      <Router>
        <Routes>
          <Route path="/*" element={<MarkdownContent />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
