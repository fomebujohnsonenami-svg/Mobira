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
  RotateCcw,
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
        badge={
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-black text-white shadow-sm"
            style={{ backgroundColor: '#2563EB' }}
          >
            <Check className="w-3 h-3 stroke-[3.5]" />
            <span>Verified Business</span>
          </span>
        }
        action={
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full lg:w-auto">
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
          <div className="space-y-6 w-full min-w-0">
            {/* ======================================================================= */}
            {/* 1. TOP METRIC CARDS                                                     */}
            {/* ======================================================================= */}
            <MetricCards
              moneyReceived={185400}
              moneySent={142700}
              transactionCount={transactions.length > 0 ? transactions.length : 36}
              verifiedRecipientsRatio="80/80"
              currency="GH₵"
            />

            {/* ======================================================================= */}
            {/* 2. MAIN 2-COLUMN BALANCED WORKSPACE (Charcoal & Lime Aesthetics)         */}
            {/* ======================================================================= */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full min-w-0">
              
              {/* LEFT COLUMN (5 Cols): Treasury Rails & Reusable Payment Lists */}
              <div className="lg:col-span-5 space-y-6 min-w-0">
                
                {/* 2A. Connected Payment Rails Card */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#18222D] border border-slate-800 shadow-xl space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-[#A3E635]/15 text-[#A3E635] flex items-center justify-center font-bold">
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
                      className="text-xs font-bold text-[#A3E635] hover:underline flex items-center gap-1 group"
                    >
                      <span>Manage</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>

                  <div className="space-y-2.5">
                    {/* Rail 1: MTN MoMo */}
                    <div className="p-3.5 rounded-xl bg-[#131B24] border border-slate-800 hover:border-[#A3E635]/40 transition-all flex items-center justify-between gap-2">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-[#A3E635] text-[#0F172A] font-black flex items-center justify-center text-xs shrink-0 shadow-sm shadow-[#A3E635]/20">
                          <Smartphone className="w-5 h-5" />
                        </div>
                        <div className="min-w-0 truncate">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-xs text-white">
                              MTN MoMo Business
                            </span>
                            <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-[#A3E635]/15 text-[#A3E635] border border-[#A3E635]/30">
                              PRIMARY
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">
                            •••• 4821 • Daily Limit: {formatAmount(5000000, 'GH₵')}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#A3E635]/15 text-[#A3E635] shrink-0">
                        Active
                      </span>
                    </div>

                    {/* Rail 2: GCB Interbank */}
                    <div className="p-3.5 rounded-xl bg-[#131B24] border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between gap-2">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-[#1E293B] text-slate-300 font-black flex items-center justify-center text-xs shrink-0 border border-slate-700">
                          <Building className="w-5 h-5" />
                        </div>
                        <div className="min-w-0 truncate">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-xs text-white">
                              GCB Business Treasury
                            </span>
                            <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                              SECONDARY
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">
                            •••• 9184 • Daily Limit: {formatAmount(10000000, 'GH₵')}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 shrink-0">
                        Standby
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2B. Reusable Payment Lists Card */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#18222D] border border-slate-800 shadow-xl space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center font-bold">
                        <ListTodo className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-sm text-white">
                          Reusable Payment Lists
                        </h3>
                        <p className="text-[11px] text-slate-400">
                          3 persistent bulk batches
                        </p>
                      </div>
                    </div>
                    <Link
                      href="/payment-lists"
                      className="text-xs font-bold text-[#A3E635] hover:underline flex items-center gap-1 group"
                    >
                      <span>All Lists</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>

                  <div className="space-y-2.5">
                    {/* List 1: September Employees */}
                    <div className="p-3.5 rounded-xl bg-[#131B24] border border-slate-800 hover:border-[#A3E635]/40 transition-all flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-xs text-white">
                            September Employee Payments
                          </span>
                          <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-blue-500/15 text-[#38BDF8] border border-blue-500/30">
                            48 Staff
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">
                          Volume:{' '}
                          <span className="font-bold text-white font-mono">
                            {formatAmount(142000, 'GH₵')}
                          </span>
                        </p>
                      </div>
                      <Link
                        href="/payment-lists"
                        className="px-2.5 py-1.5 rounded-xl bg-[#A3E635] hover:bg-[#84CC16] text-[#0F172A] font-black text-xs uppercase tracking-wider transition-all shrink-0 active:scale-95 shadow-sm"
                      >
                        Disburse
                      </Link>
                    </div>

                    {/* List 2: Monthly Suppliers */}
                    <div className="p-3.5 rounded-xl bg-[#131B24] border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-xs text-white">
                            Monthly Suppliers Batch
                          </span>
                          <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30">
                            20 Vendors
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">
                          Volume:{' '}
                          <span className="font-bold text-white font-mono">
                            {formatAmount(32500, 'GH₵')}
                          </span>
                        </p>
                      </div>
                      <Link
                        href="/payment-lists"
                        className="px-2.5 py-1.5 rounded-xl bg-[#1E293B] hover:bg-[#283548] border border-slate-700 text-white font-bold text-xs uppercase tracking-wider transition-all shrink-0 active:scale-95 shadow-sm"
                      >
                        Review
                      </Link>
                    </div>
                  </div>
                </div>

              </div>

              {/* RIGHT COLUMN (7 Cols): Real-Time Verified Ledger Feed */}
              <div className="lg:col-span-7 space-y-6 min-w-0">
                <div className="p-4 sm:p-5 rounded-2xl bg-[#18222D] border border-slate-800 shadow-xl space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-[#A3E635]/15 text-[#A3E635] flex items-center justify-center font-bold">
                        <Receipt className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-sm text-white">
                          Verified Real-Time Ledger Feed
                        </h3>
                        <p className="text-[11px] text-slate-400">
                          Live settlements across MTN MoMo and Bank EFT
                        </p>
                      </div>
                    </div>
                    <Link
                      href="/transactions"
                      className="text-xs font-bold text-[#A3E635] hover:underline flex items-center gap-1 group"
                    >
                      <span>Full Ledger</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>

                  <div className="divide-y divide-slate-800/80">
                    {transactions.slice(0, 6).map((tx) => {
                      const isDisb = tx.direction === 'DISBURSEMENT';

                      return (
                        <div
                          key={tx.id}
                          onClick={() => setSelectedTxn(tx)}
                          className="py-3 px-2 flex items-center justify-between hover:bg-[#1E293B]/60 rounded-xl transition-colors cursor-pointer gap-3"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                                isDisb
                                  ? 'bg-[#131B24] text-slate-300 border border-slate-800'
                                  : 'bg-[#A3E635]/15 text-[#A3E635] border border-[#A3E635]/30'
                              }`}
                            >
                              {isDisb ? (
                                <ArrowUpRight className="w-4 h-4" />
                              ) : (
                                <ArrowDownLeft className="w-4 h-4" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs sm:text-sm font-bold text-white truncate">
                                {tx.counterparty_name}
                              </p>
                              <p className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5 truncate">
                                <span className="font-mono">{tx.reference}</span>
                                <span>•</span>
                                <span>{formatDate(tx.created_at)}</span>
                              </p>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <p
                              className={`text-xs sm:text-sm font-black tabular-nums ${
                                isDisb ? 'text-white' : 'text-[#A3E635]'
                              }`}
                            >
                              {isDisb ? '-' : '+'}
                              {formatAmount(tx.amount, tx.currency || 'GH₵')}
                            </p>
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[9px] font-black bg-[#A3E635]/15 text-[#A3E635] mt-0.5">
                              ✓ Cleared
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Disbursement Wizard Modal */}
        <DisbursementWizard
          isOpen={isSendOpen}
          onClose={() => setIsSendOpen(false)}
          recipients={recipients}
          initialData={sendInitialData}
          onPaymentSuccess={() => {
            setIsSendOpen(false);
            loadData();
          }}
        />

        {/* Pre-Flight Check Modal */}
        <PreFlightCheckModal
          isOpen={isVerifyOpen}
          onClose={() => setIsVerifyOpen(false)}
          onProceedWithPayment={handlePreflightProceed}
        />

        {/* Payment Link Modal */}
        <CreatePaymentLinkModal
          isOpen={isReceiveOpen}
          onClose={() => setIsReceiveOpen(false)}
          onCreated={() => {
            setIsReceiveOpen(false);
            loadData();
          }}
        />

        {/* Transaction Detail Modal */}
        <TransactionDetailModal
          isOpen={!!selectedTxn}
          onClose={() => setSelectedTxn(null)}
          transaction={selectedTxn}
        />
      </PageShell>
    </DashboardLayoutWrapper>
  );
}
