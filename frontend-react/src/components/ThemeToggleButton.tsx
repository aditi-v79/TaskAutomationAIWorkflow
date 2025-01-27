import React from 'react';
import { useTheme } from '../config/theme/ThemeContext.tsx';

export const ThemeToggle: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="btn-secondary"
      aria-label="Toggle theme"
    >
      {isDarkMode ? ' Light Mode' : ' Dark Mode'}
    </button>
  );
};
