'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Trash2,
  Check,
  Save,
  Pencil,
  ShieldCheck,
  RotateCcw,
  Users,
  Briefcase,
  AlertCircle,
  Building,
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useToast } from '@/components/ui/Toast';
import { PaymentList, PaymentListRecipient, PaymentListCategory } from '@/types';
import { formatCurrency } from '@/lib/formatters';
import { api } from '@/services/api';

export interface OpenListDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  paymentList: PaymentList | null;
  onUpdated: () => void;
}

const PROVIDER_OPTIONS = [
  { value: 'MTN MoMo', label: 'MTN MoMo' },
  { value: 'Orange Money', label: 'Orange Money' },
  { value: 'Bank Transfer', label: 'Bank Transfer' },
];

export const OpenListDrawer: React.FC<OpenListDrawerProps> = ({
  isOpen,
  onClose,
  paymentList,
  onUpdated,
}) => {
  const { toast } = useToast();
  const [listName, setListName] = useState('');
  const [description, setDescription] = useState('');
  const [recipients, setRecipients] = useState<PaymentListRecipient[]>([]);
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (paymentList) {
      setListName(paymentList.name);
      setDescription(paymentList.description || '');
      const raw = paymentList.recipients || paymentList.sample_recipients || [];
      // Normalize recipients
      const normalized: PaymentListRecipient[] = raw.map((r, idx) => ({
        id: r.id || `r_${idx}`,
        name: r.name,
        phone: r.phone || r.account_identifier || '024 112 3344',
        provider: r.provider || r.channel || 'MTN MoMo',
        account: r.account || r.account_identifier || '024 112 3344',
        amount: Number(r.amount) || 0,
        role_or_item: r.role_or_item || '',
        is_verified: r.is_verified !== false,
      }));
      setRecipients(normalized);
    }
  }, [paymentList]);

  if (!paymentList) return null;

  const handleUpdateRecipient = (id: string, updates: Partial<PaymentListRecipient>) => {
    setRecipients((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
    );
  };

  const handleAddRecipient = () => {
    const newRec: PaymentListRecipient = {
      id: `rec_new_${Date.now()}`,
      name: 'New Recipient',
      phone: '024 555 1234',
      provider: 'MTN MoMo',
      account: '024 555 1234',
      amount: 2500,
      role_or_item: 'Staff / Beneficiary',
      is_verified: true,
    };
    setRecipients((prev) => [newRec, ...prev]);
    setEditingRowId(newRec.id);
  };

  const handleDeleteRecipient = (id: string) => {
    setRecipients((prev) => prev.filter((r) => r.id !== id));
    toast({ type: 'info', title: 'Recipient Removed', message: 'Beneficiary removed from list.' });
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    try {
      await api.updatePaymentList(paymentList.id, {
        name: listName,
        description,
        recipients,
      });

      toast({
        type: 'success',
        title: 'List Changes Persisted',
        message: `${listName} updated (${recipients.length} recipients, ${formatCurrency(
          totalVolume,
          paymentList.currency
        )}). Ready for next month's payment run without re-uploading.`,
      });

      onUpdated();
      onClose();
    } catch (err: any) {
      toast({ type: 'error', title: 'Failed to Save', message: err.message });
    } finally {
      setSaving(false);
    }
  };

  const totalVolume = recipients.reduce((acc, r) => acc + (Number(r.amount) || 0), 0);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Manage List: ${paymentList.name}`}
      description="Update amounts, recipients, provider, and account information directly for this month's run."
      maxWidth="xl"
    >
      <div className="space-y-5">
        {/* Persistence Callout */}
        <div className="p-3.5 rounded-xl bg-yellow-50 dark:bg-yellow-950/40 border border-yellow-300 dark:border-yellow-700/60 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-yellow-600 dark:text-yellow-400 shrink-0" />
            <div>
              <strong className="text-yellow-950 dark:text-yellow-200 block font-bold">
                Reusable Recipient Group Management
              </strong>
              <span className="text-yellow-900/80 dark:text-yellow-300/80">
                You can adjust individual payroll amounts, add seasonal staff, or update provider accounts directly without re-uploading files.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="gold" size="sm">
              {paymentList.category}
            </Badge>
            <span className="text-xs font-mono font-bold text-navy-950 dark:text-white">
              {recipients.length} Recipients
            </span>
          </div>
        </div>

        {/* List Name & Description Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Payment List Name"
            value={listName}
            onChange={(e) => setListName(e.target.value)}
            placeholder="e.g. October Employee Payments"
            required
          />
          <Input
            label="Operational Memo / Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Monthly recurring salaries with updated overtime rates"
          />
        </div>

        {/* Recipients Table */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Enrolled Beneficiaries ({recipients.length})
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddRecipient}
              className="gap-1.5 text-xs font-bold text-navy-900 dark:text-white border-slate-300 dark:border-navy-700"
            >
              <Plus className="w-3.5 h-3.5" /> Add Recipient
            </Button>
          </div>

          <div className="border border-slate-200 dark:border-navy-800 rounded-xl overflow-hidden max-h-[340px] overflow-y-auto shadow-inner">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-100 dark:bg-navy-950 text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 sticky top-0 z-10 border-b border-slate-200 dark:border-navy-800">
                <tr>
                  <th className="py-2.5 px-3">Recipient Name</th>
                  <th className="py-2.5 px-3">Phone / Identifier</th>
                  <th className="py-2.5 px-3">Payment Provider</th>
                  <th className="py-2.5 px-3">Account Number</th>
                  <th className="py-2.5 px-3 text-right">Amount ({paymentList.currency})</th>
                  <th className="py-2.5 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-navy-850">
                {recipients.map((rec) => {
                  const isEditing = editingRowId === rec.id;

                  return (
                    <tr
                      key={rec.id}
                      className={
                        isEditing
                          ? 'bg-yellow-50/40 dark:bg-yellow-950/20'
                          : 'hover:bg-slate-50 dark:hover:bg-navy-850/40 transition-colors'
                      }
                    >
                      {/* Name */}
                      <td className="py-2 px-3">
                        {isEditing ? (
                          <input
                            type="text"
                            value={rec.name}
                            onChange={(e) => handleUpdateRecipient(rec.id, { name: e.target.value })}
                            className="w-full text-xs font-bold p-1 rounded border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-900"
                          />
                        ) : (
                          <div>
                            <span className="font-bold text-navy-950 dark:text-slate-100 block">
                              {rec.name}
                            </span>
                            {rec.role_or_item && (
                              <span className="text-[10px] text-slate-400 block">{rec.role_or_item}</span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Phone */}
                      <td className="py-2 px-3">
                        {isEditing ? (
                          <input
                            type="text"
                            value={rec.phone || ''}
                            onChange={(e) => handleUpdateRecipient(rec.id, { phone: e.target.value })}
                            className="w-full text-xs font-mono p-1 rounded border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-900"
                          />
                        ) : (
                          <span className="font-mono text-[11px] text-slate-600 dark:text-slate-300">
                            {rec.phone || '024 112 3344'}
                          </span>
                        )}
                      </td>

                      {/* Provider */}
                      <td className="py-2 px-3">
                        {isEditing ? (
                          <select
                            value={rec.provider || 'MTN MoMo'}
                            onChange={(e) => handleUpdateRecipient(rec.id, { provider: e.target.value })}
                            className="text-xs p-1 rounded border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-900"
                          >
                            {PROVIDER_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-navy-850 text-slate-700 dark:text-slate-300 text-[10px] font-bold">
                            {rec.provider || 'MTN MoMo'}
                          </span>
                        )}
                      </td>

                      {/* Account */}
                      <td className="py-2 px-3">
                        {isEditing ? (
                          <input
                            type="text"
                            value={rec.account || ''}
                            onChange={(e) => handleUpdateRecipient(rec.id, { account: e.target.value })}
                            className="w-full text-xs font-mono p-1 rounded border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-900"
                          />
                        ) : (
                          <span className="font-mono text-[11px] text-slate-600 dark:text-slate-300">
                            {rec.account || rec.phone || '—'}
                          </span>
                        )}
                      </td>

                      {/* Amount */}
                      <td className="py-2 px-3 text-right">
                        {isEditing ? (
                          <input
                            type="number"
                            value={rec.amount}
                            onChange={(e) => handleUpdateRecipient(rec.id, { amount: Number(e.target.value) })}
                            className="w-24 text-right text-xs font-black p-1 rounded border border-slate-300 dark:border-navy-700 bg-white dark:bg-navy-900"
                          />
                        ) : (
                          <span className="font-black text-navy-950 dark:text-slate-100 tabular-nums">
                            {formatCurrency(rec.amount, paymentList.currency)}
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-2 px-2 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => setEditingRowId(isEditing ? null : rec.id)}
                            className="p-1 rounded text-slate-400 hover:text-navy-950 dark:hover:text-white"
                            title={isEditing ? 'Done Editing' : 'Edit Recipient'}
                          >
                            {isEditing ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Pencil className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteRecipient(rec.id)}
                            className="p-1 rounded text-slate-400 hover:text-rose-500"
                            title="Delete Recipient"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Summary & Save */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-navy-800">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Updated Volume</span>
            <span className="text-xl font-black text-yellow-600 dark:text-yellow-400 tabular-nums">
              {formatCurrency(totalVolume, paymentList.currency)}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Button type="button" variant="outline" onClick={onClose} className="text-xs">
              Close
            </Button>
            <Button
              type="button"
              variant="primary"
              isLoading={saving}
              onClick={handleSaveChanges}
              className="gap-2 text-xs font-bold shadow-elevated"
            >
              <Save className="w-3.5 h-3.5" /> Save Updated List
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
