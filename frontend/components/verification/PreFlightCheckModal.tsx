'use client';

import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, AlertTriangle, XCircle, Search, ArrowRight } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { api } from '@/services/api';
import { VerificationResult } from '@/types';

export interface PreFlightCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedWithPayment?: (result: VerificationResult) => void;
}

export const PreFlightCheckModal: React.FC<PreFlightCheckModalProps> = ({
  isOpen,
  onClose,
  onProceedWithPayment,
}) => {
  const [channel, setChannel] = useState('MTN_MOMO');
  const [account, setAccount] = useState('+237670000111');
  const [expectedName, setExpectedName] = useState('Douala Organic Supplies');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.preflightVerify(channel, account, expectedName);
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const setDemoPreset = (presetAccount: string, presetName: string, presetChannel: string) => {
    setAccount(presetAccount);
    setExpectedName(presetName);
    setChannel(presetChannel);
    setResult(null);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Pre-Flight Identity Check (Anti-Fraud)"
      description="Verify mobile money subscriber name or legal entity before transferring funds."
      maxWidth="lg"
    >
      <div className="space-y-5">
        {/* Fast Demo Scenarios */}
        <div className="p-3 bg-slate-50 dark:bg-navy-950/70 rounded-xl border border-slate-200 dark:border-navy-800">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            Competition Presentation Scenarios:
          </p>
          <div className="flex flex-wrap gap-2 text-xs">
            <button
              type="button"
              onClick={() => setDemoPreset('+237670000111', 'Douala Organic Supplies', 'MTN_MOMO')}
              className="px-2.5 py-1 rounded bg-yellow-100 dark:bg-yellow-950/60 text-yellow-900 dark:text-yellow-300 font-bold border border-yellow-300 dark:border-yellow-700/60 hover:bg-yellow-200 text-xs"
            >
              Exact Match (Douala Organic)
            </button>
            <button
              type="button"
              onClick={() => setDemoPreset('+237670000111', 'Totally Wrong Ghost Co', 'MTN_MOMO')}
              className="px-2.5 py-1 rounded bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 font-bold border border-rose-200 dark:border-rose-800/80 hover:bg-rose-200 text-xs"
            >
              Fraud Mismatch Trigger
            </button>
            <button
              type="button"
              onClick={() => setDemoPreset('RC/DLA/2020/B/4521', 'Douala Agro-Tech SARL', 'BUSINESS_RCCM')}
              className="px-2.5 py-1 rounded bg-navy-100 dark:bg-navy-800 text-navy-950 dark:text-slate-200 font-bold border border-navy-200 dark:border-navy-700 hover:bg-navy-200 text-xs"
            >
              National Registry (RCCM)
            </button>
          </div>
        </div>

        <form onSubmit={handleVerify} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Payment / Identity Rail"
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
              options={[
                { value: 'MTN_MOMO', label: 'MTN Mobile Money (CM)' },
                { value: 'ORANGE_MONEY', label: 'Orange Money (CM)' },
                { value: 'BANK_TRANSFER', label: 'Interbank EFT (GIMAC)' },
                { value: 'BUSINESS_RCCM', label: 'Commercial Registry (RCCM)' },
              ]}
            />
            <Input
              label="Account Number / Phone / RCCM"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              placeholder="+237 670 000 111"
              required
            />
          </div>

          <Input
            label="Expected Legal or Vendor Name"
            value={expectedName}
            onChange={(e) => setExpectedName(e.target.value)}
            placeholder="e.g. Douala Organic Supplies SARL"
            helperText="Mobira compares this with registered telecom KYC records to prevent wrong-number payouts."
          />

          <Button type="submit" variant="primary" isLoading={loading} className="w-full gap-2 font-bold text-xs py-2.5">
            <Search className="w-4 h-4" /> Run Pre-Flight Verification
          </Button>
        </form>

        {/* Results Card with Accessible Contrast */}
        {result && (
          <div
            className={`p-4 rounded-xl border transition-all ${
              result.is_safe_to_pay
                ? 'bg-yellow-50/40 dark:bg-navy-950 border-yellow-300 dark:border-yellow-700/60'
                : 'bg-rose-50/50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {result.is_safe_to_pay ? (
                  <CheckCircle2 className="w-6 h-6 text-yellow-600 dark:text-yellow-400 shrink-0" />
                ) : (
                  <XCircle className="w-6 h-6 text-rose-600 shrink-0" />
                )}
                <div>
                  <h4 className="font-extrabold text-sm sm:text-base text-navy-950 dark:text-slate-100">
                    {result.is_safe_to_pay ? 'Pre-Flight Identity Confirmed' : 'Identity Mismatch Detected!'}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Rail Authority: <strong className="text-navy-950 dark:text-slate-200">{result.carrier_or_bank}</strong>
                  </p>
                </div>
              </div>
              <Badge variant={result.is_safe_to_pay ? 'gold' : 'rose'} size="md">
                {result.confidence_score}% Confidence
              </Badge>
            </div>

            <div className="mt-3.5 pt-3 border-t border-slate-200 dark:border-navy-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Registered Name:</span>
                <span className="font-bold text-navy-950 dark:text-white">{result.registered_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Invoice Expected Name:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">{result.expected_name || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Verification Code:</span>
                <span className="font-mono text-slate-600 dark:text-slate-300">{result.verification_id}</span>
              </div>
            </div>

            {result.warning && (
              <div className="mt-3 p-3 bg-rose-100 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200 rounded-lg text-xs flex items-start gap-2 border border-rose-200 dark:border-rose-800">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{result.warning}</span>
              </div>
            )}

            {result.is_safe_to_pay && onProceedWithPayment && (
              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-navy-800 flex justify-end">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onProceedWithPayment(result)}
                  className="gap-2 font-bold text-xs"
                >
                  Proceed to Send Payment <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};
