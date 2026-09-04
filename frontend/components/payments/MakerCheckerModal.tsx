'use client';

import React, { useState } from 'react';
import { CheckCircle2, ShieldAlert } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Payment } from '@/types';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { BusinessVerificationBadge } from '@/components/verification/BusinessVerificationBadge';
import { api } from '@/services/api';
import { useToast } from '@/components/ui/Toast';

export interface MakerCheckerModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: Payment | null;
  onApproved: (updated: Payment) => void;
}

export const MakerCheckerModal: React.FC<MakerCheckerModalProps> = ({
  isOpen,
  onClose,
  payment,
  onApproved,
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  if (!payment) return null;

  const handleApprove = async () => {
    setLoading(true);
    try {
      const updated = await api.approvePayment(payment.reference_id);
      toast({
        type: 'success',
        title: 'Payment Dual-Approved & Executed',
        message: `Reference ${payment.reference_id} cleared on rail.`,
      });
      onApproved(updated);
      onClose();
    } catch (err: any) {
      toast({
        type: 'error',
        title: 'Approval Failed',
        message: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Maker-Checker Dual Approval"
      description="Dual-signature authorization for corporate disbursements."
      maxWidth="md"
    >
      <div className="space-y-4">
        <div className="p-3.5 bg-yellow-50 dark:bg-yellow-950/40 border border-yellow-300 dark:border-yellow-700/60 rounded-xl flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5" />
          <div className="text-xs text-yellow-950 dark:text-yellow-200">
            <p className="font-bold">Policy Threshold Exceeded (&gt; 500,000 XAF)</p>
            <p className="mt-0.5">
              Initiated by <strong>{payment.maker_name || 'Finance Clerk'}</strong> on {formatDate(payment.created_at)}. Requires Checker (CFO/Admin) sign-off.
            </p>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-navy-950 p-4 rounded-xl border border-slate-200 dark:border-navy-800 space-y-2.5 text-xs">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200/60 dark:border-navy-800/60">
            <span className="text-slate-500 dark:text-slate-400">Originating Entity:</span>
            <BusinessVerificationBadge size="sm" />
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">Reference:</span>
            <span className="font-mono font-bold text-navy-950 dark:text-slate-200">{payment.reference_id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">Beneficiary:</span>
            <span className="font-bold text-navy-950 dark:text-white">{payment.recipient_name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">Account / Phone:</span>
            <span className="font-mono text-navy-950 dark:text-slate-200">{payment.account_identifier}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 dark:text-slate-400">Payment Rail:</span>
            <span className="font-semibold text-navy-950 dark:text-slate-200">{payment.channel}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-navy-800">
            <span className="text-navy-950 dark:text-white font-bold">Transfer Amount:</span>
            <span className="font-black text-base text-yellow-600 dark:text-yellow-400 tabular-nums">
              {formatCurrency(payment.amount)}
            </span>
          </div>
        </div>

        <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-200 dark:border-navy-800">
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            isLoading={loading}
            onClick={handleApprove}
            className="gap-2 text-xs font-bold"
          >
            <CheckCircle2 className="w-4 h-4" /> Authorize & Clear Transfer
          </Button>
        </div>
      </div>
    </Modal>
  );
};
