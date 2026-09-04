'use client';

import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '', showLabel = false }) => {
  const { theme, toggleTheme, isDark } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-8 h-8 rounded-xl bg-slate-800/40 border border-slate-700 animate-pulse" />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
      title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
      className={`inline-flex items-center gap-1.5 p-2 rounded-xl border transition-all duration-200 shadow-sm select-none active:scale-95 ${
        isDark
          ? 'bg-[#18222D] hover:bg-[#1E293B] border-slate-700 text-[#A3E635] hover:border-[#A3E635]/50'
          : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-900'
      } ${className}`}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-[#A3E635] transition-transform duration-300 hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 text-slate-700 transition-transform duration-300 hover:-rotate-12" />
      )}
      {showLabel && (
        <span className="text-xs font-bold capitalize">
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </span>
      )}
    </button>
  );
};
