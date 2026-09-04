import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const TrustBanner: React.FC = () => {
  return (
    <div className="bg-navy-950 border-b border-navy-850 text-slate-300 text-xs px-4 py-2 flex flex-wrap items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-yellow-400" />
        <span className="font-extrabold text-white tracking-wide uppercase text-[11px]">
          MOBIRA COMPETITION PROTOTYPE
        </span>
        <span className="text-navy-500 hidden sm:inline">|</span>
        <span className="text-slate-400 hidden sm:inline text-[11px]">
          Built on existing rails. <strong>NOT a bank. NOT a wallet.</strong> Multi-rail interactions simulated for competition demonstration.
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className="px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 font-bold text-[10px] tracking-wide uppercase flex items-center gap-1">
          <ShieldCheck className="w-3 h-3" /> PRE-FLIGHT IDENTITY ACTIVE
        </span>
        <span className="text-yellow-400 font-bold hidden md:inline text-[11px] tracking-wider uppercase">
          PAY • RECEIVE • VERIFY • GROW
        </span>
      </div>
    </div>
  );
};
