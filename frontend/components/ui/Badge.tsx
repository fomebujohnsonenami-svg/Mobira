import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'gold' | 'blue' | 'emerald' | 'amber' | 'rose' | 'slate';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = 'slate',
  size = 'sm',
  ...props
}) => {
  const variantStyles = {
    gold: 'bg-yellow-100 text-yellow-900 dark:bg-yellow-950/70 dark:text-yellow-300 border border-yellow-300 dark:border-yellow-700/60',
    amber: 'bg-yellow-100 text-yellow-900 dark:bg-yellow-950/70 dark:text-yellow-300 border border-yellow-300 dark:border-yellow-700/60',
    blue: 'bg-navy-100 text-navy-900 dark:bg-navy-800 dark:text-navy-100 border border-navy-200 dark:border-navy-700',
    emerald: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800/80',
    rose: 'bg-rose-50 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-300 dark:border-rose-800/80',
    slate: 'bg-slate-100 text-slate-700 dark:bg-navy-950 dark:text-slate-300 border border-slate-200 dark:border-navy-800',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[11px] font-bold rounded-md tracking-tight',
    md: 'px-2.5 py-1 text-xs font-bold rounded-md tracking-tight',
  };

  return (
    <span
      className={cn('inline-flex items-center gap-1.5 font-medium transition-colors', variantStyles[variant], sizeStyles[size], className)}
      {...props}
    >
      {children}
    </span>
  );
};
