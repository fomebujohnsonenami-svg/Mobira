'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayoutWrapper } from '@/components/layout/DashboardLayoutWrapper';
import { PageShell } from '@/components/layout/PageShell';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ErrorState } from '@/components/ui/ErrorState';
import { PageLoadingSkeleton } from '@/components/ui/LoadingState';
import { BusinessVerificationBadge } from '@/components/verification/BusinessVerificationBadge';
import {
  TrendingUp,
  ArrowDownLeft,
  ArrowUpRight,
  Receipt,
  Users,
  Lightbulb,
  Sparkles,
  PieChart,
  BarChart3,
  Calendar,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { api } from '@/services/api';
import { AnalyticsOverview } from '@/types';
import { formatCurrency } from '@/lib/formatters';

export default function AnalyticsPage() {
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getAnalytics();
      setOverview(data);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to load analytics dashboard. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Financial Overview metrics
  const financialOverview = {
    moneyReceived: 185400,
    moneySent: 142700,
    netMovement: 185400 - 142700, // +GH₵42,700
    transactionCount: 227,
    currency: 'GH₵',
  };

  // Spending Categories: Employee payments, Suppliers, Contractors, Other
  const spendingCategories = [
    {
      category: 'Employee payments',
      amount: 98000,
      percentage: 68.8,
      color: 'bg-emerald-500',
      textColor: 'text-emerald-600 dark:text-emerald-400',
      description: 'Monthly payroll across 48 staff members',
    },
    {
      category: 'Suppliers',
      amount: 32500,
      percentage: 22.8,
      color: 'bg-sky-500',
      textColor: 'text-sky-600 dark:text-sky-400',
      description: 'Raw materials & commercial supplier settlements',
    },
    {
      category: 'Contractors',
      amount: 8200,
      percentage: 5.7,
      color: 'bg-teal-500',
      textColor: 'text-teal-600 dark:text-teal-400',
      description: 'Software development & specialized consulting',
    },
    {
      category: 'Other',
      amount: 4000,
      percentage: 2.7,
      color: 'bg-slate-400',
      textColor: 'text-slate-500 dark:text-slate-400',
      description: 'Equipment, workspace utilities & administrative fees',
    },
  ];

  // Monthly trends (past 6 months)
  const monthlyTrends = [
    { month: 'Apr', inflow: 120000, outflow: 95000, volume: 142 },
    { month: 'May', inflow: 138000, outflow: 110000, volume: 165 },
    { month: 'Jun', inflow: 145000, outflow: 118000, volume: 178 },
    { month: 'Jul', inflow: 162000, outflow: 125000, volume: 194 },
    { month: 'Aug', inflow: 174000, outflow: 135000, volume: 210 },
    { month: 'Sep', inflow: 185400, outflow: 142700, volume: 227 },
  ];

  const maxFlow = 200000;

  return (
    <DashboardLayoutWrapper>
      <PageShell
        title="Business Analytics & Financial Intelligence"
        subtitle="Track institutional cashflow velocity, spending category allocations, volume trends, and actionable insights."
        badge={<BusinessVerificationBadge size="sm" />}
      >
        {loading ? (
          <PageLoadingSkeleton label="Loading analytics engine and cashflow trends..." />
        ) : error ? (
          <ErrorState title="Something went wrong." message={error} onRetry={loadData} />
        ) : (
          <div className="space-y-6">
            {/* 1. FINANCIAL OVERVIEW */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Financial Overview (September 2026)
                </h3>
                <Badge variant="emerald" size="sm">100% Balanced</Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Money Received */}
                <Card hover className="p-5 border-2 border-slate-200 dark:border-navy-800 rounded-2xl shadow-subtle">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                      Money Received
                    </span>
                    <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                      <ArrowDownLeft className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
                      {formatCurrency(financialOverview.moneyReceived, financialOverview.currency)}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1 font-medium">
                      Total customer collections & receivables
                    </p>
                  </div>
                </Card>

                {/* Money Sent */}
                <Card hover className="p-5 border-2 border-slate-200 dark:border-navy-800 rounded-2xl shadow-subtle">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                      Money Sent
                    </span>
                    <div className="p-2 rounded-xl bg-slate-100 dark:bg-navy-950 text-navy-900 dark:text-slate-200">
                      <ArrowUpRight className="w-4 h-4 text-sky-400" />
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-2xl font-black text-navy-950 dark:text-slate-100 tabular-nums">
                      {formatCurrency(financialOverview.moneySent, financialOverview.currency)}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1 font-medium">
                      Total corporate disbursements & payroll
                    </p>
                  </div>
                </Card>

                {/* Net Movement */}
                <Card hover className="p-5 border-2 border-slate-200 dark:border-navy-800 rounded-2xl shadow-subtle">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                      Net Movement
                    </span>
                    <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
                      +{formatCurrency(financialOverview.netMovement, financialOverview.currency)}
                    </p>
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-1">
                      Positive treasury surplus
                    </p>
                  </div>
                </Card>

                {/* Transaction Count */}
                <Card hover className="p-5 border-2 border-slate-200 dark:border-navy-800 rounded-2xl shadow-subtle">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                      Transaction Count
                    </span>
                    <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                      <Receipt className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-2xl font-black text-navy-950 dark:text-slate-100 tabular-nums">
                      {financialOverview.transactionCount}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1 font-medium">
                      Disbursements & Collections reconciled
                    </p>
                  </div>
                </Card>
              </div>
            </div>

            {/* 2. SPENDING CATEGORIES */}
            <Card className="p-6 border-2 border-slate-200 dark:border-navy-800 rounded-2xl shadow-subtle space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-black text-lg text-navy-950 dark:text-white">
                    Spending Categories
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Breakdown of GH₵142,700 outgoing disbursements for September 2026.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-slate-400">
                  100% Categorized
                </span>
              </div>

              {/* Visual Allocation Stack Bar */}
              <div className="w-full bg-slate-100 dark:bg-navy-950 rounded-xl h-4 overflow-hidden flex">
                {spendingCategories.map((c) => (
                  <div
                    key={c.category}
                    className={`${c.color} h-full transition-all duration-500`}
                    style={{ width: `${c.percentage}%` }}
                    title={`${c.category}: ${c.percentage}%`}
                  />
                ))}
              </div>

              {/* Category Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {spendingCategories.map((c) => (
                  <div
                    key={c.category}
                    className="p-4 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-navy-950 dark:text-slate-200">
                        {c.category}
                      </span>
                      <span className={`text-xs font-black ${c.textColor}`}>
                        {c.percentage}%
                      </span>
                    </div>

                    <p className="text-xl font-black text-navy-950 dark:text-white tabular-nums">
                      {formatCurrency(c.amount, 'GH₵')}
                    </p>

                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                      {c.description}
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            {/* 3. TRENDS: Monthly Inflow, Monthly Outflow, Payment Volume */}
            <Card className="p-6 border-2 border-slate-200 dark:border-navy-800 rounded-2xl shadow-subtle space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-black text-lg text-navy-950 dark:text-white">
                    Monthly Cashflow & Volume Trends
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Comparative analysis of monthly inflow, monthly outflow, and payment transaction volume.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs font-bold">
                  <span className="flex items-center gap-1.5 text-emerald-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Monthly Inflow
                  </span>
                  <span className="flex items-center gap-1.5 text-navy-950 dark:text-slate-200">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-400 dark:bg-navy-700" /> Monthly Outflow
                  </span>
                  <span className="flex items-center gap-1.5 text-yellow-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" /> Payment Volume
                  </span>
                </div>
              </div>

              {/* Custom Bar Chart Visualizer */}
              <div className="grid grid-cols-6 gap-2 sm:gap-6 pt-4 items-end h-64 border-b border-slate-200 dark:border-navy-800 pb-3">
                {monthlyTrends.map((t) => {
                  const inflowHeight = (t.inflow / maxFlow) * 100;
                  const outflowHeight = (t.outflow / maxFlow) * 100;

                  return (
                    <div key={t.month} className="flex flex-col items-center gap-2 h-full justify-end group">
                      <div className="text-[10px] font-mono text-slate-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                        {t.volume} tx
                      </div>

                      <div className="flex items-end gap-1 sm:gap-1.5 h-44 w-full max-w-[48px] justify-center">
                        {/* Inflow Bar */}
                        <div
                          className="w-1/2 bg-emerald-500 rounded-t-lg transition-all duration-500 hover:bg-emerald-400 relative"
                          style={{ height: `${inflowHeight}%` }}
                          title={`Inflow: GH₵${t.inflow.toLocaleString()}`}
                        />
                        {/* Outflow Bar */}
                        <div
                          className="w-1/2 bg-slate-300 dark:bg-navy-700 rounded-t-lg transition-all duration-500 hover:bg-slate-400 relative"
                          style={{ height: `${outflowHeight}%` }}
                          title={`Outflow: GH₵${t.outflow.toLocaleString()}`}
                        />
                      </div>

                      <div className="text-center">
                        <span className="text-xs font-black text-navy-950 dark:text-white block">
                          {t.month}
                        </span>
                        <span className="text-[10px] text-yellow-600 font-bold tabular-nums">
                          {t.volume}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate-400">
                <span>Past 6 months programmatic transaction velocity</span>
                <span className="font-bold text-navy-950 dark:text-white">Peak Volume: 227 transactions in September</span>
              </div>
            </Card>

            {/* 4. INSIGHTS */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <h3 className="font-black text-base text-navy-950 dark:text-white">
                  Deterministic Financial Insights
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Insight 1 (Exact specification) */}
                <Card className="p-5 border-2 border-emerald-500/30 bg-emerald-50/20 dark:bg-navy-950 rounded-2xl shadow-subtle flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 text-navy-950 flex items-center justify-center shrink-0 font-black shadow-md shadow-emerald-500/20">
                    <Lightbulb className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-black text-emerald-700 dark:text-emerald-400 tracking-wider block">
                      Expenditure Concentration
                    </span>
                    <p className="text-sm font-black text-navy-950 dark:text-white leading-snug">
                      Payroll represents 68.8% of your outgoing payments this month.
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      September payroll was executed across 48 verified employees totaling GH₵98,000 via MTN MoMo.
                    </p>
                  </div>
                </Card>

                {/* Insight 2 (Exact specification) */}
                <Card className="p-5 border-2 border-blue-500/40 bg-blue-50/50 dark:bg-navy-950 rounded-2xl shadow-subtle flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 font-black">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-black text-blue-700 dark:text-blue-400 tracking-wider block">
                      Supplier Cost Trajectory
                    </span>
                    <p className="text-sm font-black text-navy-950 dark:text-white leading-snug">
                      Supplier payments increased 14% compared with August.
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Driven by inventory restocking for Q4 demand and wholesale garment production batches.
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        )}
      </PageShell>
    </DashboardLayoutWrapper>
  );
}
