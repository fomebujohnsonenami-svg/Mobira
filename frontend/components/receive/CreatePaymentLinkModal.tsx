'use client';

import React, { useState } from 'react';
import { QrCode, Plus, Calendar, Hash, ToggleLeft, ToggleRight, ShieldCheck } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { BusinessVerificationBadge } from '@/components/verification/BusinessVerificationBadge';
import { api } from '@/services/api';
import { useToast } from '@/components/ui/Toast';
import { PaymentLink } from '@/types';

export interface CreatePaymentLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (link: PaymentLink) => void;
}

export const CreatePaymentLinkModal: React.FC<CreatePaymentLinkModalProps> = ({
  isOpen,
  onClose,
  onCreated,
}) => {
  const { toast } = useToast();
  const [title, setTitle] = useState('Premium Dress');
  const [description, setDescription] = useState('Bespoke handcrafted African evening couture');
  const [amount, setAmount] = useState<string>('350');
  const [reference, setReference] = useState('REF-2026-FASHION-01');
  const [expiry, setExpiry] = useState('2026-10-31');
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const link = await api.createPaymentLink({
        title,
        description,
        amount: amount ? Number(amount) : null,
        currency: 'GH₵',
        reference,
        expiry,
        is_active: isActive,
      });

      toast({
        type: 'success',
        title: 'Payment Link Created',
        message: `Ready to collect payments at /customer/${link.slug}`,
      });

      onCreated(link);
      onClose();
    } catch (err: any) {
      toast({
        type: 'error',
        title: 'Failed to create payment link',
        message: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Payment Link"
      description="Create a branded, shareable payment link with pre-flight identity verification."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Merchant Indicator */}
        <div className="p-3 bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 rounded-xl flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-slate-400">Issuing Merchant:</span>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-navy-950 dark:text-white">ABC Fashion</span>
            <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-black flex items-center justify-center">✓</span>
          </div>
        </div>

        {/* 1. Title */}
        <Input
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Premium Dress"
          required
        />

        {/* 2. Description */}
        <Input
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="e.g. Handcrafted bespoke couture"
        />

        {/* 3. Amount */}
        <Input
          label="Amount (GH₵)"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="350"
          helperText="Customer will pay this exact amount."
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* 4. Reference */}
          <Input
            label="Reference"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="e.g. REF-2026-FASHION-01"
            required
          />

          {/* 5. Expiry */}
          <Input
            label="Expiry Date"
            type="date"
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
            required
          />
        </div>

        {/* 6. Active / Inactive Toggle */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-extrabold text-navy-950 dark:text-white block">
              Payment Link Status
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              {isActive ? 'Link is active and accepting customer payments' : 'Link is deactivated / paused'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsActive(!isActive)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
              isActive
                ? 'bg-emerald-500 text-white'
                : 'bg-slate-200 dark:bg-navy-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            {isActive ? 'Active' : 'Inactive'}
          </button>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-200 dark:border-navy-800">
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={loading}
            className="gap-1.5 text-xs font-black uppercase tracking-wider bg-yellow-500 hover:bg-yellow-400 text-navy-950"
          >
            <Plus className="w-3.5 h-3.5" /> Save Payment Link
          </Button>
        </div>
      </form>
    </Modal>
  );
};
