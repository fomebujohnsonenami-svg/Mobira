'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, ShieldCheck, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { BusinessVerificationBadge } from '@/components/verification/BusinessVerificationBadge';
import { api } from '@/services/api';
import { useToast } from '@/components/ui/Toast';
import { Recipient, Payment } from '@/types';
import { formatCurrency } from '@/lib/formatters';

export interface DisbursementWizardProps {
  isOpen: boolean;
  onClose: () => void;
  recipients: Recipient[];
  onPaymentSuccess: (payment: Payment) => void;
  initialData?: {
    account_identifier?: string;
    recipient_name?: string;
    channel?: string;
  };
}

export const DisbursementWizard: React.FC<DisbursementWizardProps> = ({
  isOpen,
  onClose,
  recipients,
  onPaymentSuccess,
  initialData,
}) => {
  const { toast } = useToast();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [recipientName, setRecipientName] = useState(initialData?.recipient_name || '');
  const [channel, setChannel] = useState(initialData?.channel || 'MTN_MOMO');
  const [account, setAccount] = useState(initialData?.account_identifier || '');
  const [amount, setAmount] = useState<number>(150000);
  const [narration, setNarration] = useState('');
  const [requirePreflight, setRequirePreflight] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelectRecipient = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const recId = e.target.value;
    const found = recipients.find((r) => r.id === recId);
    if (found) {
      setRecipientName(found.name);
      setChannel(found.channel);
      setAccount(found.account_identifier);
    }
  };

  const calculatedFee = Math.max(50, Math.min(2500, Math.round(amount * 0.005)));
  const isMakerCheckerRequired = amount >= 500000;

  const handleSubmitDisbursement = async () => {
    setIsSubmitting(true);
    try {
      const payment = await api.disbursePayment({
        recipient_name: recipientName,
        account_identifier: account,
        channel,
        amount,
        narration,
        require_preflight: requirePreflight,
      });

      if (payment.status === 'PENDING_APPROVAL') {
        toast({
          type: 'warning',
          title: 'High-Value Payment Queued for Approval',
          message: `Amount exceeds 500,000 XAF. Queued for CFO dual authorization.`,
        });
      } else {
        toast({
          type: 'success',
          title: 'Payment Disbursed Successfully',
          message: `${formatCurrency(amount)} transferred via ${channel}. Ref: ${payment.reference_id}`,
        });
      }

      onPaymentSuccess(payment);
      onClose();
      setStep(1);
    } catch (err: any) {
      toast({
        type: 'error',
        title: 'Disbursement Failed',
        message: err.message || 'Error processing on rail.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Initiate Business Payout (PAY)"
      description="Corporate multi-rail disbursement with automated pre-flight identity check."
      maxWidth="lg"
    >
      <div className="space-y-5">
        {/* Step Indicator */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-navy-800 pb-3">
          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                step >= 1 ? 'bg-yellow-500 text-navy-950' : 'bg-slate-200 dark:bg-navy-800 text-slate-600'
              }`}
            >
              1
            </span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Recipient</span>
          </div>
          <div className="w-8 h-0.5 bg-slate-200 dark:border-navy-800" />
          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                step >= 2 ? 'bg-yellow-500 text-navy-950' : 'bg-slate-200 dark:bg-navy-800 text-slate-600'
              }`}
            >
              2
            </span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Amount & Policy</span>
          </div>
          <div className="w-8 h-0.5 bg-slate-200 dark:border-navy-800" />
          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                step >= 3 ? 'bg-yellow-500 text-navy-950' : 'bg-slate-200 dark:bg-navy-800 text-slate-600'
              }`}
            >
              3
            </span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Review & Send</span>
          </div>
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <div className="space-y-4">
            {recipients.length > 0 && (
              <Select
                label="Select Pre-Verified Beneficiary"
                options={[
                  { value: '', label: '-- Choose a saved supplier or contractor --' },
                  ...recipients.map((r) => ({
                    value: r.id,
                    label: `${r.name} (${r.channel} • ${r.account_identifier})`,
                  })),
                ]}
                onChange={handleSelectRecipient}
              />
            )}

            <Input
              label="Recipient Full Legal Name"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="e.g. Douala Organic Supplies SARL"
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Payment Rail"
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
                options={[
                  { value: 'MTN_MOMO', label: 'MTN Mobile Money' },
                  { value: 'ORANGE_MONEY', label: 'Orange Money' },
                  { value: 'BANK_TRANSFER', label: 'Interbank EFT (GIMAC)' },
                ]}
              />
              <Input
                label="Phone Number or Bank IBAN"
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                placeholder="+237 670 000 111"
                required
              />
            </div>

            <div className="flex justify-end pt-3">
              <Button
                variant="primary"
                disabled={!recipientName || !account}
                onClick={() => setStep(2)}
                className="gap-2 text-xs"
              >
                Next: Amount & Policy <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="space-y-4">
            <Input
              label="Transfer Amount (XAF / FCFA)"
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              required
            />

            <Input
              label="Payment Memo / Narration"
              value={narration}
              onChange={(e) => setNarration(e.target.value)}
              placeholder="e.g. Settlement for delivery batch #104"
            />

            <div className="p-3.5 bg-slate-50 dark:bg-navy-950 rounded-xl border border-slate-200 dark:border-navy-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Gross Amount:</span>
                <span className="font-bold text-navy-950 dark:text-slate-100 tabular-nums">{formatCurrency(amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Platform Fee (0.5% capped):</span>
                <span className="font-bold text-navy-950 dark:text-slate-100 tabular-nums">{formatCurrency(calculatedFee)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-navy-800 font-bold">
                <span className="text-navy-950 dark:text-white">Total Deducted:</span>
                <span className="text-yellow-600 dark:text-yellow-400 tabular-nums">{formatCurrency(amount + calculatedFee)}</span>
              </div>
            </div>

            {isMakerCheckerRequired && (
              <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950/40 border border-yellow-300 dark:border-yellow-700/60 text-xs text-yellow-950 dark:text-yellow-200 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">Maker-Checker Dual Governance Active</strong>
                  Since this payment is &gt;= 500,000 XAF, it requires second sign-off by a CFO / Admin before clearing.
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="preflight-toggle"
                checked={requirePreflight}
                onChange={(e) => setRequirePreflight(e.target.checked)}
                className="w-4 h-4 rounded text-yellow-500 focus:ring-yellow-500"
              />
              <label htmlFor="preflight-toggle" className="text-xs text-slate-700 dark:text-slate-300 font-semibold cursor-pointer">
                Run pre-flight identity check before dispatching funds
              </label>
            </div>

            <div className="flex justify-between pt-3">
              <Button variant="outline" onClick={() => setStep(1)} className="gap-2 text-xs">
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </Button>
              <Button variant="primary" onClick={() => setStep(3)} className="gap-2 text-xs">
                Review & Confirm <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50/40 dark:bg-navy-950 border border-yellow-300 dark:border-yellow-700/60 rounded-xl space-y-2 text-xs">
              <div className="flex items-center gap-2 pb-2 border-b border-yellow-200 dark:border-navy-800">
                <ShieldCheck className="w-4 h-4 text-yellow-500" />
                <span className="font-extrabold text-xs uppercase tracking-wider text-navy-950 dark:text-yellow-300">
                  Transaction Summary
                </span>
              </div>
              <div className="flex justify-between items-center pt-1 border-b border-yellow-200/60 dark:border-navy-800/60 pb-1.5">
                <span className="text-slate-500 dark:text-slate-400">Debited Entity:</span>
                <BusinessVerificationBadge size="sm" />
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-500 dark:text-slate-400">Beneficiary:</span>
                <span className="font-bold text-navy-950 dark:text-white">{recipientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Account / Phone:</span>
                <span className="font-mono text-navy-950 dark:text-white">{account}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Payment Rail:</span>
                <span className="font-semibold text-navy-950 dark:text-white">{channel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Transfer Amount:</span>
                <span className="font-black text-sm text-yellow-600 dark:text-yellow-400 tabular-nums">
                  {formatCurrency(amount)}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              By authorizing, Mobira routes this payout programmatically through the simulated telecom rail and writes an immutable double-entry ledger entry.
            </p>

            <div className="flex justify-between pt-3">
              <Button variant="outline" onClick={() => setStep(2)} className="gap-2 text-xs">
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </Button>
              <Button
                variant="primary"
                isLoading={isSubmitting}
                onClick={handleSubmitDisbursement}
                className="gap-2 text-xs font-bold"
              >
                <Send className="w-3.5 h-3.5" /> Authorize & Send Payment
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
