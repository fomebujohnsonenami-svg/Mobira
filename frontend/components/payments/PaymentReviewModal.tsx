'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ShieldCheck,
  Building,
  Users,
  CreditCard,
  ArrowRight,
  Sparkles,
  Check,
  RotateCcw,
  Receipt,
  FileCheck2,
  ExternalLink,
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { BusinessVerificationBadge } from '@/components/verification/BusinessVerificationBadge';
import { formatCurrency } from '@/lib/formatters';

export interface PaymentReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessName?: string;
  recipientCount?: number;
  totalAmount?: number;
  currency?: string;
  providerName?: string;
  onCompleted?: () => void;
}

export const PaymentReviewModal: React.FC<PaymentReviewModalProps> = ({
  isOpen,
  onClose,
  businessName = 'ABC Technologies Ltd',
  recipientCount = 48,
  totalAmount = 142000,
  currency = 'GH₵',
  providerName = 'MTN MoMo Business — Demo',
  onCompleted,
}) => {
  const router = useRouter();

  // Stages: 'REVIEW' | 'PROCESSING' | 'SUCCESS'
  const [stage, setStage] = useState<'REVIEW' | 'PROCESSING' | 'SUCCESS'>('REVIEW');
  const [processedCount, setProcessedCount] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'SUMMARY' | 'LINE_ITEMS'>('SUMMARY');

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStage('REVIEW');
      setProcessedCount(0);
      setActiveTab('SUMMARY');
    }
  }, [isOpen]);

  // Animated processing sequence: 0 -> 16 -> 32 -> 48 -> Success
  const handleAuthorize = () => {
    setStage('PROCESSING');
    setProcessedCount(0);

    const step1 = setTimeout(() => {
      setProcessedCount(16);
    }, 500);

    const step2 = setTimeout(() => {
      setProcessedCount(32); // Exact requested prompt state: 32/48
    }, 1200);

    const step3 = setTimeout(() => {
      setProcessedCount(48);
    }, 2000);

    const step4 = setTimeout(() => {
      setStage('SUCCESS');
      onCompleted?.();
    }, 2600);

    return () => {
      clearTimeout(step1);
      clearTimeout(step2);
      clearTimeout(step3);
      clearTimeout(step4);
    };
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={stage === 'PROCESSING' ? () => {} : onClose}
      title={
        stage === 'REVIEW'
          ? 'Payment Review'
          : stage === 'PROCESSING'
          ? 'Payment Authorized'
          : 'Payment Successful'
      }
      description={
        stage === 'REVIEW'
          ? 'Review and authorize batch disbursement across telecom mobile money rails.'
          : stage === 'PROCESSING'
          ? 'Processing payments...'
          : '48/48 payments completed'
      }
      maxWidth="md"
    >
      {/* ========================================================================= */}
      {/* PART 14 — PAYMENT REVIEW SCREEN                                           */}
      {/* ========================================================================= */}
      {stage === 'REVIEW' && (
        <div className="space-y-6">
          {/* Header Review Card */}
          <div className="rounded-2xl bg-white dark:bg-navy-900 border-2 border-slate-200 dark:border-navy-800 p-5 shadow-sm divide-y divide-slate-100 dark:divide-navy-800 space-y-4">
            {/* Row 1: Business */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Business
              </span>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-navy-950 dark:text-slate-100">
                  {businessName}
                </span>
                <BusinessVerificationBadge size="sm" />
              </div>
            </div>

            {/* Row 2: Recipients */}
            <div className="flex items-center justify-between pt-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Recipients
              </span>
              <span className="text-base font-black text-navy-950 dark:text-slate-100 font-mono">
                {recipientCount}
              </span>
            </div>

            {/* Row 3: Total Amount */}
            <div className="flex items-center justify-between pt-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Total Amount
              </span>
              <span className="text-2xl font-black text-yellow-600 dark:text-yellow-400 tabular-nums">
                {formatCurrency(totalAmount, currency)}
              </span>
            </div>

            {/* Row 4: Payment Provider */}
            <div className="flex items-center justify-between pt-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Payment Provider
              </span>
              <div className="flex items-center gap-1.5 font-bold text-xs text-navy-950 dark:text-slate-200">
                <span className="w-2 h-2 rounded-full bg-yellow-500" />
                <span>{providerName}</span>
              </div>
            </div>

            {/* Row 5: Recipient Verification */}
            <div className="flex items-center justify-between pt-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Recipient Verification
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-xs font-black border border-emerald-300 dark:border-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5" /> {recipientCount}/{recipientCount} Verified
              </span>
            </div>
          </div>

          {/* Trust Banner */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Dual-check completed: Beneficiary mobile accounts validated via network KYC enquiries.</span>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="w-full py-2.5 text-xs font-bold uppercase tracking-wider"
            >
              [ CANCEL ]
            </Button>

            <Button
              type="button"
              variant="primary"
              onClick={handleAuthorize}
              className="w-full py-2.5 text-xs font-black uppercase tracking-wider shadow-elevated bg-yellow-500 hover:bg-yellow-400 text-navy-950 gap-2"
            >
              [ AUTHORIZE PAYMENT ]
            </Button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PART 15 — MOCK PAYMENT PROCESSING SCREEN (32/48 PROGRESS)                 */}
      {/* ========================================================================= */}
      {stage === 'PROCESSING' && (
        <div className="space-y-6 py-4 text-center">
          <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-yellow-500/20 animate-ping" />
            <div className="w-20 h-20 rounded-full bg-yellow-500/10 border-4 border-yellow-500 border-t-transparent animate-spin" />
            <div className="absolute font-black text-sm text-navy-950 dark:text-white font-mono">
              {processedCount}/{recipientCount}
            </div>
          </div>

          <div className="space-y-1.5">
            <h3 className="text-xl font-black text-navy-950 dark:text-white">
              Payment Authorized
            </h3>
            <p className="text-sm font-semibold text-yellow-600 dark:text-yellow-400 animate-pulse">
              Processing payments...
            </p>
          </div>

          {/* Prominent Progress Bar and Exact Prompt Text (32/48) */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
              <span>Disbursement Queue:</span>
              <span className="font-mono text-base font-black text-navy-950 dark:text-white">
                {processedCount}/{recipientCount}
              </span>
            </div>

            <div className="w-full bg-slate-200 dark:bg-navy-800 rounded-full h-3 overflow-hidden">
              <div
                className="bg-yellow-500 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(processedCount / recipientCount) * 100}%` }}
              />
            </div>

            <p className="text-[11px] text-slate-400">
              Communicating with MTN MoMo Partner Gateway API via MockPaymentProvider adapter.
            </p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PART 15 — PAYMENT SUCCESSFUL & BATCH REPORT                               */}
      {/* ========================================================================= */}
      {stage === 'SUCCESS' && (
        <div className="space-y-5">
          {/* Top Success Badge */}
          <div className="text-center space-y-2 pt-2">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border-2 border-emerald-300 dark:border-emerald-700/60">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>
            <h3 className="text-2xl font-black text-navy-950 dark:text-white">
              Payment Successful
            </h3>
            <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
              48/48 payments completed
            </p>
          </div>

          {/* Details Card */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 divide-y divide-slate-200 dark:divide-navy-800 space-y-3 text-xs">
            <div className="flex justify-between items-center pt-1">
              <span className="text-slate-500 uppercase font-bold text-[10px]">Total</span>
              <strong className="text-xl font-black text-yellow-600 dark:text-yellow-400 tabular-nums">
                {formatCurrency(totalAmount, currency)}
              </strong>
            </div>

            <div className="flex justify-between items-center pt-3">
              <span className="text-slate-500 uppercase font-bold text-[10px]">Transaction Batch ID</span>
              <strong className="font-mono text-xs font-extrabold text-navy-950 dark:text-white">
                MOB-2026-000184
              </strong>
            </div>

            <div className="flex justify-between items-center pt-3">
              <span className="text-slate-500 uppercase font-bold text-[10px]">Debited Account</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                MTN MoMo Business •••• 4821
              </span>
            </div>
          </div>

          {/* Realistic Status Handling Demonstration Breakdown */}
          <div className="p-4 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 space-y-2.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Realistic Transaction Handling Breakdown
            </span>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
                <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 block">46</span>
                <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300">🟢 Successful</span>
              </div>

              <div className="p-2.5 rounded-lg bg-yellow-50 dark:bg-yellow-950/40 border border-yellow-200 dark:border-yellow-800/60">
                <span className="text-lg font-black text-yellow-600 dark:text-yellow-400 block">1</span>
                <span className="text-[10px] font-bold text-yellow-700 dark:text-yellow-300">🟡 Pending</span>
              </div>

              <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60">
                <span className="text-lg font-black text-rose-600 dark:text-rose-400 block">1</span>
                <span className="text-[10px] font-bold text-rose-700 dark:text-rose-300">🔴 Failed</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1">
              Line item #47 queued for automated network retry; line item #48 flagged due to recipient KYC wallet limit.
            </p>
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onClose();
                router.push('/transactions');
              }}
              className="w-full text-xs font-bold gap-2 border-slate-300 dark:border-navy-700"
            >
              <Receipt className="w-3.5 h-3.5 text-yellow-500" />
              View in Transactions
            </Button>

            <Button
              type="button"
              variant="primary"
              onClick={onClose}
              className="w-full text-xs font-black shadow-elevated bg-yellow-500 hover:bg-yellow-400 text-navy-950"
            >
              [ DONE ]
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};
