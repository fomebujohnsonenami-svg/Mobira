'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  Briefcase,
  Truck,
  FileCheck2,
  Plus,
  Play,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Eye,
  Sparkles,
  Search,
  Filter,
  Layers,
  Clock,
  Send,
  Building,
  DollarSign,
  Upload,
  Copy,
  Trash2,
  Edit3,
  ExternalLink,
  ListTodo,
} from 'lucide-react';
import { DashboardLayoutWrapper } from '@/components/layout/DashboardLayoutWrapper';
import { PageShell } from '@/components/layout/PageShell';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { CardSkeleton, MetricCardSkeleton } from '@/components/ui/LoadingState';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { BusinessVerificationBadge } from '@/components/verification/BusinessVerificationBadge';
import { ImportPaymentListModal } from '@/components/payment-lists/ImportPaymentListModal';
import { OpenListDrawer } from '@/components/payment-lists/OpenListDrawer';
import { PrePaymentVerificationModal } from '@/components/payment-lists/PrePaymentVerificationModal';
import { api } from '@/services/api';
import { PaymentList, PaymentListCategory, PaymentListRecipient } from '@/types';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { useToast } from '@/components/ui/Toast';
import { usePrivacy, PrivacyToggle } from '@/components/privacy/PrivacyContext';

const CATEGORIES: Array<'All' | PaymentListCategory> = [
  'All',
  'Employees',
  'Suppliers',
  'Contractors',
  'Vendors',
  'Other beneficiaries',
];

