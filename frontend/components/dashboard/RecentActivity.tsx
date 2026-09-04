import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, ArrowDownLeft, ExternalLink, Receipt } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { Transaction } from '@/types';
import { formatDate, formatChannelName } from '@/lib/formatters';
import { usePrivacy } from '@/components/privacy/PrivacyContext';

export interface RecentActivityProps {
  transactions: Transaction[];
  onSelectTransaction?: (tx: Transaction) => void;
}

export const RecentActivity: React.FC<RecentActivityProps> = ({
  transactions,
  onSelectTransaction,
}) => {
  const { formatAmount } = usePrivacy();
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-navy-800">
        <div>
          <h3 className="font-extrabold text-sm sm:text-base text-navy-950 dark:text-slate-100">
            Recent Ledger Activity
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time disbursement settlements and received payments
          </p>
        </div>
        <Link
          href="/transactions"
          className="text-xs font-bold text-navy-800 dark:text-yellow-400 hover:underline flex items-center gap-1"
        >
          Full Ledger <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-navy-850 mt-1">
        {transactions.length === 0 ? (
          <EmptyState
            icon={Receipt}
            title="No transactions yet"
            description="Initiate a payment or create a payment link to see activity here."
            className="my-4 border-none bg-transparent"
          />
        ) : (
          transactions.slice(0, 5).map((tx) => {
            const isDisb = tx.direction === 'DISBURSEMENT';

            return (
              <div
                key={tx.id}
                onClick={() => onSelectTransaction?.(tx)}
                className="py-3 px-2 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-navy-850/60 rounded-lg transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isDisb
                        ? 'bg-slate-100 dark:bg-navy-950 text-navy-950 dark:text-slate-200 border border-slate-200 dark:border-navy-800'
                        : 'bg-yellow-50 dark:bg-yellow-950/40 text-yellow-600 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-700/50'
                    }`}
                  >
                    {isDisb ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-navy-950 dark:text-slate-100">
                      {tx.counterparty_name}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <span className="font-semibold">{formatChannelName(tx.channel)}</span>
                      <span>•</span>
                      <span>{formatDate(tx.created_at)}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p
                    className={`text-xs sm:text-sm font-black tabular-nums ${
                      isDisb
                        ? 'text-navy-950 dark:text-slate-100'
                        : 'text-yellow-600 dark:text-yellow-400'
                    }`}
                  >
                    {isDisb ? '-' : '+'}
                    {formatAmount(tx.amount, tx.currency || 'GH₵')}
                  </p>
                  <div className="flex items-center justify-end mt-0.5">
                    <Badge variant={tx.status === 'SUCCESS' ? 'emerald' : 'amber'} size="sm">
                      {tx.status}
                    </Badge>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
};
