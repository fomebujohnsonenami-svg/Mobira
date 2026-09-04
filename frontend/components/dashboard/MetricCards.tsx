'use client';

import React from 'react';
import { ArrowUpRight, ArrowDownLeft, ShieldCheck, Receipt, Users, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { usePrivacy } from '@/components/privacy/PrivacyContext';

export interface MetricCardsProps {
  moneyReceived?: number;
  moneySent?: number;
  transactionCount?: number;
  verifiedRecipientsRatio?: string;
  currency?: string;
}

export const MetricCards: React.FC<MetricCardsProps> = ({
  moneyReceived = 185400,
  moneySent = 142700,
  transactionCount = 227,
  verifiedRecipientsRatio = '48/48',
  currency = 'GH₵',
}) => {
  const { isBlinded, togglePrivacy, formatAmount } = usePrivacy();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Money Received */}
      <div className="relative group p-5 rounded-2xl bg-[#08162B]/80 dark:bg-navy-900/80 backdrop-blur-xl border border-emerald-500/20 hover:border-emerald-500/40 shadow-lg shadow-black/20 hover:shadow-emerald-950/20 transition-all duration-300 hover:-translate-y-0.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
            Total Inflow
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={togglePrivacy}
              className="p-1 rounded-lg text-slate-500 hover:text-emerald-400 hover:bg-navy-800 transition-colors"
              title={isBlinded ? 'Reveal amount' : 'Blind amount'}
            >
              {isBlinded ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <ArrowDownLeft className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
        </div>
        <div className="mt-3">
          <p className="text-2xl font-black text-emerald-400 tracking-tight font-mono">
            {formatAmount(moneyReceived, currency)}
          </p>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-navy-800/60 text-[11px]">
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              +18.2% this month
            </span>
            <span className="text-slate-400">Collections</span>
          </div>
        </div>
      </div>

      {/* 2. Money Sent */}
      <div className="relative group p-5 rounded-2xl bg-[#08162B]/80 dark:bg-navy-900/80 backdrop-blur-xl border border-slate-800 hover:border-slate-700 shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-0.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
            Total Outflow
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={togglePrivacy}
              className="p-1 rounded-lg text-slate-500 hover:text-emerald-400 hover:bg-navy-800 transition-colors"
              title={isBlinded ? 'Reveal amount' : 'Blind amount'}
            >
              {isBlinded ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
            <div className="p-2 rounded-xl bg-navy-850 text-slate-300 border border-navy-750">
              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
        </div>
        <div className="mt-3">
          <p className="text-2xl font-black text-white tracking-tight font-mono">
            {formatAmount(moneySent, currency)}
          </p>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-navy-800/60 text-[11px]">
            <span className="text-slate-300 font-medium">Payroll & Suppliers</span>
            <span className="text-slate-400 font-mono">Disbursed</span>
          </div>
        </div>
      </div>

      {/* 3. Unified Ledger Transactions */}
      <div className="relative group p-5 rounded-2xl bg-[#08162B]/80 dark:bg-navy-900/80 backdrop-blur-xl border border-slate-800 hover:border-slate-700 shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-0.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
            Ledger Volume
          </span>
          <div className="p-2 rounded-xl bg-navy-850 text-emerald-400 border border-emerald-500/20">
            <Receipt className="w-4 h-4 stroke-[2.5]" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-2xl font-black text-white tracking-tight font-mono">
            {transactionCount}
          </p>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-navy-800/60 text-[11px]">
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 99.4% Clearance
            </span>
            <span className="text-slate-400 font-mono">Multi-Rail</span>
          </div>
        </div>
      </div>

      {/* 4. Pre-Flight Verified Beneficiaries */}
      <div className="relative group p-5 rounded-2xl bg-[#08162B]/80 dark:bg-navy-900/80 backdrop-blur-xl border border-emerald-500/20 hover:border-emerald-500/40 shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-0.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
            Pre-Flight Beneficiaries
          </span>
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-2xl font-black text-emerald-400 tracking-tight font-mono">
            {verifiedRecipientsRatio}
          </p>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-navy-800/60 text-[11px]">
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> 100% Identity Match
            </span>
            <span className="text-slate-400 font-mono">Zero Fraud</span>
          </div>
        </div>
      </div>
    </div>
  );
};
