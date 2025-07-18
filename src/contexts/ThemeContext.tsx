import React, { createContext } from 'react';

export interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme?: () => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: 'light'
});

export const ThemeProvider: React.FC<{ 
  children: React.ReactNode;
  theme: 'light' | 'dark';
  toggleTheme?: () => void;
}> = ({ children, theme, toggleTheme }) => {
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
