'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowRight,
  Play,
  RotateCcw,
  Check,
  Eye,
  Lock,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  UserX,
  UserCheck,
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';
import {
  PaymentList,
  PaymentListVerificationResponse,
  RecipientVerificationItem,
} from '@/types';
import { formatCurrency } from '@/lib/formatters';
import { api } from '@/services/api';
import { PaymentReviewModal } from '@/components/payments/PaymentReviewModal';

export interface PrePaymentVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentList: PaymentList | null;
  onPaymentSuccess: () => void;
}

export const PrePaymentVerificationModal: React.FC<PrePaymentVerificationModalProps> = ({
  isOpen,
  onClose,
  paymentList,
  onPaymentSuccess,
}) => {
  const { toast } = useToast();

  const [verifying, setVerifying] = useState(true);
  const [verificationData, setVerificationData] = useState<PaymentListVerificationResponse | null>(null);
  const [simulateMismatch, setSimulateMismatch] = useState(false);
  const [items, setItems] = useState<RecipientVerificationItem[]>([]);
  const [reviewingItem, setReviewingItem] = useState<RecipientVerificationItem | null>(null);
  const [disbursing, setDisbursing] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  // Run KYC name enquiry on open or toggle
  const runVerification = async (mismatchMode: boolean) => {
    if (!paymentList) return;
    setVerifying(true);
    try {
      const res = await api.verifyPaymentListRecipients(paymentList.id, mismatchMode);
      setVerificationData(res);
      setItems(res.results);
    } catch (err: any) {
      toast({ type: 'error', title: 'Verification Failed', message: err.message });
    } finally {
      setVerifying(false);
    }
  };

  useEffect(() => {
    if (isOpen && paymentList) {
      runVerification(simulateMismatch);
    }
  }, [isOpen, paymentList]);

  if (!paymentList) return null;

  const hasUnresolvedMismatch = items.some((item) => !item.is_match);

  // Review & Resolution Actions
  const handleResolveMismatch = (itemId: string, newName: string) => {
    setItems((prev) =>
      prev.map((i) => {
        if (i.id !== itemId) return i;
        return {
          ...i,
          saved_recipient_name: newName,
          returned_account_name: newName,
          match_status: 'MATCH_VERIFIED',
          is_match: true,
          error_message: null,
        };
      })
    );
    setReviewingItem(null);
    toast({
      type: 'success',
      title: 'Mismatch Resolved',
      message: `Beneficiary details updated to match registered KYC account (${newName}).`,
    });
  };

  const handleExcludeItem = (itemId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== itemId));
    setReviewingItem(null);
    toast({
      type: 'info',
      title: 'Beneficiary Excluded',
      message: 'Mismatched line item excluded from this payment run.',
    });
  };

  const handleDisburse = () => {
    if (hasUnresolvedMismatch) {
      toast({
        type: 'error',
        title: 'Disbursement Blocked',
        message: 'Do not allow the demo to silently process an unresolved mismatch.',
      });
      return;
    }
    setIsReviewOpen(true);
  };

  return (
    <>
      <Modal
        isOpen={isOpen && !reviewingItem}
        onClose={onClose}
        title="Pre-Payment Recipient Verification"
        description="Verify recipient telecom & bank account names via authorized provider adapter before funds leave."
        maxWidth="lg"
      >
        <div className="space-y-5">
          {/* Header Banner & Demo Switch for Judges */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Target Payment List
              </span>
              <p className="text-base font-black text-navy-950 dark:text-slate-100">
                {paymentList.name}
              </p>
              <span className="text-xs text-yellow-600 dark:text-yellow-400 font-bold tabular-nums">
                {formatCurrency(paymentList.total_amount, paymentList.currency)} • {items.length} Recipients
              </span>
            </div>

            {/* Judge Interactive Scenario Toggle */}
            <div className="flex items-center gap-2 p-2 rounded-lg bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Simulate Name Mismatch:
              </span>
              <button
                type="button"
                onClick={() => {
                  const next = !simulateMismatch;
                  setSimulateMismatch(next);
                  runVerification(next);
                }}
                className={`px-2.5 py-1 rounded-md text-xs font-black transition-all flex items-center gap-1 ${
                  simulateMismatch
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-navy-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {simulateMismatch ? '🔴 Mismatch Mode ON' : '🟢 Verified Mode'}
              </button>
            </div>
          </div>

          {/* Critical Mismatch Warning Alert (When Detected) */}
          {hasUnresolvedMismatch && (
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/50 border-2 border-rose-500/70 text-xs space-y-3 animate-fade-in shadow-modal">
              <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300 font-black text-sm">
                <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
                <span>🔴 NAME MISMATCH DETECTED: PAYOUT HALTED</span>
              </div>
              <p className="text-rose-900 dark:text-rose-200 leading-relaxed font-medium">
                Recipient details don't match the saved beneficiary. Mobira pre-flight intelligence detected that the registered telecom subscriber name differs from your saved beneficiary record.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onClose}
                  className="bg-white dark:bg-navy-900 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800 text-xs font-bold"
                >
                  [CANCEL PAYMENT]
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    const firstMismatch = items.find((i) => !i.is_match);
                    if (firstMismatch) setReviewingItem(firstMismatch);
                  }}
                  className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-black gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" /> [REVIEW DETAILS]
                </Button>
              </div>
            </div>
          )}

          {/* Verification Ledger Cards */}
          <div className="space-y-3">
            <span className="text-[11px] uppercase font-bold text-slate-400 block tracking-wider">
              Verification Results ({items.length} Checked)
            </span>

            <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
              {items.map((item) => {
                const isMatch = item.is_match;

                return (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      isMatch
                        ? 'bg-white dark:bg-navy-900 border-slate-200 dark:border-navy-800'
                        : 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-400 dark:border-rose-800 shadow-subtle'
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      {/* Left: Saved Recipient */}
                      <div className="space-y-0.5">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">
                          Saved Recipient
                        </span>
                        <p className="font-extrabold text-sm text-navy-950 dark:text-slate-100">
                          {item.saved_recipient_name}
                        </p>
                        <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
                          {item.masked_phone} • {item.provider}
                        </p>
                      </div>

                      {/* Middle: Returned Account Name */}
                      <div className="space-y-0.5">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">
                          Returned Account Name
                        </span>
                        <p
                          className={`font-black text-sm ${
                            isMatch
                              ? 'text-navy-950 dark:text-slate-100'
                              : 'text-rose-600 dark:text-rose-400'
                          }`}
                        >
                          {item.returned_account_name}
                        </p>
                        <span className="text-[10px] text-slate-400 block">
                          KYC Name Enquiry via Provider
                        </span>
                      </div>

                      {/* Right: Status Badge & Actions */}
                      <div className="flex flex-col items-end gap-1.5">
                        {isMatch ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-xs font-black border border-emerald-300 dark:border-emerald-800">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            🟢 MATCH VERIFIED
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-300 text-xs font-black border border-rose-300 dark:border-rose-800">
                            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                            🔴 NAME MISMATCH
                          </span>
                        )}

                        {!isMatch && (
                          <button
                            type="button"
                            onClick={() => setReviewingItem(item)}
                            className="text-xs font-bold text-rose-600 dark:text-rose-400 underline hover:text-rose-800"
                          >
                            [REVIEW DETAILS]
                          </button>
                        )}
                      </div>
                    </div>

                    {!isMatch && item.error_message && (
                      <div className="mt-2 pt-2 border-t border-rose-200 dark:border-rose-900/60 text-[11px] text-rose-600 dark:text-rose-400 font-semibold flex items-center justify-between">
                        <span>{item.error_message}</span>
                        <span className="font-bold">Amount: {formatCurrency(item.amount, paymentList.currency)}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-navy-800">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="text-xs font-semibold"
            >
              [CANCEL PAYMENT]
            </Button>

            <div className="flex items-center gap-3">
              {hasUnresolvedMismatch ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5" /> Payout Blocked (1 Mismatch)
                  </span>
                  <Button
                    type="button"
                    variant="primary"
                    disabled
                    className="opacity-50 cursor-not-allowed text-xs font-black gap-2"
                  >
                    <Lock className="w-3.5 h-3.5" /> Cannot Disburse with Mismatch
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="primary"
                  isLoading={disbursing}
                  onClick={handleDisburse}
                  className="gap-2 text-xs font-black bg-emerald-600 hover:bg-emerald-700 text-white shadow-elevated"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Disburse Payment List ({formatCurrency(paymentList.total_amount, paymentList.currency)})
                </Button>
              )}
            </div>
          </div>
        </div>
      </Modal>

      {/* Review Details Sub-Modal */}
      {reviewingItem && (
        <Modal
          isOpen={Boolean(reviewingItem)}
          onClose={() => setReviewingItem(null)}
          title="Review Beneficiary Mismatch"
          description="Resolve identity discrepancies before authorising corporate funds release."
          maxWidth="md"
        >
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Saved Recipient:</span>
                <strong className="text-sm font-bold text-navy-950 dark:text-white">
                  {reviewingItem.saved_recipient_name}
                </strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Telephone / Account:</span>
                <span className="font-mono text-slate-700 dark:text-slate-300">
                  {reviewingItem.saved_phone}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-navy-800">
                <span className="text-rose-500 font-bold uppercase text-[10px]">Returned Account Name:</span>
                <strong className="text-sm font-black text-rose-600 dark:text-rose-400">
                  {reviewingItem.returned_account_name}
                </strong>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              The phone number <strong className="font-mono">{reviewingItem.saved_phone}</strong> is registered under{' '}
              <strong className="text-navy-950 dark:text-white">{reviewingItem.returned_account_name}</strong> in the mobile network operator registry, not{' '}
              <strong className="text-navy-950 dark:text-white">{reviewingItem.saved_recipient_name}</strong>.
            </p>

            <div className="space-y-2 pt-2">
              <Button
                type="button"
                variant="primary"
                className="w-full text-xs font-bold gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={() =>
                  handleResolveMismatch(reviewingItem.id, reviewingItem.returned_account_name)
                }
              >
                <UserCheck className="w-4 h-4" />
                Update Saved Beneficiary to "{reviewingItem.returned_account_name}" & Verify
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full text-xs font-semibold gap-2 border-slate-300 dark:border-navy-700 text-rose-600 dark:text-rose-400 hover:bg-rose-50"
                onClick={() => handleExcludeItem(reviewingItem.id)}
              >
                <UserX className="w-4 h-4" />
                Exclude Recipient from This Payment Run
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full text-xs text-slate-500"
                onClick={() => setReviewingItem(null)}
              >
                Back to Verification List
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Part 14: Payment Review & Part 15: Mock Payment Processing */}
      <PaymentReviewModal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        businessName="ABC Technologies Ltd"
        recipientCount={paymentList.recipient_count || items.length}
        totalAmount={paymentList.total_amount}
        currency={paymentList.currency}
        providerName="MTN MoMo Business — Demo"
        onCompleted={() => {
          setIsReviewOpen(false);
          onPaymentSuccess();
          onClose();
        }}
      />
    </>
  );
};
