import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
  isRetrying?: boolean;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong.',
  message = 'Please try again.',
  onRetry,
  className = '',
  isRetrying = false,
}) => {
  return (
    <div
      className={`p-8 sm:p-12 text-center rounded-2xl border border-rose-200 dark:border-rose-950/60 bg-rose-50/40 dark:bg-rose-950/20 ${className}`}
    >
      <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto mb-4 border border-rose-200 dark:border-rose-800 shadow-sm">
        <AlertTriangle className="w-7 h-7 stroke-[2.2]" />
      </div>
      <h3 className="font-extrabold text-lg text-rose-950 dark:text-rose-200">{title}</h3>
      <p className="text-xs text-rose-800/80 dark:text-rose-300 max-w-md mx-auto mt-1.5 leading-relaxed font-medium">
        {message}
      </p>
      {onRetry && (
        <div className="mt-5">
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            disabled={isRetrying}
            className="gap-2 font-bold text-xs border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200 hover:bg-rose-100/50 dark:hover:bg-rose-900/40"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRetrying ? 'animate-spin' : ''}`} />
            {isRetrying ? 'Retrying...' : 'Try Again'}
          </Button>
        </div>
      )}
    </div>
  );
};
