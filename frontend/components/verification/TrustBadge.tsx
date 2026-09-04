import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { getTierColor } from '@/lib/formatters';

export interface TrustBadgeProps {
  tier: string;
  score?: number;
  size?: 'sm' | 'md' | 'lg';
}

export const TrustBadge: React.FC<TrustBadgeProps> = ({ tier, score, size = 'sm' }) => {
  const meta = getTierColor(tier);

  return (
    <div className="inline-flex items-center gap-2">
      <Badge
        variant={tier === 'GOLD_VERIFIED' ? 'gold' : tier === 'VERIFIED_TIER_1' ? 'emerald' : 'slate'}
        size={size === 'lg' ? 'md' : 'sm'}
      >
        <ShieldCheck className="w-3.5 h-3.5" />
        <span>{meta.label}</span>
      </Badge>
      {score !== undefined && (
        <span className="text-xs font-bold text-navy-950 dark:text-slate-200 tabular-nums">
          ({score}/100)
        </span>
      )}
    </div>
  );
};
