import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className, hover = false, ...props }) => {
  return (
    <div
      className={cn(
        'bg-[#18222D] border border-slate-800 rounded-2xl shadow-subtle overflow-hidden text-slate-100',
        hover && 'transition-all duration-200 hover:shadow-elevated hover:border-slate-700',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
