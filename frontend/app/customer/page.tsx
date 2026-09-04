'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ShieldCheck, Award, Smartphone, CheckCircle2, Lock, ArrowRight, Zap, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { BusinessVerificationBadge } from '@/components/verification/BusinessVerificationBadge';
import { CardSkeleton, LoadingSpinner } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { api } from '@/services/api';
import { PaymentLink } from '@/types';
import { formatCurrency } from '@/lib/formatters';

export default function CustomerCheckoutDemoPage() {
  const [links, setLinks] = useState<PaymentLink[]>([]);
  const [selectedLink, setSelectedLink] = useState<PaymentLink | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Checkout inputs
  const [payerName, setPayerName] = useState('Efua Sutherland');
  const [payerPhone, setPayerPhone] = useState('024 112 3344');
  const [channel, setChannel] = useState('MTN_MOMO');
  const [customAmount, setCustomAmount] = useState<number>(350);

  // USSD Simulation Modal State
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const [pin, setPin] = useState('1234');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [receiptRef, setReceiptRef] = useState('');

  const fetchLinks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getPaymentLinks();
      setLinks(data);
      if (data.length > 0) setSelectedLink(data[0]);
    } catch (err: any) {
      setError(err?.message || 'Failed to load checkout details.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  const activeAmount = selectedLink?.amount || customAmount;

  const handleTriggerPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPromptOpen(true);
  };

  const handleConfirmUSSD = async () => {
    setIsProcessing(true);
    try {
      const slug = selectedLink?.slug || 'demo-checkout';
      const res = await api.customerPay(slug, {
        payer_name: payerName,
        payer_phone: payerPhone,
        channel,
        amount: activeAmount,
      });

      setTimeout(() => {
        setIsProcessing(false);
        setIsPromptOpen(false);
        setIsPaid(true);
        setReceiptRef(res.collection?.reference_id || `MOB-COLL-${Date.now().toString().slice(-6)}`);
      }, 700);
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="max-w-md w-full space-y-5">
        {/* Mobira Top Trust Header */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-navy-900 border border-yellow-500/40 text-yellow-400 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5" /> MOBIRA SECURE CHECKOUT
          </div>
          <p className="text-xs text-slate-400">
            Protected by Pre-Flight Verified Identity Rails
          </p>
        </div>

        {loading ? (
          <Card className="p-6 bg-navy-900 border-navy-800 text-slate-100 shadow-modal">
            <CardSkeleton count={3} />
          </Card>
        ) : error ? (
          <Card className="p-6 bg-navy-900 border-navy-800 text-slate-100 shadow-modal">
            <ErrorState message={error} onRetry={fetchLinks} />
          </Card>
        ) : !selectedLink ? (
          <Card className="p-6 bg-navy-900 border-navy-800 text-slate-100 shadow-modal">
            <EmptyState
              title="No payment links found"
              description="This merchant has not published any active payment links yet."
              actionLabel="Return Home"
              onAction={() => window.location.href = '/'}
            />
          </Card>
        ) : (
          /* Invoice / Checkout Card */
          <Card className="p-6 bg-navy-900 border-navy-800 text-slate-100 shadow-modal relative">
            {/* Verified Merchant Badge */}
            <div className="p-3.5 rounded-xl bg-navy-950 border border-slate-800 flex items-center justify-between gap-3 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-yellow-500 text-navy-950 font-black flex items-center justify-center text-sm">
                  {(selectedLink?.business_name || 'ABC').slice(0, 2).toUpperCase()}
                </div>
                <BusinessVerificationBadge businessName={selectedLink?.business_name || 'ABC Technologies Ltd'} size="md" />
              </div>
              <span className="text-[11px] font-mono text-yellow-400 font-bold">
                {selectedLink?.business_trust_score || 96}/100 Trust
              </span>
            </div>

            {!isPaid ? (
            <form onSubmit={handleTriggerPayment} className="space-y-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400">Bill Item</span>
                <h4 className="font-bold text-base text-white mt-0.5">
                  {selectedLink?.title || 'Invoice Payment'}
                </h4>
                {selectedLink?.description && (
                  <p className="text-xs text-slate-400 mt-0.5">{selectedLink.description}</p>
                )}
              </div>

              {/* Amount Display */}
              <div className="p-4 rounded-xl bg-navy-950 border border-navy-800 text-center">
                <span className="text-xs text-slate-400 uppercase font-bold">Total Due</span>
                <p className="text-3xl font-black text-yellow-400 mt-1 tabular-nums">
                  {formatCurrency(activeAmount, selectedLink?.currency || 'GH₵')}
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <Input
                  label="Your Full Name or Company"
                  value={payerName}
                  onChange={(e) => setPayerName(e.target.value)}
                  required
                />

                <Select
                  label="Payment Rail"
                  value={channel}
                  onChange={(e) => setChannel(e.target.value)}
                  options={[
                    { value: 'MTN_MOMO', label: 'MTN Mobile Money' },
                    { value: 'ORANGE_MONEY', label: 'Orange Money' },
                    { value: 'BANK_TRANSFER', label: 'Direct Bank Transfer' },
                  ]}
                />

                <Input
                  label="Your Mobile Money Phone Number"
                  value={payerPhone}
                  onChange={(e) => setPayerPhone(e.target.value)}
                  placeholder="024 112 3344"
                  required
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full gap-2 font-black py-3.5 text-sm mt-2 uppercase tracking-wider bg-yellow-500 hover:bg-yellow-400 text-navy-950 shadow-elevated"
              >
                [ PAY NOW ]
              </Button>
            </form>
          ) : (
            /* Successful Payment Confirmation */
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-yellow-500/20 text-yellow-400 flex items-center justify-center mx-auto border border-yellow-500/40 shadow-modal">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-white">Payment Received!</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Thank you! Your transaction has cleared on the telecom network.
                </p>
              </div>

              <div className="p-4 bg-navy-950 rounded-xl border border-navy-800 text-xs space-y-2 text-left">
                <div className="flex justify-between">
                  <span className="text-slate-400">Reference:</span>
                  <span className="font-mono font-bold text-white">{receiptRef}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Amount Paid:</span>
                  <span className="font-bold text-yellow-400 tabular-nums">{formatCurrency(activeAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Merchant:</span>
                  <span className="font-bold text-white">Douala Agro-Tech SARL</span>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsPaid(false)}
                  className="border-navy-800 text-slate-300 bg-navy-950 hover:bg-navy-900"
                >
                  Make Another Test Payment
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}

        {/* Back to Merchant Dashboard link */}
        <div className="text-center">
          <Link
            href="/dashboard"
            className="text-xs text-slate-400 hover:text-yellow-400 transition-colors flex items-center justify-center gap-1"
          >
            &larr; Return to Mobira Enterprise Dashboard
          </Link>
        </div>
      </div>

      {/* Realistic Phone USSD STK Push Prompt Simulation */}
      {isPromptOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-xs bg-navy-900 border-2 border-navy-700 rounded-3xl p-6 shadow-modal space-y-4 text-center text-white">
            <div className="w-10 h-10 rounded-full bg-yellow-500/20 text-yellow-400 flex items-center justify-center mx-auto">
              <Smartphone className="w-5 h-5" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-yellow-400">
                SIMULATED USSD STK PUSH
              </span>
              <h4 className="font-bold text-sm">
                {channel === 'ORANGE_MONEY' ? 'Orange Money Prompt' : 'MTN Mobile Money Prompt'}
              </h4>
              <p className="text-xs text-slate-300">
                Approve payment of <strong className="text-yellow-400">{formatCurrency(activeAmount)}</strong> to{' '}
                <strong>DOUALA AGRO-TECH SARL</strong>?
              </p>
            </div>

            <div className="p-3 bg-navy-950 rounded-xl border border-navy-800 space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-slate-400 block">
                Enter 4-Digit MoMo PIN:
              </label>
              <input
                type="password"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full text-center tracking-widest text-lg font-mono py-1 bg-transparent border-b border-navy-700 focus:outline-none focus:border-yellow-400"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPromptOpen(false)}
                className="w-1/2 border-navy-800 text-slate-300 text-xs bg-navy-950"
              >
                Reject
              </Button>
              <Button
                variant="primary"
                size="sm"
                isLoading={isProcessing}
                onClick={handleConfirmUSSD}
                className="w-1/2 text-xs font-bold"
              >
                Confirm PIN
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
