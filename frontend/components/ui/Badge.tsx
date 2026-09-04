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
    gold: 'bg-lime-500/15 text-lime-800 dark:text-[#A3E635] border border-lime-500/30 dark:border-[#A3E635]/40',
    amber: 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30',
    blue: 'bg-blue-500/15 text-blue-800 dark:text-[#38BDF8] border border-blue-500/30 dark:border-[#2563EB]/40',
    emerald: 'bg-emerald-500/15 text-emerald-800 dark:text-[#A3E635] border border-emerald-500/30 dark:border-[#A3E635]/40',
    rose: 'bg-rose-500/15 text-rose-800 dark:text-rose-300 border border-rose-500/30',
    slate: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[10px] sm:text-[11px] font-bold rounded-md tracking-tight',
    md: 'px-2.5 py-1 text-xs font-bold rounded-lg tracking-tight',
  };

  return (
    <span
      className={cn('inline-flex items-center gap-1.5 font-bold transition-colors select-none', variantStyles[variant], sizeStyles[size], className)}
      {...props}
    >
      {children}
    </span>
  );
};
