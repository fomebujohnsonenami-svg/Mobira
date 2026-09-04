import React from 'react';
import { Award, CheckCircle2, ShieldCheck, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export interface TrustScoreCardProps {
  score?: number;
  tier?: string;
  cleanDays?: number;
}

export const TrustScoreCard: React.FC<TrustScoreCardProps> = ({
  score = 94,
  tier = 'Gold Verified Business',
  cleanDays = 184,
}) => {
  return (
    <Card className="p-6 bg-navy-900 border border-navy-800 text-white shadow-elevated">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-navy-800">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-yellow-400 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-yellow-400" />
            BUSINESS IDENTITY & REPUTATION (GROW)
          </span>
          <h2 className="text-lg font-black text-white mt-1">Mobira Algorithmic Trust Rating</h2>
        </div>
        <Badge variant="gold" size="md" className="gap-1.5 font-bold uppercase text-[11px]">
          <ShieldCheck className="w-4 h-4 text-yellow-500" />
          {tier}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-5">
        {/* Score gauge in African Gold */}
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-20 h-20 rounded-xl bg-navy-950 border-2 border-yellow-500/70 shrink-0">
            <div className="text-center">
              <span className="text-2xl font-black text-yellow-400 tabular-nums">{score}</span>
              <span className="block text-[9px] font-bold text-slate-400 uppercase">/ 100</span>
            </div>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-200 uppercase tracking-wide">High Credibility Index</p>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              Enables automated supplier credit and 15,000,000 XAF single payout ceiling.
            </p>
          </div>
        </div>

        {/* Verification Checkpoints */}
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-navy-950/70 border border-navy-800">
            <span className="text-slate-300 flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-yellow-400" /> National Tax Compliance (TIN)
            </span>
            <span className="text-yellow-400 font-bold text-[11px]">Active & Verified</span>
          </div>
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-navy-950/70 border border-navy-800">
            <span className="text-slate-300 flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-yellow-400" /> Commercial Registry (RCCM)
            </span>
            <span className="text-yellow-400 font-bold text-[11px]">Confirmed</span>
          </div>
        </div>

        {/* Operational Factors */}
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-navy-950/70 border border-navy-800">
            <span className="text-slate-300 flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5 text-yellow-400" /> Clean Payout Record
            </span>
            <span className="text-slate-200 font-bold tabular-nums text-[11px]">{cleanDays} Days</span>
          </div>
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-navy-950/70 border border-navy-800">
            <span className="text-slate-300 flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-yellow-400" /> Pre-Flight Accuracy
            </span>
            <span className="text-slate-200 font-bold tabular-nums text-[11px]">99.2% Exact</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
