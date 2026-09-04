import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, type = 'text', ...props }, ref) => {
    return (
      <div className="w-full space-y-1">
        {label && (
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            {label}
          </label>
        )}
        <input
          type={type}
          ref={ref}
          className={cn(
            'w-full px-3.5 py-2.5 bg-white dark:bg-navy-950 border rounded-lg text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/70 focus:border-yellow-500 transition-colors shadow-subtle',
            error ? 'border-rose-600 focus:ring-rose-500 focus:border-rose-600' : 'border-slate-300 dark:border-navy-800',
            className
          )}
          {...props}
        />
        {helperText && !error && (
          <p className="text-[11px] text-slate-500 dark:text-slate-400">{helperText}</p>
        )}
        {error && (
          <p className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold">{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';
