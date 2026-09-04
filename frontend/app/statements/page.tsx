'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayoutWrapper } from '@/components/layout/DashboardLayoutWrapper';
import { PageShell } from '@/components/layout/PageShell';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { PageLoadingSkeleton } from '@/components/ui/LoadingState';
import { BusinessVerificationBadge } from '@/components/verification/BusinessVerificationBadge';
import {
  Download,
  Printer,
  Calendar,
  Filter,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
  FileSpreadsheet,
  FileText,
  Copy,
  Check,
  Building,
  RefreshCw,
} from 'lucide-react';
import { api } from '@/services/api';
import { Transaction } from '@/types';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { useToast } from '@/components/ui/Toast';

export default function BusinessStatementsPage() {
  const { toast } = useToast();

  // Filters: Date Range, Transaction Type, Incoming/Outgoing, Category
  const [dateRange, setDateRange] = useState('SEP_2026');
  const [txnType, setTxnType] = useState('ALL');
  const [movement, setMovement] = useState<'ALL' | 'INCOMING' | 'OUTGOING'>('ALL');
  const [category, setCategory] = useState('ALL');

  const [copiedSummary, setCopiedSummary] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const txs = await api.getTransactions();
      setTransactions(txs);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to load statements ledger. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Statement Metrics (Conforming to the user's exact specification)
  // September 2026:
  // Money Received: GH₵185,400
  // Money Sent: GH₵142,700
  // Payroll: GH₵98,000
  // Suppliers: GH₵32,500
  // Other: GH₵12,200
  const statementSummary = {
    period: 'September 2026',
    moneyReceived: 185400,
    moneySent: 142700,
    payroll: 98000,
    suppliers: 32500,
    other: 12200,
    netCashflow: 185400 - 142700, // +GH₵42,700
  };

  // Categorized statement line items
  const statementItems = [
    {
      id: 'stmt_1',
      date: '2026-09-03',
      ref: 'MOB-TXN-2026-000184-PAYROLL',
      description: 'September Employee Payments (48 staff)',
      category: 'Payroll',
      type: 'MTN MoMo',
      direction: 'OUTGOING',
      amount: 98000,
    },
    {
      id: 'stmt_2',
      date: '2026-09-02',
      ref: 'MOB-TXN-2026-SUPP-810',
      description: 'Monthly Suppliers & Textile Fabric Batch',
      category: 'Suppliers',
      type: 'Bank Transfer',
      direction: 'OUTGOING',
      amount: 32500,
    },
    {
      id: 'stmt_3',
      date: '2026-09-01',
      ref: 'MOB-TXN-2026-UTIL-019',
      description: 'Logistics, Workshop Rent & Utilities',
      category: 'Other',
      type: 'Orange Money',
      direction: 'OUTGOING',
      amount: 12200,
    },
    {
      id: 'stmt_4',
      date: '2026-09-03',
      ref: 'MOB-TXN-2026-REC-WHOLESALE',
      description: 'Wholesale Boutiques Collection Run',
      category: 'Customer Sales',
      type: 'MTN MoMo',
      direction: 'INCOMING',
      amount: 145000,
    },
    {
      id: 'stmt_5',
      date: '2026-09-02',
      ref: 'MOB-TXN-2026-REC-ONLINE',
      description: 'Online Customer Payment Links & QR Pay',
      category: 'Customer Sales',
      type: 'MTN MoMo',
      direction: 'INCOMING',
      amount: 40400,
    },
  ];

  // Filtered statement line items
  const filteredItems = statementItems.filter((item) => {
    // Incoming/outgoing
    if (movement === 'INCOMING' && item.direction !== 'INCOMING') return false;
    if (movement === 'OUTGOING' && item.direction !== 'OUTGOING') return false;

    // Category
    if (category !== 'ALL' && item.category !== category) return false;

    // Transaction Type / Rail
    if (txnType !== 'ALL' && !item.type.toLowerCase().includes(txnType.toLowerCase())) return false;

    return true;
  });

  // Export handlers
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCSV = () => {
    const csvContent =
      'Date,Reference,Description,Category,Rail,Direction,Amount (GH₵)\n' +
      statementItems
        .map(
          (i) =>
            `${i.date},${i.ref},"${i.description}",${i.category},${i.type},${i.direction},${i.amount}`
        )
        .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Mobira_Business_Statement_${dateRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      type: 'success',
      title: 'CSV Statement Downloaded',
      message: `Exported ${statementSummary.period} financial ledger.`,
    });
  };

  const handleCopySummary = () => {
    const summaryText = `
MOBIRA BUSINESS STATEMENT
Period: ${statementSummary.period}
Business: ABC Technologies Ltd ✓

Money Received: GH₵${statementSummary.moneyReceived.toLocaleString()}
Money Sent: GH₵${statementSummary.moneySent.toLocaleString()}

Expense Allocation:
• Payroll: GH₵${statementSummary.payroll.toLocaleString()}
• Suppliers: GH₵${statementSummary.suppliers.toLocaleString()}
• Other: GH₵${statementSummary.other.toLocaleString()}

Net Cashflow: +GH₵${statementSummary.netCashflow.toLocaleString()}
    `.trim();

    navigator.clipboard?.writeText(summaryText);
    setCopiedSummary(true);
    toast({
      type: 'success',
      title: 'Summary Copied',
      message: 'Financial statement text copied to clipboard.',
    });
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  return (
    <DashboardLayoutWrapper>
      <PageShell
        title="Business Statements"
        subtitle="Formal, accountant-ready financial statements and multi-rail reconciliation."
        badge={<BusinessVerificationBadge size="sm" />}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopySummary}
              className="text-xs font-bold gap-1.5 border-slate-300 dark:border-navy-700"
            >
              {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedSummary ? 'Copied' : 'Copy Summary'}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="text-xs font-bold gap-1.5 border-slate-300 dark:border-navy-700"
            >
              <Printer className="w-3.5 h-3.5" /> Print Statement
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={handleDownloadCSV}
              className="text-xs font-black uppercase tracking-wider gap-1.5 bg-yellow-500 hover:bg-yellow-400 text-navy-950 shadow-elevated"
            >
              <Download className="w-3.5 h-3.5" /> Download CSV
            </Button>
          </div>
        }
      >
        {loading ? (
          <PageLoadingSkeleton label="Loading statement reconciliations..." />
        ) : error ? (
          <ErrorState title="Something went wrong." message={error} onRetry={loadData} />
        ) : (
          <div className="space-y-6">
            {/* Filter Toolbar */}
            <div className="p-4 bg-white dark:bg-navy-900 rounded-2xl border border-slate-200 dark:border-navy-800 shadow-subtle space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <Filter className="w-3.5 h-3.5" /> Statement Filters
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                {/* 1. Date Range */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                    Date Range
                  </label>
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 rounded-xl text-navy-950 dark:text-slate-100 font-bold"
                  >
                    <option value="SEP_2026">September 2026 (Active)</option>
                    <option value="AUG_2026">August 2026</option>
                    <option value="JUL_2026">July 2026</option>
                    <option value="Q3_2026">Q3 2026 (Jul - Sep)</option>
                    <option value="YTD_2026">Year to Date 2026</option>
                  </select>
                </div>

                {/* 2. Incoming / Outgoing */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                    Movement
                  </label>
                  <select
                    value={movement}
                    onChange={(e) => setMovement(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 rounded-xl text-navy-950 dark:text-slate-100 font-bold"
                  >
                    <option value="ALL">All Movements (Net)</option>
                    <option value="INCOMING">Incoming (Money Received)</option>
                    <option value="OUTGOING">Outgoing (Money Sent)</option>
                  </select>
                </div>

                {/* 3. Transaction Type / Rail */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                    Transaction Type / Rail
                  </label>
                  <select
                    value={txnType}
                    onChange={(e) => setTxnType(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 rounded-xl text-navy-950 dark:text-slate-100 font-bold"
                  >
                    <option value="ALL">All Transaction Rails</option>
                    <option value="MTN">MTN MoMo</option>
                    <option value="Orange">Orange Money</option>
                    <option value="Bank">Bank Transfer (EFT)</option>
                  </select>
                </div>

                {/* 4. Category */}
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 rounded-xl text-navy-950 dark:text-slate-100 font-bold"
                  >
                    <option value="ALL">All Categories</option>
                    <option value="Payroll">Payroll</option>
                    <option value="Suppliers">Suppliers</option>
                    <option value="Other">Other Expenses</option>
                    <option value="Customer Sales">Customer Sales</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Formal Financial Statement Card */}
            <Card className="p-5 sm:p-8 bg-white dark:bg-navy-900 border-2 border-slate-200 dark:border-navy-800 shadow-modal space-y-6">
              {/* Header with Verified Merchant Details */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-navy-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-black text-navy-950 dark:text-white tracking-tight">
                      ABC Technologies Ltd
                    </h2>
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-black flex items-center justify-center">✓</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-mono font-bold">PP-ABC-001</span>
                    <span>•</span>
                    <span>Accra, Ghana</span>
                    <span>•</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">100% Balanced & Reconciled</span>
                  </div>
                </div>

                {/* Period Pill */}
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 text-left sm:text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                    Statement Period
                  </span>
                  <p className="text-lg font-black text-navy-950 dark:text-white mt-0.5">
                    September 2026
                  </p>
                </div>
              </div>

              {/* Primary Money Received / Money Sent Cards */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Money Received */}
                  <div className="p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border-2 border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5">
                        <ArrowDownLeft className="w-4 h-4 text-emerald-600" /> Money Received
                      </span>
                      <p className="text-3xl font-black text-emerald-700 dark:text-emerald-300 tabular-nums">
                        GH₵185,400
                      </p>
                      <span className="text-[11px] text-emerald-800/80 dark:text-emerald-400">
                        Collections across MTN MoMo & Bank EFT
                      </span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-700 dark:text-emerald-300 font-black text-lg">
                      +
                    </div>
                  </div>

                  {/* Money Sent */}
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-navy-950 border-2 border-slate-200 dark:border-navy-800 flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                        <ArrowUpRight className="w-4 h-4 text-slate-600" /> Money Sent
                      </span>
                      <p className="text-3xl font-black text-navy-950 dark:text-white tabular-nums">
                        GH₵142,700
                      </p>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        Corporate disbursements across 48 recipients
                      </span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-navy-800 flex items-center justify-center text-navy-950 dark:text-slate-200 font-black text-lg">
                      -
                    </div>
                  </div>
                </div>

                {/* Expense Category Breakdown */}
                <div className="p-5 rounded-2xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 space-y-3">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-400 block">
                    Disbursement Allocation by Category
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Payroll */}
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800">
                      <span className="text-xs font-bold text-slate-500 uppercase">Payroll</span>
                      <p className="text-2xl font-black text-navy-950 dark:text-white mt-1 tabular-nums">
                        GH₵98,000
                      </p>
                      <span className="text-[10px] font-bold text-yellow-600 dark:text-yellow-400 block mt-0.5">
                        68.7% of sent funds
                      </span>
                    </div>

                    {/* Suppliers */}
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800">
                      <span className="text-xs font-bold text-slate-500 uppercase">Suppliers</span>
                      <p className="text-2xl font-black text-navy-950 dark:text-white mt-1 tabular-nums">
                        GH₵32,500
                      </p>
                      <span className="text-[10px] font-bold text-yellow-600 dark:text-yellow-400 block mt-0.5">
                        22.8% of sent funds
                      </span>
                    </div>

                    {/* Other */}
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800">
                      <span className="text-xs font-bold text-slate-500 uppercase">Other</span>
                      <p className="text-2xl font-black text-navy-950 dark:text-white mt-1 tabular-nums">
                        GH₵12,200
                      </p>
                      <span className="text-[10px] font-bold text-yellow-600 dark:text-yellow-400 block mt-0.5">
                        8.5% of sent funds
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Reconciliation Table or Empty State */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold uppercase tracking-wider text-slate-400">
                    Itemized Statement Entries ({filteredItems.length})
                  </span>
                  <span className="text-slate-400">Showing all reconciled line items</span>
                </div>

                {filteredItems.length === 0 ? (
                  <EmptyState
                    icon={FileSpreadsheet}
                    title="No statement entries found"
                    description="No entries matched your active category or movement filters."
                    variant="card"
                  />
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-navy-800">
                    <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                      <thead className="bg-slate-50 dark:bg-navy-950 text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-navy-800">
                        <tr>
                          <th className="py-3 px-4">Date</th>
                          <th className="py-3 px-4">Reference</th>
                          <th className="py-3 px-4">Description</th>
                          <th className="py-3 px-4">Category</th>
                          <th className="py-3 px-4">Rail</th>
                          <th className="py-3 px-4 text-right">Amount (GH₵)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-navy-850">
                        {filteredItems.map((item) => (
                          <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-navy-850/60 transition-colors">
                            <td className="py-3 px-4 text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">
                              {item.date}
                            </td>
                            <td className="py-3 px-4 font-mono font-bold text-navy-950 dark:text-slate-200 text-xs">
                              {item.ref}
                            </td>
                            <td className="py-3 px-4 font-semibold text-navy-950 dark:text-slate-100">
                              {item.description}
                            </td>
                            <td className="py-3 px-4 whitespace-nowrap">
                              <Badge variant="slate" size="sm">{item.category}</Badge>
                            </td>
                            <td className="py-3 px-4 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                              {item.type}
                            </td>
                            <td className="py-3 px-4 text-right font-black tabular-nums whitespace-nowrap">
                              <span className={item.direction === 'INCOMING' ? 'text-emerald-600 dark:text-emerald-400' : 'text-navy-950 dark:text-white'}>
                                {item.direction === 'INCOMING' ? '+' : '-'}GH₵{item.amount.toLocaleString()}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Legal Certification Footer */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Certified by Mobira Settlement Protocol. All ledger entries verified against telecom partner switches.</span>
                </div>
                <span className="font-mono text-[10px] text-slate-400">
                  AUDIT-STMT-2026-SEP-8814
                </span>
              </div>
            </Card>
          </div>
        )}
      </PageShell>
    </DashboardLayoutWrapper>
  );
}
