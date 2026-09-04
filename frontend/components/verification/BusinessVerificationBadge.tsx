'use client';

import React, { useState } from 'react';
import { Check, ShieldAlert, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBusiness } from '@/components/layout/BusinessContext';

export type VerificationState = 'UNVERIFIED' | 'IN_PROGRESS' | 'VERIFIED';

interface BusinessVerificationBadgeProps {
  status?: VerificationState;
  businessName?: string;
  showName?: boolean;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  layout?: 'inline' | 'stacked';
  className?: string;
}

export const BusinessVerificationBadge: React.FC<BusinessVerificationBadgeProps> = ({
  status: propStatus,
  businessName: propName,
  showName = true,
  showLabel = true,
  size = 'md',
  layout = 'inline',
  className,
}) => {
  const { currentBusiness, verificationStatus } = useBusiness();
  const status = propStatus || verificationStatus || 'VERIFIED';
  const name = propName || currentBusiness.name || 'ABC Technologies Ltd';

  const [showTooltip, setShowTooltip] = useState(false);

  // Sizing definitions
  const sizeClasses = {
    sm: {
      text: 'text-xs',
      badge: 'px-2 py-0.5 text-[10px]',
      icon: 'w-3 h-3 stroke-[3]',
    },
    md: {
      text: 'text-sm',
      badge: 'px-2.5 py-0.5 text-[11px]',
      icon: 'w-3.5 h-3.5 stroke-[3]',
    },
    lg: {
      text: 'text-base sm:text-lg',
      badge: 'px-3 py-1 text-xs',
      icon: 'w-4 h-4 stroke-[3]',
    },
  }[size];

  return (
    <div
      className={cn(
        'relative inline-flex items-center gap-2 group cursor-default select-none',
        layout === 'stacked' && 'flex-col items-start gap-1',
        className
      )}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* 1. Optional Business Name */}
      {showName && (
        <span className={cn('font-black text-navy-950 dark:text-white tracking-tight', sizeClasses.text)}>
          {name}
        </span>
      )}

      {/* 2. State-Specific Badge */}
      {status === 'VERIFIED' && (
        <span
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 font-extrabold shadow-subtle',
            sizeClasses.badge
          )}
          title="This business has been verified by Mobira."
        >
          <span className="inline-flex items-center justify-center rounded-full bg-blue-600 text-white p-0.5">
            <Check className={cn('text-white', sizeClasses.icon)} />
          </span>
          {showLabel && <span>Verified Business</span>}
        </span>
      )}

      {status === 'IN_PROGRESS' && (
        <span
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full bg-yellow-50 dark:bg-yellow-950/70 text-yellow-700 dark:text-yellow-400 border border-yellow-300 dark:border-yellow-700/60 font-bold',
            sizeClasses.badge
          )}
        >
          <Loader2 className={cn('animate-spin text-yellow-600 dark:text-yellow-400', sizeClasses.icon)} />
          {showLabel && <span>Verification in Progress</span>}
        </span>
      )}

      {status === 'UNVERIFIED' && (
        <span
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700/70 font-bold',
            sizeClasses.badge
          )}
        >
          <ShieldAlert className={cn('text-amber-600 dark:text-amber-400', sizeClasses.icon)} />
          {showLabel && <span>Verification Required</span>}
        </span>
      )}

      {/* Accessible Floating Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 bg-navy-950 text-white text-[11px] font-semibold rounded-lg shadow-modal border border-navy-800 z-50 whitespace-nowrap pointer-events-none animate-in fade-in-50 zoom-in-95">
          {status === 'VERIFIED' && 'This business has been verified by Mobira.'}
          {status === 'IN_PROGRESS' && 'Identity & commercial registry checks in progress.'}
          {status === 'UNVERIFIED' && 'Business verification is pending completion.'}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-navy-950" />
        </div>
      )}
    </div>
  );
};