export default function PaymentListsPage() {
  const { toast } = useToast();
  const { isBlinded, togglePrivacy, formatAmount } = usePrivacy();
  const [lists, setLists] = useState<PaymentList[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'All' | PaymentListCategory>('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Open List Drawer State
  const [selectedForOpen, setSelectedForOpen] = useState<PaymentList | null>(null);

  // Pre-Payment Verification Modal State
  const [selectedForPayment, setSelectedForPayment] = useState<PaymentList | null>(null);

  // Delete List State
  const [selectedForDelete, setSelectedForDelete] = useState<PaymentList | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null);

  // Recipient Inspector Modal
  const [inspectingList, setInspectingList] = useState<PaymentList | null>(null);

  // Import Payment List Modal State
  const [isImportOpen, setIsImportOpen] = useState(false);

  // Create List Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<PaymentListCategory>('Employees');
  const [newCount, setNewCount] = useState<number>(15);
  const [newAmount, setNewAmount] = useState<number>(45000);
  const [newDescription, setNewDescription] = useState('');
  const [creating, setCreating] = useState(false);

  const loadLists = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getPaymentLists();
      setLists(data);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to load payment lists. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLists();
  }, []);

  const filteredLists = lists.filter((item) => {
    if (selectedCategory === 'All') return true;
    return item.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  const totalEnrolled = lists.reduce((acc, curr) => acc + curr.recipient_count, 0);
  const totalVolume = lists.reduce((acc, curr) => acc + curr.total_amount, 0);

  const handleDuplicateList = async (list: PaymentList) => {
    setDuplicatingId(list.id);
    try {
      const cloned = await api.duplicatePaymentList(list.id);
      toast({
        type: 'success',
        title: 'Payment List Duplicated',
        message: `${cloned.name} created with ${cloned.recipient_count} enrolled recipients ready for next month's run.`,
      });
      await loadLists();
    } catch (err: any) {
      toast({ type: 'error', title: 'Duplication Failed', message: err.message });
    } finally {
      setDuplicatingId(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedForDelete) return;
    setDeleting(true);
    try {
      await api.deletePaymentList(selectedForDelete.id);
      toast({
        type: 'info',
        title: 'Payment List Deleted',
        message: `${selectedForDelete.name} has been removed.`,
      });
      setSelectedForDelete(null);
      await loadLists();
    } catch (err: any) {
      toast({ type: 'error', title: 'Delete Failed', message: err.message });
    } finally {
      setDeleting(false);
    }
  };

  const handleCreateListSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const created = await api.createPaymentList({
        name: newName,
        category: newCategory,
        recipient_count: Number(newCount),
        total_amount: Number(newAmount),
        currency: 'GH₵',
        description: newDescription,
      });

      toast({
        type: 'success',
        title: 'Reusable Payment List Created',
        message: `${created.name} (${created.recipient_count} recipients) is ready for recurring execution.`,
      });

      setIsCreateOpen(false);
      setNewName('');
      setNewDescription('');
      await loadLists();
    } catch (err: any) {
      toast({
        type: 'error',
        title: 'Failed to create payment list',
        message: err.message,
      });
    } finally {
      setCreating(false);
    }
  };

  const getCategoryIcon = (category: PaymentListCategory) => {
    switch (category) {
      case 'Employees':
        return <Users className="w-5 h-5 text-indigo-500" />;
      case 'Suppliers':
        return <Truck className="w-5 h-5 text-emerald-500" />;
      case 'Contractors':
        return <Briefcase className="w-5 h-5 text-blue-500" />;
      case 'Vendors':
        return <Building className="w-5 h-5 text-amber-500" />;
      default:
        return <FileCheck2 className="w-5 h-5 text-slate-500" />;
    }
  };

  const getCategoryBadgeVariant = (category: PaymentListCategory): 'blue' | 'emerald' | 'amber' | 'gold' | 'slate' => {
    switch (category) {
      case 'Employees':
        return 'blue';
      case 'Suppliers':
        return 'emerald';
      case 'Contractors':
        return 'gold';
      case 'Vendors':
        return 'amber';
      default:
        return 'slate';
    }
  };

  return (
    <DashboardLayoutWrapper>
      <PageShell
        title="Payment Lists"
        subtitle="Payment Lists allow businesses to manage reusable groups of recipients."
        badge={<BusinessVerificationBadge size="sm" />}
        action={
          <div className="flex flex-wrap items-center gap-2.5">
            <PrivacyToggle size="md" />
            <Button
              variant="outline"
              onClick={() => setIsImportOpen(true)}
              className="gap-2 font-bold text-xs shadow-subtle border-slate-300 dark:border-navy-700 hover:border-emerald-500/80"
            >
              <Upload className="w-3.5 h-3.5 text-emerald-400" /> Import Payment List (.csv / .xlsx)
            </Button>
            <Button
              variant="primary"
              onClick={() => setIsCreateOpen(true)}
              className="gap-2 font-black text-xs bg-emerald-500 hover:bg-emerald-400 text-navy-950 shadow-md shadow-emerald-500/20"
            >
              <Plus className="w-4 h-4" /> Create Payment List
            </Button>
          </div>
        }
      >
        {loading ? (
          <div className="space-y-6">
            <MetricCardSkeleton count={4} />
            <CardSkeleton count={3} />
          </div>
        ) : error ? (
          <ErrorState
            title="Something went wrong."
            message={error}
            onRetry={loadLists}
          />
        ) : (
          <div className="space-y-6">
            {/* Summary Metric Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-4 bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  Reusable Payment Lists
                </span>
                <p className="text-2xl font-black text-navy-950 dark:text-white mt-1 tabular-nums">
                  {lists.length} Active Lists
                </p>
                <span className="text-[11px] text-yellow-600 dark:text-yellow-400 font-bold mt-1 block">
                  Across 5 Enterprise Categories
                </span>
              </Card>

              <Card className="p-4 bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  Total Enrolled Recipients
                </span>
                <p className="text-2xl font-black text-navy-950 dark:text-white mt-1 tabular-nums">
                  {totalEnrolled} Recipients
                </p>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Pre-Flight Verified
                </span>
              </Card>

              <Card className="p-4 bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  Total Enrolled Volume
                </span>
                <p className="text-2xl font-black text-navy-950 dark:text-white mt-1 tabular-nums">
                  {formatAmount(totalVolume, 'GH₵')}
                </p>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
                  Multi-Rail Payout Value
                </span>
              </Card>

              <Card className="p-4 bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  Execution Model
                </span>
                <p className="text-base font-black text-navy-950 dark:text-white mt-2">
                  1-Click Group Payout
                </p>
                <span className="text-[11px] text-blue-600 dark:text-blue-400 font-bold block">
                  Simulated Multi-Rail Rails
                </span>
              </Card>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-navy-800 text-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase mr-1 shrink-0 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Category:
              </span>
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat;
                const count =
                  cat === 'All'
                    ? lists.length
                    : lists.filter((l) => l.category.toLowerCase() === cat.toLowerCase()).length;

                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    type="button"
                    className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-navy-900 text-yellow-400 dark:bg-yellow-400 dark:text-navy-950 shadow-sm'
                        : 'bg-slate-100 dark:bg-navy-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-navy-850'
                    }`}
                  >
                    <span>{cat}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                        isSelected
                          ? 'bg-yellow-500/20 text-yellow-300 dark:bg-navy-950/20 dark:text-navy-950'
                          : 'bg-slate-200 dark:bg-navy-800 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Payment Lists Cards Grid or Empty State */}
            {filteredLists.length === 0 ? (
              <EmptyState
                icon={ListTodo}
                title="No payment lists found"
                description={
                  selectedCategory === 'All'
                    ? "You haven't created or imported any payment lists yet."
                    : `No payment lists found in category "${selectedCategory}".`
                }
                actionLabel="Create Payment List"
                onAction={() => setIsCreateOpen(true)}
                secondaryActionLabel="Import CSV / Excel"
                onSecondaryAction={() => setIsImportOpen(true)}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredLists.map((list) => {
                  return (
                    <Card
                      key={list.id}
                      className="p-6 bg-white dark:bg-navy-900 border-2 border-slate-200 dark:border-navy-800 hover:border-yellow-500/50 dark:hover:border-yellow-500/40 transition-all flex flex-col justify-between shadow-subtle hover:shadow-modal"
                    >
                      <div className="space-y-4">
                        {/* Header: Category & Reusable Pill */}
                        <div className="flex items-center justify-between gap-2">
                          <Badge variant={getCategoryBadgeVariant(list.category)} size="sm">
                            {list.category}
                          </Badge>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-navy-950 text-slate-600 dark:text-slate-400 font-bold border border-slate-200 dark:border-navy-800">
                            Reusable Group
                          </span>
                        </div>

                        {/* Title and Icon */}
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl bg-yellow-100 dark:bg-yellow-950/60 flex items-center justify-center shrink-0 border border-yellow-300 dark:border-yellow-700/60">
                            {getCategoryIcon(list.category)}
                          </div>
                          <div>
                            <h3 className="font-extrabold text-base text-navy-950 dark:text-slate-100 leading-snug">
                              {list.name}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5 font-medium">
                              <Users className="w-3.5 h-3.5 text-slate-400" />
                              <strong className="text-navy-950 dark:text-slate-200 font-bold font-mono">
                                {list.recipient_count} recipients
                              </strong>
                            </p>
                          </div>
                        </div>

                        {/* Prominent Amount Box */}
                        <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                            Total Group Payout
                          </span>
                          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 tabular-nums font-mono">
                            {formatAmount(list.total_amount, list.currency)}
                          </p>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-1">
                            Est. avg {formatAmount(Math.round(list.total_amount / (list.recipient_count || 1)), list.currency)} / recipient
                          </span>
                        </div>

                        {/* Description */}
                        {list.description && (
                          <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                            {list.description}
                          </p>
                        )}

                        {/* Pre-flight verification notice */}
                        <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold pt-1">
                          <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                          <span>Subscriber names verified via telecom KYC enquiries</span>
                        </div>
                      </div>

                      {/* Actions Bottom Bar */}
                      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-navy-800/80 space-y-2.5">
                        {/* Make Payment Button */}
                        <Button
                          variant="primary"
                          className="w-full font-black text-xs gap-2 py-2.5 shadow-subtle bg-emerald-600 hover:bg-emerald-700 text-white"
                          onClick={() => setSelectedForPayment(list)}
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          Make Payment
                        </Button>

                        {/* Open List Button */}
                        <Button
                          variant="outline"
                          className="w-full text-xs font-bold gap-2 border-slate-300 dark:border-navy-700 hover:border-yellow-500/80"
                          onClick={() => setSelectedForOpen(list)}
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-yellow-500" />
                          Open List (Update Amounts & Members)
                        </Button>

                        {/* Duplicate, Edit, Delete Toolbar */}
                        <div className="flex items-center justify-between pt-2 text-xs border-t border-slate-100 dark:border-navy-850">
                          <button
                            type="button"
                            onClick={() => handleDuplicateList(list)}
                            disabled={duplicatingId === list.id}
                            className="text-slate-500 dark:text-slate-400 hover:text-navy-950 dark:hover:text-yellow-400 font-bold flex items-center gap-1.5 transition-colors"
                            title="Duplicate List for next month"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>{duplicatingId === list.id ? 'Duplicating...' : 'Duplicate List'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setSelectedForOpen(list)}
                            className="text-slate-500 dark:text-slate-400 hover:text-navy-950 dark:hover:text-yellow-400 font-bold flex items-center gap-1.5 transition-colors"
                            title="Edit List"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit List</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setSelectedForDelete(list)}
                            className="text-slate-400 hover:text-rose-600 font-bold flex items-center gap-1 transition-colors"
                            title="Delete List"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Inspect Recipients Modal */}
        <Modal
          isOpen={Boolean(inspectingList)}
          onClose={() => setInspectingList(null)}
          title={inspectingList?.name || 'Payment List Recipients'}
          description={`${inspectingList?.recipient_count} enrolled beneficiaries in category ${inspectingList?.category}`}
          maxWidth="lg"
        >
          {inspectingList && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Volume</span>
                  <span className="text-lg font-black text-navy-950 dark:text-yellow-400 tabular-nums">
                    {formatCurrency(inspectingList.total_amount, inspectingList.currency)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant={getCategoryBadgeVariant(inspectingList.category)} size="sm">
                    {inspectingList.category}
                  </Badge>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 100% Pre-Flight Passed
                  </span>
                </div>
              </div>

              {/* Sample Recipients Table */}
              <div className="overflow-x-auto border border-slate-200 dark:border-navy-800 rounded-xl">
                <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                  <thead className="bg-slate-50 dark:bg-navy-950 text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-navy-800">
                    <tr>
                      <th className="py-2.5 px-3">Beneficiary Name</th>
                      <th className="py-2.5 px-3">Rail & Account</th>
                      <th className="py-2.5 px-3">Role / Item</th>
                      <th className="py-2.5 px-3 text-right">Amount</th>
                      <th className="py-2.5 px-3 text-center">KYC Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-navy-850">
                    {(inspectingList.sample_recipients || []).map((rec) => (
                      <tr key={rec.id} className="hover:bg-slate-50 dark:hover:bg-navy-850/40">
                        <td className="py-2.5 px-3 font-bold text-navy-950 dark:text-slate-100">
                          {rec.name}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-[11px]">
                          {rec.channel} • {rec.account_identifier}
                        </td>
                        <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">
                          {rec.role_or_item || 'Standard Line Item'}
                        </td>
                        <td className="py-2.5 px-3 text-right font-black text-navy-950 dark:text-slate-100 tabular-nums">
                          {formatCurrency(rec.amount, inspectingList.currency)}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold border border-emerald-200 dark:border-emerald-800">
                            <CheckCircle2 className="w-3 h-3" /> Verified
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-xs text-slate-400">
                  Showing verified members of {inspectingList.name}
                </span>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setSelectedForPayment(inspectingList);
                    setInspectingList(null);
                  }}
                  className="gap-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <Play className="w-3.5 h-3.5 fill-current" /> Make Payment to {inspectingList.recipient_count} Recipients
                </Button>
              </div>
            </div>
          )}
        </Modal>

        {/* Create Payment List Modal */}
        <Modal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          title="Create Reusable Payment List"
          description="Define a reusable group of recipients for recurring bulk payouts."
          maxWidth="md"
        >
          <form onSubmit={handleCreateListSubmit} className="space-y-4">
            <Input
              label="Payment List Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. October Logistics Contractors"
              required
            />

            <Select
              label="Recipient Category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value as PaymentListCategory)}
              options={[
                { value: 'Employees', label: 'Employees' },
                { value: 'Suppliers', label: 'Suppliers' },
                { value: 'Contractors', label: 'Contractors' },
                { value: 'Vendors', label: 'Vendors' },
                { value: 'Other beneficiaries', label: 'Other beneficiaries' },
              ]}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Number of Recipients"
                type="number"
                value={newCount}
                onChange={(e) => setNewCount(Number(e.target.value))}
                required
              />

              <Input
                label="Total Group Amount (GH₵)"
                type="number"
                value={newAmount}
                onChange={(e) => setNewAmount(Number(e.target.value))}
                required
              />
            </div>

            <Input
              label="List Description / Operational Memo"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="e.g. Recurring mid-month payments for regional logistics contractors"
            />

            <div className="p-3 bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 rounded-xl text-xs space-y-1">
              <div className="flex justify-between font-medium">
                <span className="text-slate-500">Currency:</span>
                <span className="font-bold text-navy-950 dark:text-white">Ghanaian Cedi (GH₵)</span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-slate-500">Group Nature:</span>
                <span className="font-bold text-yellow-600 dark:text-yellow-400">Reusable Group</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)} className="text-xs">
                Cancel
              </Button>
              <Button type="submit" variant="primary" isLoading={creating} className="text-xs font-bold">
                Create Payment List
              </Button>
            </div>
          </form>
        </Modal>

        {/* Import Payment List Modal (.csv / .xlsx) */}
        <ImportPaymentListModal
          isOpen={isImportOpen}
          onClose={() => setIsImportOpen(false)}
          onSuccess={loadLists}
        />

        {/* Open List Drawer (Month-over-month update without re-uploading file) */}
        <OpenListDrawer
          isOpen={Boolean(selectedForOpen)}
          onClose={() => setSelectedForOpen(null)}
          paymentList={selectedForOpen}
          onUpdated={loadLists}
        />

        {/* Pre-Payment Recipient Verification Modal (Anti-Fraud Trust Feature) */}
        <PrePaymentVerificationModal
          isOpen={Boolean(selectedForPayment)}
          onClose={() => setSelectedForPayment(null)}
          paymentList={selectedForPayment}
          onPaymentSuccess={loadLists}
        />

        {/* Delete Confirmation Modal using ConfirmDialog */}
        <ConfirmDialog
          isOpen={Boolean(selectedForDelete)}
          onClose={() => setSelectedForDelete(null)}
          onConfirm={handleConfirmDelete}
          title="Delete Payment List"
          description={`Are you sure you want to delete "${selectedForDelete?.name}"? This will permanently remove the list and all ${selectedForDelete?.recipient_count} enrolled recipient records.`}
          confirmLabel="Delete List"
          variant="danger"
          isLoading={deleting}
        />
      </PageShell>
    </DashboardLayoutWrapper>
  );
}
