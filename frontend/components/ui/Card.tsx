import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className, hover = false, ...props }) => {
  return (
    <div
      className={cn(
        'bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 rounded-xl shadow-subtle overflow-hidden',
        hover && 'transition-shadow duration-150 hover:shadow-elevated hover:border-slate-300 dark:hover:border-navy-700',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
