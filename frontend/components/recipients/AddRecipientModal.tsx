'use client';

import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { api } from '@/services/api';
import { useToast } from '@/components/ui/Toast';
import { Recipient, PaymentChannel } from '@/types';

export interface AddRecipientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdded: (recipient: Recipient) => void;
}

export const AddRecipientModal: React.FC<AddRecipientModalProps> = ({
  isOpen,
  onClose,
  onAdded,
}) => {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [channel, setChannel] = useState<PaymentChannel>('MTN_MOMO');
  const [account, setAccount] = useState('');
  const [category, setCategory] = useState<any>('SUPPLIER');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const rec = await api.createRecipient({
        name,
        channel,
        account_identifier: account,
        category,
      });

      toast({
        type: 'success',
        title: 'Beneficiary Enrolled',
        message: `${name} added to verified directory.`,
      });

      onAdded(rec);
      onClose();
      setName('');
      setAccount('');
    } catch (err: any) {
      toast({
        type: 'error',
        title: 'Failed to add beneficiary',
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
      title="Enroll New Beneficiary"
      description="Add a verified vendor, supplier, or employee to your directory."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Beneficiary Legal / Business Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Douala Organic Supplies SARL"
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Payment Rail"
            value={channel}
            onChange={(e) => setChannel(e.target.value as PaymentChannel)}
            options={[
              { value: 'MTN_MOMO', label: 'MTN Mobile Money' },
              { value: 'ORANGE_MONEY', label: 'Orange Money' },
              { value: 'BANK_TRANSFER', label: 'Interbank EFT' },
            ]}
          />

          <Select
            label="Classification"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={[
              { value: 'SUPPLIER', label: 'Supplier / Vendor' },
              { value: 'EMPLOYEE', label: 'Employee / Staff' },
              { value: 'CONTRACTOR', label: 'Contractor / Logistics' },
            ]}
          />
        </div>

        <Input
          label="Account Identifier / Phone / IBAN"
          value={account}
          onChange={(e) => setAccount(e.target.value)}
          placeholder="+237 670 000 111"
          required
        />

        <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-200 dark:border-navy-800">
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" isLoading={loading} className="gap-1.5 text-xs font-bold">
            <UserPlus className="w-3.5 h-3.5" /> Save Beneficiary
          </Button>
        </div>
      </form>
    </Modal>
  );
};
