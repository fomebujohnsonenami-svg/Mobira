import React from 'react';

export interface PageShellProps {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
}

export const PageShell: React.FC<PageShellProps> = ({
  title,
  subtitle,
  badge,
  action,
  children,
}) => {
  return (
    <div className="space-y-5 sm:space-y-6 pb-12 w-full">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
            <h1 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {title}
            </h1>
            {badge && <div className="shrink-0">{badge}</div>}
          </div>
          {subtitle && (
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl font-medium">
              {subtitle}
            </p>
          )}
        </div>
        {action && (
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap lg:shrink-0 w-full lg:w-auto">
            {action}
          </div>
        )}
      </div>

      <div className="w-full min-w-0">{children}</div>
    </div>
  );
};
