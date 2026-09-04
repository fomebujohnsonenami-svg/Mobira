import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSkeleton: React.FC<{ rows?: number; className?: string }> = ({
  rows = 4,
  className = '',
}) => {
  return (
    <div className={`space-y-3 p-4 animate-pulse ${className}`}>
      <div className="h-4 bg-slate-200 dark:bg-navy-800 rounded w-1/4" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-10 bg-slate-100 dark:bg-navy-900 rounded-lg w-full" />
      ))}
    </div>
  );
};

export const TableSkeleton: React.FC<{
  rows?: number;
  cols?: number;
  className?: string;
}> = ({ rows = 5, cols = 5, className = '' }) => {
  return (
    <div className={`w-full overflow-hidden rounded-xl border border-slate-200 dark:border-navy-800 bg-white dark:bg-navy-900 animate-pulse ${className}`}>
      {/* Header Row */}
      <div className="flex items-center gap-4 bg-slate-50 dark:bg-navy-950 p-4 border-b border-slate-200 dark:border-navy-800">
        {Array.from({ length: cols }).map((_, i) => (
          <div
            key={i}
            className={`h-3.5 bg-slate-200 dark:bg-navy-800 rounded ${
              i === 0 ? 'w-28' : i === cols - 1 ? 'w-16 ml-auto' : 'flex-1'
            }`}
          />
        ))}
      </div>
      {/* Body Rows */}
      <div className="divide-y divide-slate-100 dark:divide-navy-850">
        {Array.from({ length: rows }).map((_, rowIdx) => (
          <div key={rowIdx} className="flex items-center gap-4 p-4">
            {Array.from({ length: cols }).map((_, colIdx) => (
              <div
                key={colIdx}
                className={`h-4 bg-slate-100 dark:bg-navy-850 rounded ${
                  colIdx === 0
                    ? 'w-24'
                    : colIdx === 1
                    ? 'w-36'
                    : colIdx === cols - 1
                    ? 'w-20 ml-auto'
                    : 'flex-1'
                }`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export const CardSkeleton: React.FC<{
  count?: number;
  className?: string;
}> = ({ count = 3, className = '' }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-pulse ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="p-6 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 space-y-4 shadow-subtle"
        >
          <div className="flex items-center justify-between">
            <div className="h-5 w-20 bg-slate-200 dark:bg-navy-800 rounded-full" />
            <div className="h-4 w-16 bg-slate-100 dark:bg-navy-850 rounded" />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-navy-800 shrink-0" />
            <div className="space-y-1.5 flex-1">
              <div className="h-4 w-3/4 bg-slate-200 dark:bg-navy-800 rounded" />
              <div className="h-3 w-1/2 bg-slate-100 dark:bg-navy-850 rounded" />
            </div>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-950 space-y-2">
            <div className="h-3 w-20 bg-slate-200 dark:bg-navy-800 rounded" />
            <div className="h-6 w-32 bg-slate-200 dark:bg-navy-800 rounded" />
          </div>
          <div className="h-9 w-full bg-slate-100 dark:bg-navy-850 rounded-xl" />
        </div>
      ))}
    </div>
  );
};

export const MetricCardSkeleton: React.FC<{
  count?: number;
}> = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="p-4 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 space-y-2"
        >
          <div className="h-3 w-24 bg-slate-200 dark:bg-navy-800 rounded" />
          <div className="h-7 w-32 bg-slate-200 dark:bg-navy-800 rounded" />
          <div className="h-3 w-20 bg-slate-100 dark:bg-navy-850 rounded" />
        </div>
      ))}
    </div>
  );
};

export const PageLoadingSkeleton: React.FC<{ label?: string }> = ({
  label = 'Loading...',
}) => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Page Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200 dark:border-navy-800">
        <div className="space-y-2">
          <div className="h-7 w-48 bg-slate-200 dark:bg-navy-800 rounded-lg" />
          <div className="h-4 w-72 bg-slate-100 dark:bg-navy-850 rounded" />
        </div>
        <div className="h-9 w-32 bg-slate-200 dark:bg-navy-800 rounded-xl" />
      </div>

      {/* Metrics Row */}
      <MetricCardSkeleton count={4} />

      {/* Content Area Table / Cards */}
      <TableSkeleton rows={5} cols={5} />

      <div className="flex items-center justify-center gap-2 pt-2 text-xs font-semibold text-slate-400">
        <Loader2 className="w-4 h-4 animate-spin text-yellow-500" />
        <span>{label}</span>
      </div>
    </div>
  );
};

export const LoadingSpinner: React.FC<{ label?: string; size?: 'sm' | 'md' | 'lg' }> = ({
  label = 'Loading...',
  size = 'md',
}) => {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 gap-3 text-slate-500 dark:text-slate-400">
      <Loader2 className={`${sizeMap[size]} animate-spin text-yellow-500`} />
      {label && <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">{label}</span>}
    </div>
  );
};
