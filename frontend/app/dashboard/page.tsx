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
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [paymentLists, setPaymentLists] = useState<PaymentList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modals state
  const [isSendOpen, setIsSendOpen] = useState(false);
  const [isVerifyOpen, setIsVerifyOpen] = useState(false);
  const [isReceiveOpen, setIsReceiveOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  // Pre-filled data
  const [sendInitialData, setSendInitialData] = useState<{
    account_identifier?: string;
    recipient_name?: string;
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
          <QuickActions
            onOpenSendModal={() => {
              setSendInitialData({});
              setIsSendOpen(true);
            }}
            onOpenReceiveModal={() => setIsReceiveOpen(true)}
            onOpenVerifyModal={() => setIsVerifyOpen(true)}
            onOpenCreateListModal={() => router.push('/payment-lists')}
          />
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
            {/* TOP CARDS: Money Received, Money Sent, Transactions, Verified Recipients*/}
            {/* ======================================================================= */}
            <MetricCards
              moneyReceived={185400}
              moneySent={142700}
              transactionCount={transactions.length > 0 ? transactions.length : 227}
              verifiedRecipientsRatio="48/48"
              currency="GH₵"
            />

            {/* ======================================================================= */}
            {/* MIDDLE ROW: Verification Status & Connected Accounts                    */}
            {/* ======================================================================= */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Verification Status Card */}
              <Card className="p-6 border-2 border-slate-200 dark:border-navy-800 rounded-2xl shadow-subtle flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                      Verification Status
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-black border border-blue-200 dark:border-blue-800">
                      <span className="w-2 h-2 rounded-full bg-blue-600" />
                      🔵 VERIFIED BUSINESS
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-black text-navy-950 dark:text-white">
                          ABC Technologies Ltd
                        </h3>
                        <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-black flex items-center justify-center shadow-sm">
                          ✓
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Business ID: <strong className="font-mono text-navy-950 dark:text-slate-200">PP-ABC-001</strong> • Technology & Software • Accra, Ghana
                      </p>
                    </div>

                    <div className="sm:text-right shrink-0">
                      <span className="text-xs font-bold text-slate-400">Trust Score</span>
                      <p className="text-2xl font-black text-yellow-600 dark:text-yellow-400 font-mono">
                        96/100
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span className="text-slate-600 dark:text-slate-300">
                        National Registry RCCM & Tax Compliance verified
                      </span>
                    </div>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold shrink-0">Good Standing</span>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-navy-850 flex flex-wrap items-center justify-between gap-2">
                  <Link href="/verify" className="text-xs font-bold text-yellow-600 dark:text-yellow-400 hover:underline flex items-center gap-1">
                    Manage Corporate Verification <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link href="/business/PP-ABC-001" target="_blank" className="text-xs text-slate-400 hover:text-navy-950 dark:hover:text-white flex items-center gap-1">
                    View Public Profile <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </Card>

              {/* Connected Accounts Card */}
              <Card className="p-6 border-2 border-slate-200 dark:border-navy-800 rounded-2xl shadow-subtle flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                      Connected Payment Accounts
                    </span>
                    <Badge variant="amber" size="sm">Demo Simulated</Badge>
                  </div>

                  <div className="space-y-2.5">
                    {/* Account 1: MTN MoMo Business */}
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-yellow-500/10 text-yellow-600 flex items-center justify-center font-black text-xs">
                          MoMo
                        </div>
                        <div>
                          <strong className="text-sm font-bold text-navy-950 dark:text-white block">
                            MTN MoMo Business
                          </strong>
                          <span className="text-xs font-mono text-slate-500">•••• 4821</span>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Demo Connected
                      </span>
                    </div>

                    {/* Account 2: Business Bank Account */}
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-black text-xs">
                          Bank
                        </div>
                        <div>
                          <strong className="text-sm font-bold text-navy-950 dark:text-white block">
                            Business Bank Account
                          </strong>
                          <span className="text-xs font-mono text-slate-500">•••• 9184</span>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Demo Connected
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 dark:border-navy-850 flex items-center justify-between">
                  <Link href="/connected-accounts" className="text-xs font-bold text-yellow-600 dark:text-yellow-400 hover:underline flex items-center gap-1">
                    Manage Authorized Accounts & Adapters <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                  <span className="text-[11px] text-slate-400">Zero PINs/Secrets Stored</span>
                </div>
              </Card>
            </div>

            {/* ======================================================================= */}
            {/* PAYMENT LISTS & ANALYTICS PREVIEWS                                      */}
            {/* ======================================================================= */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Payment Lists Overview */}
              <Card className="p-6 border-2 border-slate-200 dark:border-navy-800 rounded-2xl shadow-subtle lg:col-span-2 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ListTodo className="w-4 h-4 text-yellow-500" />
                      <h3 className="font-extrabold text-base text-navy-950 dark:text-white">
                        Reusable Payment Lists
                      </h3>
                    </div>
                    <Link href="/payment-lists">
                      <Button variant="outline" size="sm" className="text-xs font-bold gap-1 border-slate-300 dark:border-navy-700">
                        View All Lists ({paymentLists.length})
                      </Button>
                    </Link>
                  </div>

                  {paymentLists.length === 0 ? (
                    <EmptyState
                      icon={ListTodo}
                      title="No payment lists found"
                      description="Create or import your first reusable payroll or supplier payment list."
                      actionLabel="Create Payment List"
                      onAction={() => router.push('/payment-lists')}
                      variant="plain"
                    />
                  ) : (
                    <div className="divide-y divide-slate-100 dark:divide-navy-800">
                      {paymentLists.slice(0, 3).map((list) => (
                        <div key={list.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <h4 className="font-bold text-sm text-navy-950 dark:text-white">
                              {list.name}
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                              {list.recipient_count} recipients • {list.category}
                            </p>
                          </div>

                          <div className="flex items-center gap-4 justify-between sm:justify-end">
                            <span className="text-base font-black text-yellow-600 dark:text-yellow-400 tabular-nums">
                              {formatCurrency(list.total_amount, list.currency)}
                            </span>
                            <Link href="/payment-lists">
                              <Button variant="primary" size="sm" className="text-xs font-black uppercase tracking-wider py-1 px-3 bg-yellow-500 hover:bg-yellow-400 text-navy-950">
                                Disburse
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-navy-850 flex items-center justify-between text-xs text-slate-400">
                  <span>Persisted list recipients can be updated month-over-month without re-uploading files.</span>
                  <Link href="/payment-lists" className="text-yellow-600 font-bold hover:underline shrink-0">
                    Open Lists
                  </Link>
                </div>
              </Card>

              {/* Analytics Quick Insight Card */}
              <Card className="p-6 border-2 border-slate-200 dark:border-navy-800 rounded-2xl shadow-subtle flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-emerald-500" />
                      <h3 className="font-extrabold text-base text-navy-950 dark:text-white">
                        Spending Analytics
                      </h3>
                    </div>
                    <Link href="/analytics">
                      <span className="text-xs font-bold text-yellow-600 hover:underline">Full Report</span>
                    </Link>
                  </div>

                  <div className="space-y-3 text-xs">
                    {/* Insight quote from specification */}
                    <div className="p-3.5 rounded-xl bg-yellow-50/70 dark:bg-navy-950 border border-yellow-200 dark:border-yellow-800/60">
                      <span className="text-[10px] uppercase font-bold text-yellow-700 dark:text-yellow-400 block tracking-wider">
                        September Insight
                      </span>
                      <p className="text-xs font-bold text-navy-950 dark:text-slate-100 mt-1">
                        "Payroll represents 68.8% of your outgoing payments this month."
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                        Supplier Trends
                      </span>
                      <p className="text-xs font-bold text-navy-950 dark:text-slate-100 mt-1">
                        "Supplier payments increased 14% compared with August."
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-navy-850">
                  <Link href="/analytics">
                    <Button variant="outline" size="sm" className="w-full text-xs font-bold border-slate-300 dark:border-navy-700">
                      Explore Visual Analytics
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>

            {/* ======================================================================= */}
            {/* RECENT TRANSACTIONS TABLE                                               */}
            {/* ======================================================================= */}
            <Card className="p-6 border-2 border-slate-200 dark:border-navy-800 rounded-2xl shadow-subtle space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-yellow-500" />
                  <h3 className="font-extrabold text-base text-navy-950 dark:text-white">
                    Recent Ledger Activity
                  </h3>
                </div>
                <Link href="/transactions">
                  <Button variant="outline" size="sm" className="text-xs font-bold border-slate-300 dark:border-navy-700">
                    View All Transactions ({transactions.length})
                  </Button>
                </Link>
              </div>

              {transactions.length === 0 ? (
                <EmptyState
                  icon={Receipt}
                  title="No transactions found"
                  description="No recent ledger movements recorded for this operating entity."
                  actionLabel="Send Payment"
                  onAction={() => setIsSendOpen(true)}
                  variant="plain"
                />
              ) : (
                <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-navy-800">
                  <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                    <thead className="bg-slate-50 dark:bg-navy-950 text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-navy-800">
                      <tr>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4">Transaction ID</th>
                        <th className="py-3 px-4">Type</th>
                        <th className="py-3 px-4">Recipient/Sender</th>
                        <th className="py-3 px-4 text-right">Amount (GH₵)</th>
                        <th className="py-3 px-4">Provider</th>
                        <th className="py-3 px-4 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-navy-850">
                      {transactions.slice(0, 5).map((tx) => {
                        const isDisb = tx.direction === 'DISBURSEMENT';
                        const s = tx.status.toUpperCase();

                        return (
                          <tr
                            key={tx.id}
                            onClick={() => setSelectedTx(tx)}
                            className="hover:bg-slate-50 dark:hover:bg-navy-850/60 transition-colors cursor-pointer"
                          >
                            <td className="py-3 px-4 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                              {formatDate(tx.created_at)}
                            </td>
                            <td className="py-3 px-4 font-mono font-bold text-navy-950 dark:text-slate-200">
                              {tx.reference}
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                                  isDisb
                                    ? 'bg-slate-100 dark:bg-navy-800 text-slate-700 dark:text-slate-300'
                                    : 'bg-yellow-100 dark:bg-yellow-950 text-yellow-800 dark:text-yellow-400'
                                }`}
                              >
                                {isDisb ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownLeft className="w-3 h-3" />}
                                {isDisb ? 'PAY' : 'RECEIVE'}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-semibold text-navy-950 dark:text-slate-200">
                              {tx.counterparty_name}
                            </td>
                            <td className="py-3 px-4 text-right font-black tabular-nums whitespace-nowrap">
                              <span className={isDisb ? 'text-navy-950 dark:text-slate-100' : 'text-emerald-600 dark:text-emerald-400'}>
                                {isDisb ? '-' : '+'}{formatCurrency(tx.amount, tx.currency || 'GH₵')}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-medium text-slate-600 dark:text-slate-300">
                              {tx.channel.replace('_', ' ')}
                            </td>
                            <td className="py-3 px-4 text-center whitespace-nowrap">
                              {s === 'SUCCESS' || s === 'COMPLETED' ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold border border-emerald-200 dark:border-emerald-800">
                                  🟢 Successful
                                </span>
                              ) : s === 'PENDING' ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-50 dark:bg-yellow-950/60 text-yellow-700 dark:text-yellow-400 text-[10px] font-bold border border-yellow-200 dark:border-yellow-800">
                                  🟡 Pending
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 text-[10px] font-bold border border-rose-200 dark:border-rose-800">
                                  🔴 Failed
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Modals */}
        <PreFlightCheckModal
          isOpen={isVerifyOpen}
          onClose={() => setIsVerifyOpen(false)}
          onProceedWithPayment={handlePreflightProceed}
        />

        <DisbursementWizard
          isOpen={isSendOpen}
          onClose={() => setIsSendOpen(false)}
          recipients={recipients}
          onPaymentSuccess={() => loadData()}
          initialData={sendInitialData}
        />

        <CreatePaymentLinkModal
          isOpen={isReceiveOpen}
          onClose={() => setIsReceiveOpen(false)}
          onCreated={() => loadData()}
        />

        <TransactionDetailModal
          isOpen={!!selectedTx}
          onClose={() => setSelectedTx(null)}
          transaction={selectedTx}
        />
      </PageShell>
    </DashboardLayoutWrapper>
  );
}
