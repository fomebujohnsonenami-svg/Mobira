'use client';

import React from 'react';
import { ArrowUpRight, ArrowDownLeft, Receipt, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Transaction } from '@/types';
import { formatDate, formatChannelName } from '@/lib/formatters';
import { usePrivacy } from '@/components/privacy/PrivacyContext';

export interface TransactionTableProps {
  transactions: Transaction[];
  onSelectTransaction?: (transaction: Transaction) => void;
  onSort?: (field: string) => void;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
}

export const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  onSelectTransaction,
  onSort,
  sortField,
  sortOrder,
}) => {
  const { formatAmount } = usePrivacy();
  if (transactions.length === 0) {
    return (
      <Card className="p-8">
        <EmptyState
          icon={Receipt}
          title="No transactions found"
          description="Try adjusting your search terms, date range, or filter criteria."
          className="border-none bg-transparent p-0"
        />
      </Card>
    );
  }

  const renderStatusBadge = (status: string) => {
    const s = status.toUpperCase();
    if (s === 'SUCCESS' || s === 'SUCCESSFUL' || s === 'COMPLETED') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-xs font-black border border-emerald-300 dark:border-emerald-800">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          🟢 Successful
        </span>
      );
    }
    if (s === 'PENDING' || s === 'PENDING_APPROVAL' || s === 'PROCESSING') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-yellow-50 dark:bg-yellow-950/60 text-yellow-700 dark:text-yellow-400 text-xs font-black border border-yellow-300 dark:border-yellow-700/60">
          <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
          🟡 Pending
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 text-xs font-black border border-rose-300 dark:border-rose-800">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
        🔴 Failed
      </span>
    );
  };

  const renderProviderName = (channel: string) => {
    const c = channel.toUpperCase();
    if (c.includes('MTN')) return 'MTN MoMo';
    if (c.includes('ORANGE')) return 'Orange Money';
    if (c.includes('BANK')) return 'Bank Transfer';
    return channel;
  };

  return (
    <Card className="p-0 overflow-hidden shadow-subtle border border-slate-200 dark:border-navy-800">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
          <thead className="bg-slate-50 dark:bg-navy-950 text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-navy-800">
            <tr>
              <th
                onClick={() => onSort?.('date')}
                className="py-3.5 px-4 cursor-pointer hover:text-navy-950 dark:hover:text-white"
              >
                Date {sortField === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th className="py-3.5 px-4">Transaction ID</th>
              <th className="py-3.5 px-4">Type</th>
              <th className="py-3.5 px-4">Recipient/Sender</th>
              <th
                onClick={() => onSort?.('amount')}
                className="py-3.5 px-4 text-right cursor-pointer hover:text-navy-950 dark:hover:text-white"
              >
                Amount {sortField === 'amount' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th className="py-3.5 px-4">Provider</th>
              <th className="py-3.5 px-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-navy-850">
            {transactions.map((tx) => {
              const isDisb = tx.direction === 'DISBURSEMENT';

              return (
                <tr
                  key={tx.id}
                  onClick={() => onSelectTransaction?.(tx)}
                  className="hover:bg-slate-50 dark:hover:bg-navy-850/60 transition-colors cursor-pointer"
                >
                  {/* Date */}
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400 font-medium whitespace-nowrap">
                    {formatDate(tx.created_at)}
                  </td>

                  {/* Transaction ID */}
                  <td className="py-3 px-4 font-mono font-bold text-navy-950 dark:text-slate-100 text-xs">
                    {tx.reference}
                  </td>

                  {/* Type */}
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        isDisb
                          ? 'bg-slate-100 dark:bg-navy-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-navy-700'
                          : 'bg-yellow-100 dark:bg-yellow-950/60 text-yellow-800 dark:text-yellow-400 border border-yellow-300 dark:border-yellow-700/60'
                      }`}
                    >
                      {isDisb ? <ArrowUpRight className="w-3 h-3 text-slate-500" /> : <ArrowDownLeft className="w-3 h-3 text-yellow-500" />}
                      {isDisb ? 'PAYOUT' : 'RECEIVE'}
                    </span>
                  </td>

                  {/* Recipient/Sender */}
                  <td className="py-3 px-4">
                    <span className="font-bold text-navy-950 dark:text-slate-100 block">
                      {tx.counterparty_name}
                    </span>
                    <span className="font-mono text-[10px] text-slate-400 block">
                      {tx.counterparty_identifier}
                    </span>
                  </td>

                  {/* Amount */}
                  <td className="py-3 px-4 text-right font-black text-navy-950 dark:text-slate-100 tabular-nums whitespace-nowrap">
                    <span className={isDisb ? 'text-navy-950 dark:text-slate-100' : 'text-emerald-600 dark:text-emerald-400'}>
                      {isDisb ? '-' : '+'}{formatAmount(tx.amount, tx.currency || 'GH₵')}
                    </span>
                  </td>

                  {/* Provider */}
                  <td className="py-3 px-4 font-semibold text-xs text-navy-950 dark:text-slate-200">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                      <span>{renderProviderName(tx.channel)}</span>
                    </div>
                  </td>

                  {/* Status (🟢 Successful, 🟡 Pending, 🔴 Failed) */}
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    {renderStatusBadge(tx.status)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
