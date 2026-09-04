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
  const baseStyles = 'inline-flex items-center justify-center font-bold rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#A3E635]/70 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-subtle active:scale-98 select-none';

  const variantStyles = {
    // Vibrant Electric Lime Primary
    primary: 'bg-[#A3E635] hover:bg-[#84CC16] active:bg-[#65A30D] text-[#0F172A] font-black border border-[#A3E635]/40 shadow-md shadow-[#A3E635]/20',
    // Deep Charcoal / Slate Secondary
    secondary: 'bg-[#1E293B] hover:bg-[#283548] active:bg-[#0F172A] text-white border border-slate-700',
    // Minimal hairline border
    outline: 'border border-slate-700/80 bg-[#18222D] text-white hover:bg-[#1E293B] hover:border-[#A3E635]/50 shadow-sm',
    danger: 'bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white border border-rose-700 shadow-md shadow-rose-900/20',
    ghost: 'bg-transparent hover:bg-slate-800/60 text-slate-300 hover:text-white shadow-none',
    success: 'bg-[#10B981] hover:bg-[#059669] active:bg-[#047857] text-white border border-emerald-600',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-xs sm:text-sm gap-2',
    lg: 'px-5 py-2.5 text-sm sm:text-base gap-2.5',
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
