'use client';

import React from 'react';
import { Receipt, CheckCircle2 } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { BusinessVerificationBadge } from '@/components/verification/BusinessVerificationBadge';
import { Transaction } from '@/types';
import { formatCurrency, formatDate, formatChannelName } from '@/lib/formatters';

export interface TransactionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}

export const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({
  isOpen,
  onClose,
  transaction,
}) => {
  if (!transaction) return null;

  const isDisb = transaction.direction === 'DISBURSEMENT';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Transaction Receipt"
      description="Cryptographically reconciled settlement record"
      maxWidth="md"
    >
      <div className="space-y-4 text-xs">
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 text-center">
          <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">
            Settlement Amount
          </span>
          <p
            className={`text-2xl font-black mt-1 tabular-nums ${
              isDisb
                ? 'text-navy-950 dark:text-slate-100'
                : 'text-yellow-600 dark:text-yellow-400'
            }`}
          >
            {isDisb ? '-' : '+'}
            {formatCurrency(transaction.amount)}
          </p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <Badge variant="emerald" size="sm" className="gap-1">
              <CheckCircle2 className="w-3 h-3" /> Settled
            </Badge>
          </div>
        </div>

        <div className="space-y-2.5 p-3 rounded-xl border border-slate-200 dark:border-navy-800">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200/60 dark:border-navy-800/60">
            <span className="text-slate-500 dark:text-slate-400">Settlement Entity:</span>
            <BusinessVerificationBadge size="sm" />
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">Ledger Reference:</span>
            <span className="font-mono font-bold text-navy-950 dark:text-slate-100">{transaction.reference}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">Counterparty:</span>
            <span className="font-bold text-navy-950 dark:text-slate-100">{transaction.counterparty_name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">Account / Phone:</span>
            <span className="font-mono text-navy-950 dark:text-slate-100">{transaction.counterparty_identifier}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">Payment Rail:</span>
            <span className="font-medium text-navy-950 dark:text-slate-100">{formatChannelName(transaction.channel)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">Platform Fee:</span>
            <span className="font-bold text-navy-950 dark:text-slate-100 tabular-nums">{formatCurrency(transaction.fee)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">Timestamp:</span>
            <span className="text-navy-950 dark:text-slate-100">{formatDate(transaction.created_at)}</span>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="secondary" size="sm" onClick={onClose} className="text-xs">
            Close Receipt
          </Button>
        </div>
      </div>
    </Modal>
  );
};
