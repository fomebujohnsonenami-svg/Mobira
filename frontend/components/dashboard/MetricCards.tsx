'use client';

import React from 'react';
import { ArrowUpRight, ArrowDownLeft, ShieldCheck, Receipt, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* 1. Total Inflow */}
      <div className="relative group p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#18222D] border border-slate-200 dark:border-slate-800 hover:border-[#A3E635]/60 dark:hover:border-[#A3E635]/40 shadow-sm dark:shadow-lg dark:shadow-black/20 transition-all duration-300">
        <div className="flex items-center justify-between">
          <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Total Inflow
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={togglePrivacy}
              className="p-1 rounded-lg text-slate-400 hover:text-emerald-600 dark:hover:text-[#A3E635] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={isBlinded ? 'Reveal amount' : 'Blind amount'}
            >
              {isBlinded ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
            <div className="p-1.5 sm:p-2 rounded-xl bg-emerald-500/10 dark:bg-[#A3E635]/15 text-emerald-600 dark:text-[#A3E635] border border-emerald-500/20 dark:border-[#A3E635]/30">
              <ArrowDownLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
            </div>
          </div>
        </div>
        <div className="mt-2 sm:mt-3">
          <p className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-[#A3E635] tracking-tight font-mono">
            {formatAmount(moneyReceived, currency)}
          </p>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[10px] sm:text-[11px]">
            <span className="text-emerald-600 dark:text-[#A3E635] font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-[#A3E635] animate-pulse" />
              +18.2% this month
            </span>
            <span className="text-slate-500 dark:text-slate-400">Collections</span>
          </div>
        </div>
      </div>

      {/* 2. Total Outflow */}
      <div className="relative group p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#18222D] border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm dark:shadow-lg dark:shadow-black/20 transition-all duration-300">
        <div className="flex items-center justify-between">
          <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Total Outflow
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={togglePrivacy}
              className="p-1 rounded-lg text-slate-400 hover:text-emerald-600 dark:hover:text-[#A3E635] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={isBlinded ? 'Reveal amount' : 'Blind amount'}
            >
              {isBlinded ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
            <div className="p-1.5 sm:p-2 rounded-xl bg-slate-100 dark:bg-[#1E293B] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
            </div>
          </div>
        </div>
        <div className="mt-2 sm:mt-3">
          <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight font-mono">
            {formatAmount(moneySent, currency)}
          </p>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[10px] sm:text-[11px]">
            <span className="text-slate-600 dark:text-slate-300 font-medium">Payroll & Suppliers</span>
            <span className="text-slate-500 dark:text-slate-400 font-mono">Disbursed</span>
          </div>
        </div>
      </div>

      {/* 3. Unified Ledger Volume */}
      <div className="relative group p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#18222D] border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm dark:shadow-lg dark:shadow-black/20 transition-all duration-300">
        <div className="flex items-center justify-between">
          <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Ledger Volume
          </span>
          <div className="p-1.5 sm:p-2 rounded-xl bg-slate-100 dark:bg-[#1E293B] text-emerald-600 dark:text-[#A3E635] border border-slate-200 dark:border-slate-700">
            <Receipt className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
          </div>
        </div>
        <div className="mt-2 sm:mt-3">
          <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight font-mono">
            {transactionCount}{' '}
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 font-sans">Txns</span>
          </p>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[10px] sm:text-[11px]">
            <span className="text-slate-600 dark:text-slate-300">100% Dual-Auth</span>
            <span className="text-emerald-600 dark:text-[#A3E635] font-bold">Real-Time</span>
          </div>
        </div>
      </div>

      {/* 4. Pre-Flight Identity Verified */}
      <div className="relative group p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#18222D] border border-slate-200 dark:border-slate-800 hover:border-[#A3E635]/60 dark:hover:border-[#A3E635]/40 shadow-sm dark:shadow-lg dark:shadow-black/20 transition-all duration-300">
        <div className="flex items-center justify-between">
          <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Pre-Flight Verified
          </span>
          <div className="p-1.5 sm:p-2 rounded-xl bg-emerald-500/10 dark:bg-[#A3E635]/15 text-emerald-600 dark:text-[#A3E635] border border-emerald-500/20 dark:border-[#A3E635]/30">
            <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
          </div>
        </div>
        <div className="mt-2 sm:mt-3">
          <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight font-mono">
            {verifiedRecipientsRatio}{' '}
            <span className="text-xs font-bold text-emerald-600 dark:text-[#A3E635] font-sans">Match</span>
          </p>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[10px] sm:text-[11px]">
            <span className="text-emerald-600 dark:text-[#A3E635] font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-500 dark:text-[#A3E635]" /> Carrier Confirmed
            </span>
            <span className="text-slate-500 dark:text-slate-400">Zero Losses</span>
          </div>
        </div>
      </div>
    </div>
  );
};
