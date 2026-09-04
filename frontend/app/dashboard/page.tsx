'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Building,
  CreditCard,
  ListTodo,
  Receipt,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Plus,
  Play,
  Users,
  Eye,
  EyeOff,
  Zap,
  Smartphone,
  Building2,
  Lock,
  Search,
  Check,
} from 'lucide-react';
import { DashboardLayoutWrapper } from '@/components/layout/DashboardLayoutWrapper';
import { PageShell } from '@/components/layout/PageShell';
import { MetricCards } from '@/components/dashboard/MetricCards';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageLoadingSkeleton } from '@/components/ui/LoadingState';
import { BusinessVerificationBadge } from '@/components/verification/BusinessVerificationBadge';
import { DisbursementWizard } from '@/components/payments/DisbursementWizard';
import { PreFlightCheckModal } from '@/components/verification/PreFlightCheckModal';
import { CreatePaymentLinkModal } from '@/components/receive/CreatePaymentLinkModal';
import { TransactionDetailModal } from '@/components/transactions/TransactionDetailModal';
import { usePrivacy, PrivacyToggle } from '@/components/privacy/PrivacyContext';
import { api } from '@/services/api';
import {
  AnalyticsOverview,
  Transaction,
  Recipient,
  Payment,
  PaymentLink,
  PaymentList,
  VerificationResult,
} from '@/types';
import { formatCurrency, formatDate } from '@/lib/formatters';

