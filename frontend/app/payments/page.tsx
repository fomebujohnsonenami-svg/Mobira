'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayoutWrapper } from '@/components/layout/DashboardLayoutWrapper';
import { PageShell } from '@/components/layout/PageShell';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { TableSkeleton } from '@/components/ui/LoadingState';
import { Send, Plus, ShieldAlert, CheckCircle2, Clock, Filter, UserCheck } from 'lucide-react';
import { api } from '@/services/api';
import { Payment, Recipient } from '@/types';
import { formatCurrency, formatDate, formatChannelName } from '@/lib/formatters';
import { DisbursementWizard } from '@/components/payments/DisbursementWizard';
import { MakerCheckerModal } from '@/components/payments/MakerCheckerModal';
import { BusinessVerificationBadge } from '@/components/verification/BusinessVerificationBadge';
import { usePrivacy, PrivacyToggle } from '@/components/privacy/PrivacyContext';

export default function PaymentsPage() {
  const { formatAmount } = usePrivacy();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSendOpen, setIsSendOpen] = useState(false);
  const [checkerPayment, setCheckerPayment] = useState<Payment | null>(null);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'COMPLETED'>('ALL');

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [pays, recs] = await Promise.all([api.getPayments(), api.getRecipients()]);
      setPayments(pays);
      setRecipients(recs);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to load single disbursements. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredPayments = payments.filter((p) => {
    if (filter === 'PENDING') return p.status === 'PENDING_APPROVAL';
    if (filter === 'COMPLETED') return p.status === 'COMPLETED';
    return true;
  });

  const pendingCount = payments.filter((p) => p.status === 'PENDING_APPROVAL').length;

  return (
    <DashboardLayoutWrapper>
      <PageShell
        title="Single Disbursements (PAY)"
        subtitle="Manage individual vendor, supplier, and contractor payouts with multi-rail execution."
        badge={
          <div className="flex items-center gap-2">
            <BusinessVerificationBadge size="sm" />
            <PrivacyToggle size="sm" />
          </div>
        }
        action={
          <Button variant="primary" onClick={() => setIsSendOpen(true)} className="gap-2 font-bold text-xs">
            <Send className="w-3.5 h-3.5 text-navy-950" /> Send Payment
          </Button>
        }
      >
        {loading ? (
          <div className="space-y-6">
            <TableSkeleton rows={6} cols={7} />
          </div>
        ) : error ? (
          <ErrorState
            title="Something went wrong."
            message={error}
            onRetry={loadData}
          />
        ) : (
          <div className="space-y-6">
            {/* Maker-Checker Alert Banner if pending high-value payments exist */}
            {pendingCount > 0 && (
              <div className="p-4 bg-yellow-50 dark:bg-yellow-950/40 border border-yellow-300 dark:border-yellow-700/60 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start sm:items-center gap-3">
                  <ShieldAlert className="w-6 h-6 text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5 sm:mt-0" />
                  <div className="text-xs text-yellow-950 dark:text-yellow-200">
                    <p className="font-bold text-sm">
                      {pendingCount} Payment{pendingCount > 1 ? 's' : ''} Awaiting Maker-Checker Sign-off
                    </p>
                    <p className="text-yellow-900/80 dark:text-yellow-300 mt-0.5">
                      Amounts exceeding the 500,000 XAF threshold require CFO / Admin dual authorization before rail dispatch.
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFilter('PENDING')}
                  className="shrink-0 text-xs gap-1.5 border-yellow-300 dark:border-yellow-700/60 font-bold"
                >
                  <UserCheck className="w-3.5 h-3.5" /> Review Pending
                </Button>
              </div>
            )}

            {/* Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <button
                onClick={() => setFilter('ALL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                  filter === 'ALL'
                    ? 'bg-navy-950 text-white dark:bg-yellow-500 dark:text-navy-950'
                    : 'bg-white dark:bg-navy-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-navy-800'
                }`}
              >
                All Payouts ({payments.length})
              </button>
              <button
                onClick={() => setFilter('PENDING')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                  filter === 'PENDING'
                    ? 'bg-yellow-500 text-navy-950'
                    : 'bg-white dark:bg-navy-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-navy-800'
                }`}
              >
                Pending Approval ({pendingCount})
              </button>
              <button
                onClick={() => setFilter('COMPLETED')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                  filter === 'COMPLETED'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white dark:bg-navy-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-navy-800'
                }`}
              >
                Completed
              </button>
            </div>

            {/* Payments Table or Empty State */}
            {filteredPayments.length === 0 ? (
              <EmptyState
                icon={Send}
                title="No disbursements found."
                description={
                  filter === 'ALL'
                    ? "You haven't initiated any single disbursements yet."
                    : `No payouts currently in status "${filter}".`
                }
                actionLabel="Send Payment"
                onAction={() => setIsSendOpen(true)}
                variant="card"
              />
            ) : (
              <Card className="p-0 overflow-hidden shadow-subtle border border-slate-200 dark:border-navy-800">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                    <thead className="bg-slate-50 dark:bg-navy-950 text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-navy-800">
                      <tr>
                        <th className="py-3 px-4">Reference & Timestamp</th>
                        <th className="py-3 px-4">Beneficiary</th>
                        <th className="py-3 px-4">Rail</th>
                        <th className="py-3 px-4">Governance</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Amount (XAF)</th>
                        <th className="py-3 px-4 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-navy-850">
                      {filteredPayments.map((p) => {
                        const isPending = p.status === 'PENDING_APPROVAL';

                        return (
                          <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-navy-850/60 transition-colors">
                            <td className="py-3 px-4 whitespace-nowrap">
                              <div className="font-mono text-xs font-bold text-navy-950 dark:text-slate-100">
                                {p.reference_id}
                              </div>
                              <div className="text-[10px] text-slate-500 dark:text-slate-400">{formatDate(p.created_at)}</div>
                            </td>

                            <td className="py-3 px-4">
                              <div className="font-bold text-navy-950 dark:text-slate-100">{p.recipient_name}</div>
                              <div className="font-mono text-[11px] text-slate-500 dark:text-slate-400">{p.account_identifier}</div>
                            </td>

                            <td className="py-3 px-4 whitespace-nowrap">
                              <Badge variant={p.channel.includes('ORANGE') ? 'amber' : p.channel.includes('BANK') ? 'blue' : 'slate'}>
                                {formatChannelName(p.channel)}
                              </Badge>
                            </td>

                            <td className="py-3 px-4 text-xs whitespace-nowrap">
                              {p.requires_checker ? (
                                <span className="text-yellow-600 dark:text-yellow-400 font-bold flex items-center gap-1 text-[11px]">
                                  <ShieldAlert className="w-3.5 h-3.5" /> Dual Auth
                                </span>
                              ) : (
                                <span className="text-slate-400 text-[11px]">Standard</span>
                              )}
                            </td>

                            <td className="py-3 px-4 whitespace-nowrap">
                              <Badge variant={p.status === 'COMPLETED' ? 'emerald' : isPending ? 'amber' : 'rose'}>
                                {p.status}
                              </Badge>
                            </td>

                            <td className="py-3 px-4 text-right font-black text-navy-950 dark:text-slate-100 tabular-nums whitespace-nowrap">
                              {formatAmount(p.amount, p.currency || 'GH₵')}
                            </td>

                            <td className="py-3 px-4 text-center whitespace-nowrap">
                              {isPending ? (
                                <Button
                                  variant="primary"
                                  size="sm"
                                  onClick={() => setCheckerPayment(p)}
                                  className="text-xs py-1 gap-1"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" /> Review
                                </Button>
                              ) : (
                                <span className="text-[11px] text-slate-400 font-mono">
                                  {p.provider_reference || 'CLEARED'}
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
          </div>
        )}

        <DisbursementWizard
          isOpen={isSendOpen}
          onClose={() => setIsSendOpen(false)}
          recipients={recipients}
          onPaymentSuccess={() => loadData()}
        />

        <MakerCheckerModal
          isOpen={!!checkerPayment}
          onClose={() => setCheckerPayment(null)}
          payment={checkerPayment}
          onApproved={() => loadData()}
        />
      </PageShell>
    </DashboardLayoutWrapper>
  );
}
