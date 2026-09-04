import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className, hover = false, ...props }) => {
  return (
    <div
      className={cn(
        'bg-white dark:bg-[#18222D] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden text-slate-900 dark:text-slate-100 transition-colors duration-200',
        hover && 'transition-all duration-200 hover:shadow-elevated hover:border-slate-300 dark:hover:border-slate-700',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
