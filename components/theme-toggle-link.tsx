'use client';

import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';

export function ThemeToggleLink() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className="tap-target flex items-center justify-center rounded-lg border border-border bg-card text-foreground transition-colors hover:bg-secondary"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
    </button>
  );
}
