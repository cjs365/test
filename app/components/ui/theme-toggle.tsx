'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/app/context/ThemeProvider';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="h-4 w-4 text-gray-300 hover:text-white" />
      ) : (
        <Moon className="h-4 w-4 text-gray-600 hover:text-gray-900" />
      )}
    </button>
  );
} 