export default function DashboardPage() {
  const router = useRouter();
  const { isBlinded, togglePrivacy, formatAmount } = usePrivacy();

  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [paymentLists, setPaymentLists] = useState<PaymentList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modals state
  const [isSendOpen, setIsSendOpen] = useState(false);
  const [isReceiveOpen, setIsReceiveOpen] = useState(false);
  const [isVerifyOpen, setIsVerifyOpen] = useState(false);
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);
  const [sendInitialData, setSendInitialData] = useState<{
    account_identifier?: string;
    recipient_name?: string;
    amount?: number;
    channel?: string;
  }>({});

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [ov, txs, recs, lists] = await Promise.all([
        api.getAnalytics(),
        api.getTransactions(),
        api.getRecipients(),
        api.getPaymentLists(),
      ]);
      setOverview(ov);
      setTransactions(txs);
      setRecipients(recs);
      setPaymentLists(lists);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to connect to Mobira backend services.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handlePreflightProceed = (verif: VerificationResult) => {
    setIsVerifyOpen(false);
    setSendInitialData({
      account_identifier: verif.target_identifier,
      recipient_name: verif.registered_name,
      channel: verif.carrier_or_bank.includes('Orange') ? 'ORANGE_MONEY' : 'MTN_MOMO',
    });
    setIsSendOpen(true);
  };

  return (
    <DashboardLayoutWrapper>
      <PageShell
        title="Executive Dashboard"
        subtitle="Single pane of glass for corporate disbursements, receivables, identity trust, and treasury."
        badge={<BusinessVerificationBadge size="md" />}
        action={
          <div className="flex items-center gap-3">
            <PrivacyToggle size="md" />
            <QuickActions
              onOpenSendModal={() => {
                setSendInitialData({});
                setIsSendOpen(true);
              }}
              onOpenReceiveModal={() => setIsReceiveOpen(true)}
              onOpenVerifyModal={() => setIsVerifyOpen(true)}
              onOpenCreateListModal={() => router.push('/payment-lists')}
            />
          </div>
        }
      >
        {loading ? (
          <PageLoadingSkeleton label="Loading dashboard metrics and ledger data..." />
        ) : error ? (
          <ErrorState
            title="Something went wrong."
            message={error}
            onRetry={loadData}
          />
        ) : (
          <div className="space-y-6">
            {/* ======================================================================= */}
            {/* 1. TOP CARDS: Inflow, Outflow, Ledger, Verified Beneficiaries           */}
            {/* ======================================================================= */}
            <MetricCards
              moneyReceived={185400}
              moneySent={142700}
              transactionCount={transactions.length > 0 ? transactions.length : 36}
              verifiedRecipientsRatio="80/80"
              currency="GH₵"
            />

            {/* ======================================================================= */}
            {/* 2. MAIN 2-COLUMN BALANCED WORKSPACE (Tamagui Glass Aesthetics)          */}
            {/* ======================================================================= */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* LEFT COLUMN (5 Cols): Treasury Rails & Reusable Payment Lists */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* 2A. Connected Payment Rails Card */}
                <div className="p-5 rounded-2xl bg-[#08162B]/90 backdrop-blur-xl border border-emerald-500/20 shadow-xl shadow-black/20 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-navy-800">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                        <Zap className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-sm text-white">
                          Connected Treasury Rails
                        </h3>
                        <p className="text-[11px] text-slate-400">
                          Active enterprise adapters
                        </p>
                      </div>
                    </div>
                    <Link
                      href="/connected-accounts"
                      className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 group"
                    >
                      <span>Manage</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>

                  <div className="space-y-2.5">
                    {/* Rail 1: MTN MoMo */}
                    <div className="p-3.5 rounded-xl bg-navy-950/80 border border-emerald-500/20 hover:border-emerald-500/40 transition-all flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-500 text-navy-950 font-black flex items-center justify-center text-xs shadow-sm shadow-emerald-500/20">
                          <Smartphone className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs text-white">MTN MoMo Business</span>
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                              PRIMARY
                            </span>
                          </div>
                          <div className="text-[11px] font-mono text-slate-400">
                            •••• 4821 • Limit: {formatAmount(5000000)}
                          </div>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Active
                      </span>
                    </div>

                    {/* Rail 2: Bank Transfer */}
                    <div className="p-3.5 rounded-xl bg-navy-950/80 border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-navy-850 text-slate-200 font-black flex items-center justify-center text-xs border border-navy-700">
                          <Building2 className="w-5 h-5 text-sky-400" />
                        </div>
                        <div>
                          <span className="font-bold text-xs text-white block">GCB Corporate Bank</span>
                          <div className="text-[11px] font-mono text-slate-400">
                            •••• 9184 • Limit: {formatAmount(10000000)}
                          </div>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Active
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-navy-850">
                    <span className="flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-emerald-400" />
                      Zero credentials stored
                    </span>
                    <span className="font-mono text-emerald-400 font-bold">Simulated Multi-Rail</span>
                  </div>
                </div>

                {/* 2B. Reusable Payment Lists Card */}
                <div className="p-5 rounded-2xl bg-[#08162B]/90 backdrop-blur-xl border border-slate-800 shadow-xl shadow-black/20 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-navy-800">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                        <ListTodo className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-sm text-white">
                          Batch Payment Lists
                        </h3>
                        <p className="text-[11px] text-slate-400">
                          Pre-flight cleared payroll & vendor lists
                        </p>
                      </div>
                    </div>
                    <Link
                      href="/payment-lists"
                      className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 group"
                    >
                      <span>All Lists ({paymentLists.length})</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>

                  <div className="space-y-2.5">
                    {paymentLists.slice(0, 3).map((list) => (
                      <div
                        key={list.id}
                        className="p-3.5 rounded-xl bg-navy-950/80 border border-slate-800 hover:border-emerald-500/30 transition-all flex items-center justify-between gap-3"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <strong className="text-xs font-bold text-white truncate block">
                              {list.name}
                            </strong>
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-navy-850 text-slate-300 border border-navy-750">
                              {list.recipient_count} payees
                            </span>
                          </div>
                          <div className="text-xs font-mono font-bold text-emerald-400 mt-1">
                            {formatAmount(list.total_amount, list.currency || 'GH₵')}
                          </div>
                        </div>

                        <Link href="/payment-lists">
                          <Button
                            variant="secondary"
                            size="sm"
                            className="text-[11px] font-bold py-1 px-3 bg-navy-850 hover:bg-emerald-500 hover:text-navy-950 transition-all border border-navy-700"
                          >
                            Open List
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN (7 Cols): Real-Time Verified Transaction Ledger */}
              <div className="lg:col-span-7 space-y-6">
                <div className="p-5 rounded-2xl bg-[#08162B]/90 backdrop-blur-xl border border-slate-800 shadow-xl shadow-black/20 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-navy-800">
                    <div>
                      <h3 className="font-extrabold text-sm text-white">
                        Recent Verified Ledger Activity
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Multi-rail disbursements and collections with pre-flight clearance
                      </p>
                    </div>
                    <Link
                      href="/transactions"
                      className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 group"
                    >
                      <span>View Full Ledger</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>

                  {/* Transaction Feed */}
                  <div className="divide-y divide-navy-800/80">
                    {transactions.slice(0, 6).map((tx) => {
                      const isDisbursement = tx.direction === 'DISBURSEMENT';
                      const isSuccess = tx.status === 'SUCCESS';
                      const isPending = tx.status === 'PENDING';

                      return (
                        <div
                          key={tx.id}
                          onClick={() => setSelectedTxn(tx)}
                          className="py-3.5 flex items-center justify-between gap-3 hover:bg-navy-950/60 p-2 rounded-xl transition-colors cursor-pointer group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-black text-xs ${
                                isDisbursement
                                  ? 'bg-navy-850 text-slate-300 border border-navy-750'
                                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              }`}
                            >
                              {isDisbursement ? (
                                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                              ) : (
                                <ArrowDownLeft className="w-4 h-4 stroke-[2.5]" />
                              )}
                            </div>

                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-white truncate block">
                                  {tx.counterparty_name || 'Commercial Transfer'}
                                </span>
                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[9px] font-black bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                  <Check className="w-2.5 h-2.5 stroke-[3]" /> Verified
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5 font-mono">
                                <span>{tx.channel}</span>
                                <span>•</span>
                                <span>{formatDate(tx.created_at)}</span>
                              </div>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <div
                              className={`text-xs font-mono font-black ${
                                isDisbursement ? 'text-white' : 'text-emerald-400'
                              }`}
                            >
                              {isDisbursement ? '-' : '+'}
                              {formatAmount(tx.amount, tx.currency || 'GH₵')}
                            </div>
                            <span
                              className={`inline-block text-[10px] font-bold uppercase tracking-wider mt-0.5 ${
                                isSuccess
                                  ? 'text-emerald-400'
                                  : isPending
                                  ? 'text-yellow-400'
                                  : 'text-rose-400'
                              }`}
                            >
                              {tx.status}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-2 border-t border-navy-850 flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-mono">
                      Showing {Math.min(transactions.length, 6)} of {transactions.length} ledger entries
                    </span>
                    <Link href="/transactions">
                      <Button variant="outline" size="sm" className="text-xs font-bold gap-1 border-navy-700 text-slate-300 hover:text-white">
                        <Receipt className="w-3.5 h-3.5 text-emerald-400" /> Export CSV / Audit
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Global Modals */}
        <DisbursementWizard
          isOpen={isSendOpen}
          onClose={() => setIsSendOpen(false)}
          recipients={recipients}
          initialData={sendInitialData}
          onPaymentSuccess={() => {
            loadData();
            setIsSendOpen(false);
          }}
        />

        <CreatePaymentLinkModal
          isOpen={isReceiveOpen}
          onClose={() => setIsReceiveOpen(false)}
          onCreated={() => {
            loadData();
          }}
        />

        <PreFlightCheckModal
          isOpen={isVerifyOpen}
          onClose={() => setIsVerifyOpen(false)}
          onProceedWithPayment={handlePreflightProceed}
        />

        <TransactionDetailModal
          isOpen={!!selectedTxn}
          onClose={() => setSelectedTxn(null)}
          transaction={selectedTxn}
        />
      </PageShell>
    </DashboardLayoutWrapper>
  );
}
