'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayoutWrapper } from '@/components/layout/DashboardLayoutWrapper';
import { PageShell } from '@/components/layout/PageShell';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ShieldCheck, CheckCircle2, XCircle, AlertTriangle, Search, ArrowRight, RotateCcw } from 'lucide-react';
import { api } from '@/services/api';
import { VerificationResult, Recipient } from '@/types';
import { DisbursementWizard } from '@/components/payments/DisbursementWizard';
import { useBusiness } from '@/components/layout/BusinessContext';
import { BusinessVerificationBadge } from '@/components/verification/BusinessVerificationBadge';
import { RecipientBusinessVerificationDemo } from '@/components/verification/RecipientBusinessVerificationDemo';

export default function VerifyPage() {
  const { currentBusiness, verificationStatus, startVerification, resetVerification } = useBusiness();
  const [channel, setChannel] = useState('MTN_MOMO');
  const [account, setAccount] = useState('+237670000111');
  const [expectedName, setExpectedName] = useState('Douala Organic Supplies');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [isSendOpen, setIsSendOpen] = useState(false);
  const [sendInitialData, setSendInitialData] = useState<any>({});

  useEffect(() => {
    api.getRecipients().then(setRecipients);
  }, []);

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

  const handleProceedToPayment = () => {
    if (!result) return;
    setSendInitialData({
      account_identifier: result.target_identifier,
      recipient_name: result.registered_name,
      channel: result.carrier_or_bank.includes('Orange') ? 'ORANGE_MONEY' : 'MTN_MOMO',
    });
    setIsSendOpen(true);
  };

  return (
    <DashboardLayoutWrapper>
      <PageShell
        title="Anti-Fraud & Identity Verification (VERIFY)"
        subtitle="Eliminate ghost vendors and wrong-number losses through pre-flight subscriber name enquiries."
        badge={<BusinessVerificationBadge size="md" />}
      >
        {/* Dedicated Corporate Entity Verification Banner & Demonstration */}
        <Card className="p-5 bg-white dark:bg-navy-900 border-2 border-blue-500/30 dark:border-blue-500/40 shadow-subtle mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 block">
                Primary Business Verification
              </span>
              <div className="flex items-center gap-3">
                <BusinessVerificationBadge size="lg" />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl pt-0.5">
                Official business entity verification is secured by entering your registered Business Identification Number (Demo BIN: 700235).
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              {verificationStatus !== 'VERIFIED' ? (
                <Button
                  type="button"
                  variant="primary"
                  onClick={startVerification}
                  className="gap-2 font-bold text-xs py-2 px-4 shadow-elevated"
                >
                  <ShieldCheck className="w-4 h-4" /> Verify Business Identity
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={startVerification}
                    className="text-xs font-bold border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400"
                  >
                    Re-Open Success Modal
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetVerification}
                    className="gap-1 text-xs font-semibold text-slate-400 hover:text-navy-950"
                  >
                    <RotateCcw className="w-3 h-3" /> Reset (Test Before)
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Interactive Judge & Evaluator Verification Suite */}
        <RecipientBusinessVerificationDemo className="mb-6" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Verification Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-navy-800 mb-5">
                <div className="w-9 h-9 rounded-lg bg-yellow-100 dark:bg-yellow-950/60 text-yellow-600 dark:text-yellow-400 flex items-center justify-center border border-yellow-300 dark:border-yellow-700/60">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-navy-950 dark:text-slate-100">
                    Live Pre-Flight Subscriber Check
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Query telecommunications KYC records or bank clearing registries
                  </p>
                </div>
              </div>

              {/* Demo test cases */}
              <div className="mb-6 p-3.5 bg-slate-50 dark:bg-navy-950 rounded-xl border border-slate-200 dark:border-navy-800">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  1-Click Demonstration Scenarios:
                </p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setAccount('+237670000111');
                      setExpectedName('Douala Organic Supplies');
                      setChannel('MTN_MOMO');
                      setResult(null);
                    }}
                    className="px-2.5 py-1 rounded bg-yellow-100 dark:bg-yellow-950/60 text-yellow-900 dark:text-yellow-300 font-bold border border-yellow-300 dark:border-yellow-700/60 hover:bg-yellow-200 text-xs"
                  >
                    Scenario A: Match Confirmed (Douala Organic)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAccount('+237670000111');
                      setExpectedName('Ghost Logistics Contractor Ltd');
                      setChannel('MTN_MOMO');
                      setResult(null);
                    }}
                    className="px-2.5 py-1 rounded bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 font-bold border border-rose-300 dark:border-rose-800/80 hover:bg-rose-200 text-xs"
                  >
                    Scenario B: Severe Name Mismatch / Warning
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAccount('RC/DLA/2020/B/4521');
                      setExpectedName('Douala Agro-Tech SARL');
                      setChannel('BUSINESS_RCCM');
                      setResult(null);
                    }}
                    className="px-2.5 py-1 rounded bg-navy-100 dark:bg-navy-800 text-navy-950 dark:text-slate-200 font-bold border border-navy-200 dark:border-navy-700 hover:bg-navy-200 text-xs"
                  >
                    Scenario C: National Registry RCCM
                  </button>
                </div>
              </div>

              <form onSubmit={handleVerify} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="Verification Rail"
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
                    label="Account Identifier / MSISDN / RCCM"
                    value={account}
                    onChange={(e) => setAccount(e.target.value)}
                    placeholder="+237 670 000 111"
                    required
                  />
                </div>

                <Input
                  label="Expected Business / Beneficiary Legal Name"
                  value={expectedName}
                  onChange={(e) => setExpectedName(e.target.value)}
                  placeholder="e.g. Douala Organic Supplies SARL"
                  helperText="Mobira performs Levenshtein sequence matching against registered KYC name."
                />

                <Button type="submit" variant="primary" isLoading={loading} className="w-full gap-2 font-bold text-xs py-2.5">
                  <Search className="w-4 h-4" /> Run Pre-Flight Verification
                </Button>
              </form>

              {/* Result Preview */}
              {result && (
                <div
                  className={`mt-6 p-5 rounded-xl border transition-all ${
                    result.is_safe_to_pay
                      ? 'bg-yellow-50/40 dark:bg-navy-950 border-yellow-300 dark:border-yellow-700/60'
                      : 'bg-rose-50/50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {result.is_safe_to_pay ? (
                        <CheckCircle2 className="w-7 h-7 text-yellow-600 dark:text-yellow-400 shrink-0" />
                      ) : (
                        <XCircle className="w-7 h-7 text-rose-600 shrink-0" />
                      )}
                      <div>
                        <h4 className="font-extrabold text-base text-navy-950 dark:text-slate-100">
                          {result.is_safe_to_pay ? 'Subscriber Match Confirmed' : 'Identity Mismatch Detected!'}
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

                  <div className="mt-4 pt-3 border-t border-slate-200 dark:border-navy-800 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Registered Name:</span>
                      <span className="font-bold text-navy-950 dark:text-white">{result.registered_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Expected Invoice Name:</span>
                      <span className="font-medium text-slate-800 dark:text-slate-200">{result.expected_name || '—'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Verification Token:</span>
                      <span className="font-mono text-slate-600 dark:text-slate-300">{result.verification_id}</span>
                    </div>
                  </div>

                  {result.warning && (
                    <div className="mt-4 p-3 bg-rose-100 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200 rounded-lg text-xs flex items-start gap-2 border border-rose-200 dark:border-rose-800">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <span>{result.warning}</span>
                    </div>
                  )}

                  {result.is_safe_to_pay && (
                    <div className="mt-4 pt-3 border-t border-yellow-200 dark:border-navy-800 flex justify-end">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={handleProceedToPayment}
                        className="gap-2 font-bold text-xs"
                      >
                        Send Payout to Verified Recipient <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </Card>
          </div>

          {/* Value Prop Side Panel in Deep Blue */}
          <div className="space-y-6">
            <Card className="p-5 bg-navy-900 text-white border-navy-800">
              <h4 className="font-extrabold text-sm uppercase tracking-wide text-yellow-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-yellow-400" /> Why Pre-Flight Matters
              </h4>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                In sub-Saharan Africa, over <strong>30% of business payments</strong> suffer from invoice interception fraud or clerical typos in phone numbers.
              </p>
              <div className="mt-4 pt-3 border-t border-navy-800 space-y-2 text-xs text-slate-300">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                  <span>Proves wallet ownership before executing the transfer.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                  <span>Guarantees zero payment misdirection losses.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                  <span>Feeds directly into your business Trust Score.</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <DisbursementWizard
          isOpen={isSendOpen}
          onClose={() => setIsSendOpen(false)}
          recipients={recipients}
          onPaymentSuccess={() => {}}
          initialData={sendInitialData}
        />
      </PageShell>
    </DashboardLayoutWrapper>
  );
}
