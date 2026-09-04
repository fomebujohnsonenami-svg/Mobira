import React from 'react';
import { LucideIcon, Inbox } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  className?: string;
  variant?: 'dashed' | 'plain' | 'card';
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  className = '',
  variant = 'dashed',
}) => {
  const variantStyles = {
    dashed: 'border border-dashed border-slate-300 dark:border-navy-800 bg-slate-50/50 dark:bg-navy-950/30',
    plain: 'border-none bg-transparent',
    card: 'border border-slate-200 dark:border-navy-800 bg-white dark:bg-navy-900 shadow-subtle',
  };

  return (
    <div className={`p-8 sm:p-12 text-center rounded-2xl ${variantStyles[variant]} ${className}`}>
      <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-navy-900 text-slate-400 dark:text-slate-500 flex items-center justify-center mx-auto mb-3.5 border border-slate-200 dark:border-navy-800 shadow-sm">
        <Icon className="w-7 h-7 stroke-[1.8]" />
      </div>
      <h4 className="font-extrabold text-base text-navy-950 dark:text-slate-100">{title}</h4>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1.5 leading-relaxed font-medium">
        {description}
      </p>
      {(actionLabel || secondaryActionLabel) && (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
          {actionLabel && onAction && (
            <Button variant="primary" size="sm" onClick={onAction} className="font-bold text-xs">
              {actionLabel}
            </Button>
          )}
          {secondaryActionLabel && onSecondaryAction && (
            <Button variant="outline" size="sm" onClick={onSecondaryAction} className="text-xs">
              {secondaryActionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
