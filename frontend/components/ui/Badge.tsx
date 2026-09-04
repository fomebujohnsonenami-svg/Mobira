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
    gold: 'bg-[#A3E635]/15 text-[#A3E635] border border-[#A3E635]/40',
    amber: 'bg-amber-500/15 text-amber-300 border border-amber-500/30',
    blue: 'bg-[#2563EB]/15 text-[#38BDF8] border border-[#2563EB]/40',
    emerald: 'bg-[#A3E635]/15 text-[#A3E635] border border-[#A3E635]/40',
    rose: 'bg-rose-500/15 text-rose-300 border border-rose-500/30',
    slate: 'bg-slate-800 text-slate-300 border border-slate-700',
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
