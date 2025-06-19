'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

type ThemeContextType = {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
};

// Create context with default values to avoid undefined errors during SSR
const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  isDark: false,
  toggleTheme: () => null
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  // Initialize theme from localStorage or system preference on component mount
  useEffect(() => {
    // This code only runs on client-side
    setMounted(true);
    
    try {
      // Check for stored theme preference
      const storedTheme = localStorage.getItem('theme') as Theme | null;
      
      if (storedTheme && (storedTheme === 'dark' || storedTheme === 'light')) {
        setTheme(storedTheme);
        document.documentElement.classList.toggle('dark', storedTheme === 'dark');
      } else {
        // Check for system preference
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(systemPrefersDark ? 'dark' : 'light');
        document.documentElement.classList.toggle('dark', systemPrefersDark);
        localStorage.setItem('theme', systemPrefersDark ? 'dark' : 'light');
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
    }
  }, []);

  // Listen for system preference changes
  useEffect(() => {
    if (!mounted) return;
    
    try {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = (e: MediaQueryListEvent) => {
        if (!localStorage.getItem('theme')) {
          // Only auto-switch if user hasn't manually set a preference
          const newTheme = e.matches ? 'dark' : 'light';
          setTheme(newTheme);
          document.documentElement.classList.toggle('dark', e.matches);
        }
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } catch (error) {
      console.error('Error setting up media query listener:', error);
    }
  }, [mounted]);

  const toggleTheme = () => {
    try {
      const newTheme = theme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
      document.documentElement.classList.toggle('dark', newTheme === 'dark');
      localStorage.setItem('theme', newTheme);
    } catch (error) {
      console.error('Error toggling theme:', error);
    }
  };

  const contextValue = {
    theme,
    isDark: theme === 'dark',
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
} 