'use client';

import React from 'react';
import { ArrowUpRight, ArrowDownLeft, ShieldCheck, Receipt, Users, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { formatCurrency } from '@/lib/formatters';

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
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Money Received */}
      <Card hover className="p-5 border-2 border-slate-200 dark:border-navy-800 rounded-2xl shadow-subtle">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Money Received
          </span>
          <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
            <ArrowDownLeft className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
            {formatCurrency(moneyReceived, currency)}
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1 flex items-center gap-1">
            <span className="text-emerald-600 font-bold">+18.2%</span> vs last month
          </p>
        </div>
      </Card>

      {/* 2. Money Sent */}
      <Card hover className="p-5 border-2 border-slate-200 dark:border-navy-800 rounded-2xl shadow-subtle">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Money Sent
          </span>
          <div className="p-2 rounded-xl bg-slate-100 dark:bg-navy-950 text-navy-900 dark:text-slate-200 border border-slate-200 dark:border-navy-800">
            <ArrowUpRight className="w-4 h-4 text-navy-800 dark:text-yellow-400" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-2xl font-black text-navy-950 dark:text-slate-100 tabular-nums">
            {formatCurrency(moneySent, currency)}
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1">
            Payroll, suppliers & vendor disbursements
          </p>
        </div>
      </Card>

      {/* 3. Transactions */}
      <Card hover className="p-5 border-2 border-slate-200 dark:border-navy-800 rounded-2xl shadow-subtle">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Transactions
          </span>
          <div className="p-2 rounded-xl bg-yellow-50 dark:bg-yellow-950/60 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800/60">
            <Receipt className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-2xl font-black text-navy-950 dark:text-slate-100 tabular-nums">
            {transactionCount}
          </p>
          <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> 99.4% Success rate
          </p>
        </div>
      </Card>

      {/* 4. Verified Recipients */}
      <Card hover className="p-5 border-2 border-slate-200 dark:border-navy-800 rounded-2xl shadow-subtle">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Verified Recipients
          </span>
          <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60">
            <ShieldCheck className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-2xl font-black text-navy-950 dark:text-slate-100 tabular-nums">
            {verifiedRecipientsRatio}
          </p>
          <p className="text-[11px] text-blue-600 dark:text-blue-400 font-bold mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" /> 100% Pre-flight verified
          </p>
        </div>
      </Card>
    </div>
  );
};
