import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'success';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-bold rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-yellow-500/70 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-subtle';

  const variantStyles = {
    // Mobira Gold / African Fintech Yellow
    primary: 'bg-yellow-500 hover:bg-yellow-400 active:bg-yellow-600 text-navy-950 border border-yellow-600/20',
    // Institutional African Deep Blue
    secondary: 'bg-navy-900 hover:bg-navy-850 active:bg-navy-950 text-white dark:bg-navy-800 dark:hover:bg-navy-700 dark:active:bg-navy-900 border border-navy-800 dark:border-navy-700',
    // Minimal hairline border
    outline: 'border border-slate-300 dark:border-navy-800 bg-white dark:bg-navy-900 text-navy-950 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-navy-850',
    danger: 'bg-rose-700 hover:bg-rose-800 active:bg-rose-900 text-white border border-rose-800',
    ghost: 'bg-transparent hover:bg-slate-100 dark:hover:bg-navy-850 text-slate-700 dark:text-slate-200 shadow-none',
    success: 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white border border-emerald-700',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2.5',
  };

  return (
    <button
      className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </button>
  );
};
