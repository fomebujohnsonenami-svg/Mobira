'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayoutWrapper } from '@/components/layout/DashboardLayoutWrapper';
import { PageShell } from '@/components/layout/PageShell';
import { TransactionTable } from '@/components/transactions/TransactionTable';
import { TransactionDetailModal } from '@/components/transactions/TransactionDetailModal';
import { BusinessVerificationBadge } from '@/components/verification/BusinessVerificationBadge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { TableSkeleton, MetricCardSkeleton } from '@/components/ui/LoadingState';
import { Download, Search, RefreshCw, Filter, Calendar, CheckCircle2, Clock, AlertCircle, X } from 'lucide-react';
import { api } from '@/services/api';
import { Transaction } from '@/types';
import { useToast } from '@/components/ui/Toast';
import { formatCurrency } from '@/lib/formatters';

export default function TransactionsPage() {
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [providerFilter, setProviderFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('ALL');
  const [sortField, setSortField] = useState('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getTransactions();
      setTransactions(data);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to load transaction ledger. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter & Sort Logic
  const filtered = transactions.filter((tx) => {
    // Status Filter
    if (statusFilter !== 'ALL') {
      const s = tx.status.toUpperCase();
      if (statusFilter === 'SUCCESS' && !(s === 'SUCCESS' || s === 'SUCCESSFUL' || s === 'COMPLETED')) return false;
      if (statusFilter === 'PENDING' && !(s === 'PENDING' || s === 'PENDING_APPROVAL' || s === 'PROCESSING')) return false;
      if (statusFilter === 'FAILED' && !(s === 'FAILED' || s === 'REJECTED' || s === 'CANCELLED')) return false;
    }

    // Type Filter
    if (typeFilter !== 'ALL' && tx.direction !== typeFilter) return false;

    // Provider Filter
    if (providerFilter !== 'ALL') {
      if (!tx.channel.toUpperCase().includes(providerFilter.toUpperCase())) return false;
    }

    // Date Filter
    if (dateFilter !== 'ALL') {
      const txDate = new Date(tx.created_at);
      const now = new Date();
      if (dateFilter === 'TODAY') {
        if (txDate.toDateString() !== now.toDateString()) return false;
      } else if (dateFilter === 'WEEK') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        if (txDate < weekAgo) return false;
      } else if (dateFilter === 'MONTH') {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        if (txDate < monthAgo) return false;
      }
    }

    // Search
    if (search) {
      const q = search.toLowerCase();
      return (
        tx.reference.toLowerCase().includes(q) ||
        tx.counterparty_name.toLowerCase().includes(q) ||
        tx.counterparty_identifier.toLowerCase().includes(q) ||
        (tx.description && tx.description.toLowerCase().includes(q))
      );
    }

    return true;
  });

  // Sorting
  const sorted = [...filtered].sort((a, b) => {
    if (sortField === 'date') {
      const d1 = new Date(a.created_at).getTime();
      const d2 = new Date(b.created_at).getTime();
      return sortOrder === 'asc' ? d1 - d2 : d2 - d1;
    }
    if (sortField === 'amount') {
      return sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount;
    }
    return 0;
  });

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setStatusFilter('ALL');
    setTypeFilter('ALL');
    setProviderFilter('ALL');
    setDateFilter('ALL');
  };

  const handleExportCSV = () => {
    window.open('http://localhost:8000/api/v1/transactions/export/csv/', '_blank');
    toast({
      type: 'success',
      title: 'Statement Exported',
      message: 'Downloading audit-ready CSV statement.',
    });
  };

  const hasActiveFilters = search || statusFilter !== 'ALL' || typeFilter !== 'ALL' || providerFilter !== 'ALL' || dateFilter !== 'ALL';

  // Metrics
  const totalSuccess = transactions.filter((t) => ['SUCCESS', 'SUCCESSFUL', 'COMPLETED'].includes(t.status.toUpperCase())).length;
  const totalPending = transactions.filter((t) => ['PENDING', 'PENDING_APPROVAL', 'PROCESSING'].includes(t.status.toUpperCase())).length;
  const totalFailed = transactions.filter((t) => ['FAILED', 'REJECTED'].includes(t.status.toUpperCase())).length;

  return (
    <DashboardLayoutWrapper>
      <PageShell
        title="Transactions Ledger"
        subtitle="Complete record of all single disbursements, batch runs, and customer collections."
        badge={<BusinessVerificationBadge size="sm" />}
        action={
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleExportCSV} className="gap-2 text-xs font-bold border-slate-300 dark:border-navy-700">
              <Download className="w-3.5 h-3.5 text-yellow-600 dark:text-yellow-400" /> Export CSV Statement
            </Button>
          </div>
        }
      >
        {loading ? (
          <div className="space-y-5">
            <MetricCardSkeleton count={4} />
            <TableSkeleton rows={8} cols={7} />
          </div>
        ) : error ? (
          <ErrorState
            title="Something went wrong."
            message={error}
            onRetry={loadData}
          />
        ) : (
          <div className="space-y-5">
            {/* Status Quick Filters & Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <button
                onClick={() => setStatusFilter('ALL')}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  statusFilter === 'ALL'
                    ? 'bg-navy-950 text-white dark:bg-yellow-500 dark:text-navy-950 border-transparent shadow-sm'
                    : 'bg-white dark:bg-navy-900 border-slate-200 dark:border-navy-800'
                }`}
              >
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  All Transactions
                </span>
                <p className="text-xl font-black mt-1 tabular-nums">{transactions.length} Records</p>
              </button>

              <button
                onClick={() => setStatusFilter('SUCCESS')}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  statusFilter === 'SUCCESS'
                    ? 'bg-emerald-600 text-white border-transparent shadow-sm'
                    : 'bg-white dark:bg-navy-900 border-slate-200 dark:border-navy-800'
                }`}
              >
                <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 block tracking-wider flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> 🟢 Successful
                </span>
                <p className="text-xl font-black mt-1 tabular-nums">{totalSuccess} Cleared</p>
              </button>

              <button
                onClick={() => setStatusFilter('PENDING')}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  statusFilter === 'PENDING'
                    ? 'bg-yellow-500 text-navy-950 border-transparent shadow-sm'
                    : 'bg-white dark:bg-navy-900 border-slate-200 dark:border-navy-800'
                }`}
              >
                <span className="text-[10px] uppercase font-bold text-yellow-700 dark:text-yellow-400 block tracking-wider flex items-center gap-1">
                  <Clock className="w-3 h-3" /> 🟡 Pending
                </span>
                <p className="text-xl font-black mt-1 tabular-nums">{totalPending} In Queue</p>
              </button>

              <button
                onClick={() => setStatusFilter('FAILED')}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  statusFilter === 'FAILED'
                    ? 'bg-rose-600 text-white border-transparent shadow-sm'
                    : 'bg-white dark:bg-navy-900 border-slate-200 dark:border-navy-800'
                }`}
              >
                <span className="text-[10px] uppercase font-bold text-rose-600 dark:text-rose-400 block tracking-wider flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> 🔴 Failed
                </span>
                <p className="text-xl font-black mt-1 tabular-nums">{totalFailed} Flagged</p>
              </button>
            </div>

            {/* Filter & Search Toolbar */}
            <div className="p-4 bg-white dark:bg-navy-900 rounded-2xl border border-slate-200 dark:border-navy-800 space-y-3 shadow-subtle">
              <div className="flex flex-col md:flex-row items-center gap-3">
                {/* Search Bar */}
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search by Transaction ID, beneficiary, phone, or memo..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 rounded-xl text-xs text-navy-950 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/70"
                  />
                </div>

                {/* Multi-Filter Dropdowns */}
                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto text-xs">
                  {/* Type Filter */}
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="px-3 py-2 bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 rounded-xl text-xs text-navy-950 dark:text-slate-100 font-semibold"
                  >
                    <option value="ALL">All Types</option>
                    <option value="DISBURSEMENT">Payouts Only (PAY)</option>
                    <option value="COLLECTION">Collections Only (RECEIVE)</option>
                  </select>

                  {/* Provider Filter */}
                  <select
                    value={providerFilter}
                    onChange={(e) => setProviderFilter(e.target.value)}
                    className="px-3 py-2 bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 rounded-xl text-xs text-navy-950 dark:text-slate-100 font-semibold"
                  >
                    <option value="ALL">All Providers</option>
                    <option value="MTN">MTN MoMo</option>
                    <option value="ORANGE">Orange Money</option>
                    <option value="BANK">Bank Transfer</option>
                  </select>

                  {/* Date Filter */}
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="px-3 py-2 bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 rounded-xl text-xs text-navy-950 dark:text-slate-100 font-semibold"
                  >
                    <option value="ALL">All Dates</option>
                    <option value="TODAY">Today</option>
                    <option value="WEEK">Past 7 Days</option>
                    <option value="MONTH">Past 30 Days</option>
                  </select>

                  {hasActiveFilters && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleResetFilters}
                      className="gap-1 text-xs text-slate-500 hover:text-navy-950 dark:hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" /> Clear
                    </Button>
                  )}

                  <Button variant="ghost" size="sm" onClick={loadData} className="p-2 text-slate-500">
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  </Button>
                </div>
              </div>
            </div>

            {/* Complete Transactions Table or Empty State */}
            {sorted.length === 0 ? (
              <EmptyState
                title="No transactions found."
                description="Try adjusting your search terms, date range, or filter criteria."
                actionLabel={hasActiveFilters ? 'Clear Filters' : undefined}
                onAction={hasActiveFilters ? handleResetFilters : undefined}
                variant="card"
              />
            ) : (
              <TransactionTable
                transactions={sorted}
                onSelectTransaction={(tx) => setSelectedTx(tx)}
                onSort={handleSort}
                sortField={sortField}
                sortOrder={sortOrder}
              />
            )}
          </div>
        )}

        {/* Transaction Detail View Modal */}
        <TransactionDetailModal
          isOpen={!!selectedTx}
          onClose={() => setSelectedTx(null)}
          transaction={selectedTx}
        />
      </PageShell>
    </DashboardLayoutWrapper>
  );
}
