'use client';

import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Building2,
  Plus,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Zap,
  Lock,
  RotateCcw,
  Check,
  Globe,
  Layers,
  Radio,
  Trash2,
  Sparkles,
  Eye,
  EyeOff,
} from 'lucide-react';
import { DashboardLayoutWrapper } from '@/components/layout/DashboardLayoutWrapper';
import { PageShell } from '@/components/layout/PageShell';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { ErrorState } from '@/components/ui/ErrorState';
import { EmptyState } from '@/components/ui/EmptyState';
import { CardSkeleton } from '@/components/ui/LoadingState';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useToast } from '@/components/ui/Toast';
import { BusinessVerificationBadge } from '@/components/verification/BusinessVerificationBadge';
import { usePrivacy, PrivacyToggle } from '@/components/privacy/PrivacyContext';
import { api } from '@/services/api';
import { ConnectedAccount } from '@/types';
import { formatCurrency } from '@/lib/formatters';

export default function ConnectedAccountsPage() {
  const { toast } = useToast();
  const { isBlinded, togglePrivacy, formatAmount } = usePrivacy();

  const [accounts, setAccounts] = useState<ConnectedAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Connect Modal State
  const [isConnectOpen, setIsConnectOpen] = useState(false);
  const [providerName, setProviderName] = useState('MTN_MOMO');
  const [accountName, setAccountName] = useState('MTN MoMo Business');
  const [accountIdentifier, setAccountIdentifier] = useState('+233 24 123 4821');
  const [isPrimary, setIsPrimary] = useState(false);
  const [connecting, setConnecting] = useState(false);

  // Disconnect Confirmation State
  const [selectedForDisconnect, setSelectedForDisconnect] = useState<ConnectedAccount | null>(null);
  const [disconnecting, setDisconnecting] = useState(false);

  const loadAccounts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getConnectedAccounts();
      setAccounts(data);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to load connected accounts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  const handleProviderSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setProviderName(val);
    if (val === 'MTN_MOMO') {
      setAccountName('MTN MoMo Business');
      setAccountIdentifier('+233 24 123 4821');
    } else if (val === 'BANK_TRANSFER') {
      setAccountName('Business Bank Account');
      setAccountIdentifier('GCB-0104-9184-001');
    } else if (val === 'ORANGE_MONEY') {
      setAccountName('Vodafone Cash Business');
      setAccountIdentifier('+233 20 999 5566');
    }
  };

  const handleConnectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setConnecting(true);
    try {
      const created = await api.connectAccount({
        provider_name: providerName,
        account_name: accountName,
        account_identifier: accountIdentifier,
        is_primary: isPrimary,
      });

      setAccounts((prev) => {
        if (created.is_primary) {
          return [...prev.map((a) => ({ ...a, is_primary: false })), created];
        }
        return [...prev, created];
      });

      toast({
        type: 'success',
        title: 'Account Connected (Simulated)',
        message: `${accountName} successfully authorized via Mobira Provider Adapter.`,
      });

      setIsConnectOpen(false);
    } catch (err: any) {
      toast({
        type: 'error',
        title: 'Connection Failed',
        message: err?.message || 'Unable to connect account.',
      });
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnectConfirm = async () => {
    if (!selectedForDisconnect) return;
    setDisconnecting(true);
    try {
      await api.disconnectAccount(selectedForDisconnect.id);
      setAccounts((prev) => prev.filter((a) => a.id !== selectedForDisconnect.id));
      toast({
        type: 'info',
        title: 'Account Disconnected',
        message: `${selectedForDisconnect.account_name} has been safely removed.`,
      });
      setSelectedForDisconnect(null);
    } catch (err: any) {
      toast({
        type: 'error',
        title: 'Disconnection Failed',
        message: err?.message || 'Unable to disconnect account.',
      });
    } finally {
      setDisconnecting(false);
    }
  };

  const handleSetPrimary = async (acc: ConnectedAccount) => {
    try {
      await api.setPrimaryAccount(acc.id);
      setAccounts((prev) =>
        prev.map((a) => ({
          ...a,
          is_primary: a.id === acc.id,
        }))
      );
      toast({
        type: 'success',
        title: 'Primary Rail Updated',
        message: `${acc.account_name} is now the default settlement destination.`,
      });
    } catch (err: any) {
      toast({
        type: 'error',
        title: 'Failed to update primary rail',
        message: err?.message,
      });
    }
  };

  return (
    <DashboardLayoutWrapper>
      <PageShell
        title="Connected Payment Accounts"
        subtitle="Manage authorized mobile money wallets and commercial bank accounts attached to your verified corporate identity."
        badge={<BusinessVerificationBadge size="md" />}
        action={
          <div className="flex items-center gap-3">
            <PrivacyToggle size="md" />
            <Button
              variant="primary"
              onClick={() => setIsConnectOpen(true)}
              className="gap-2 font-black text-xs bg-emerald-500 hover:bg-emerald-400 text-navy-950 shadow-md shadow-emerald-500/20"
            >
              <Plus className="w-4 h-4" /> Connect Payment Account
            </Button>
          </div>
        }
      >
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <CardSkeleton count={2} />
          </div>
        ) : error ? (
          <ErrorState
            title="Could not load connected accounts"
            message={error}
            onRetry={loadAccounts}
          />
        ) : (
          <div className="space-y-6">
            {/* Architecture Card */}
            <div className="p-6 rounded-2xl bg-[#08162B]/90 backdrop-blur-xl border border-emerald-500/20 shadow-xl shadow-black/20">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="space-y-2 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-black uppercase tracking-wider">
                      Provider Adapter Architecture
                    </span>
                    <span className="text-xs text-slate-400 font-bold">• Part 36</span>
                  </div>
                  <h3 className="text-lg font-black text-white">
                    Simulated Multi-Rail Orchestration
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Mobira operates as an enterprise orchestration and trust layer interfacing with authorized financial institutions and mobile networks through unified provider adapters.
                  </p>
                </div>

                {/* Pipeline Steps */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 shrink-0">
                  <div className="p-3 rounded-xl bg-navy-950/80 border border-emerald-500/30 text-center min-w-[110px]">
                    <span className="text-[10px] font-bold text-emerald-400 block uppercase">Layer 1</span>
                    <strong className="text-xs text-white block mt-0.5">Mobira Core</strong>
                    <span className="text-[9px] text-slate-400">Identity & Rules</span>
                  </div>

                  <ArrowRight className="w-4 h-4 text-emerald-400 shrink-0" />

                  <div className="p-3 rounded-xl bg-navy-950/80 border border-slate-700 text-center min-w-[125px]">
                    <span className="text-[10px] font-bold text-slate-300 block uppercase">Layer 2</span>
                    <strong className="text-xs text-white block mt-0.5">Orchestration</strong>
                    <span className="text-[9px] text-slate-400">Maker-Checker</span>
                  </div>

                  <ArrowRight className="w-4 h-4 text-emerald-400 shrink-0" />

                  <div className="p-3 rounded-xl bg-emerald-500 text-navy-950 font-bold text-center min-w-[125px] shadow-lg shadow-emerald-500/20">
                    <span className="text-[10px] uppercase block tracking-tight font-black">Rails</span>
                    <strong className="text-xs block mt-0.5">MTN / Bank / PSP</strong>
                    <span className="text-[9px] opacity-80">Connected Rails</span>
                  </div>
                </div>
              </div>

              {/* Zero Credentials Callout */}
              <div className="mt-5 pt-4 border-t border-navy-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    <strong className="text-white">Zero Financial Secrets Stored:</strong> No PINs, passwords, or OTPs accepted.
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold">
                  Secret Separation Active
                </span>
              </div>
            </div>

            {/* Connected Accounts Grid */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-black text-white">
                    Active Authorized Accounts
                  </h2>
                  <p className="text-xs text-slate-400">
                    Payment channels connected to your Mobira corporate entity
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-slate-400">
                  {accounts.length} Connected {accounts.length === 1 ? 'Rail' : 'Rails'}
                </span>
              </div>

              {accounts.length === 0 ? (
                <EmptyState
                  icon={Zap}
                  title="No connected accounts found"
                  description="Connect your MTN MoMo Business, Bank Account, or mobile wallet adapter."
                  actionLabel="Connect Payment Account"
                  onAction={() => setIsConnectOpen(true)}
                  variant="card"
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {accounts.map((acc) => {
                    const isMoMo = acc.provider_type === 'MOBILE_MONEY' || acc.provider_name.includes('MOMO');

                    return (
                      <div
                        key={acc.id}
                        className={`p-6 rounded-2xl relative overflow-hidden transition-all duration-200 border ${
                          acc.is_primary
                            ? 'border-emerald-500/40 shadow-xl shadow-emerald-950/20 bg-[#08162B]/90 backdrop-blur-xl'
                            : 'border-slate-800 bg-[#08162B]/70 hover:border-slate-700'
                        }`}
                      >
                        {/* Top Status & Header */}
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
                                isMoMo
                                  ? 'bg-emerald-500 text-navy-950 border-emerald-600/50 shadow-md shadow-emerald-500/20'
                                  : 'bg-navy-950 text-white border-slate-700 shadow-sm'
                              }`}
                            >
                              {isMoMo ? (
                                <Smartphone className="w-6 h-6 stroke-[2.2]" />
                              ) : (
                                <Building2 className="w-6 h-6 stroke-[2.2] text-sky-400" />
                              )}
                            </div>

                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-extrabold text-base text-white">
                                  {acc.account_name}
                                </h3>
                                {acc.is_primary && (
                                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black uppercase tracking-tight">
                                    Primary Rail
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-slate-400">
                                {isMoMo ? 'Mobile Money Merchant Wallet' : 'Commercial Clearing Account'}
                              </span>
                            </div>
                          </div>

                          {/* Connected Status Pill */}
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-bold shrink-0">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            Connected
                          </span>
                        </div>

                        {/* Masked Account Number & Balance Limit */}
                        <div className="my-5 p-4 rounded-xl bg-navy-950/80 border border-slate-800 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                              Masked Identifier
                            </span>
                            <p className="text-xl font-mono font-black text-white tracking-wider mt-0.5">
                              {acc.masked_number}
                            </p>
                          </div>

                          <div className="text-right">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                              Daily Volume Limit
                            </span>
                            <p className="text-xs font-mono font-bold text-emerald-400 mt-0.5">
                              {formatAmount(acc.daily_limit || 5000000)}
                            </p>
                          </div>
                        </div>

                        {/* Capabilities Tags */}
                        <div className="space-y-2 text-xs">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-2 py-0.5 rounded-md bg-navy-950 text-slate-300 text-[11px] font-medium flex items-center gap-1 border border-navy-800">
                              <Check className="w-3 h-3 text-emerald-400" /> Instant Disburse
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-navy-950 text-slate-300 text-[11px] font-medium flex items-center gap-1 border border-navy-800">
                              <Check className="w-3 h-3 text-emerald-400" /> QR Collections
                            </span>
                            {isMoMo ? (
                              <span className="px-2 py-0.5 rounded-md bg-navy-950 text-slate-300 text-[11px] font-medium flex items-center gap-1 border border-navy-800">
                                <Check className="w-3 h-3 text-emerald-400" /> Telecom Pre-flight KYC
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-md bg-navy-950 text-slate-300 text-[11px] font-medium flex items-center gap-1 border border-navy-800">
                                <Check className="w-3 h-3 text-emerald-400" /> Maker-Checker Dual Auth
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Bottom Actions */}
                        <div className="mt-5 pt-4 border-t border-navy-800/80 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            {!acc.is_primary && (
                              <button
                                type="button"
                                onClick={() => handleSetPrimary(acc)}
                                className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                              >
                                Set as Primary
                              </button>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => setSelectedForDisconnect(acc)}
                            className="text-xs text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Disconnect</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Connect Modal */}
        <Modal
          isOpen={isConnectOpen}
          onClose={() => setIsConnectOpen(false)}
          title="Connect Payment Account (Simulated)"
        >
          <form onSubmit={handleConnectSubmit} className="space-y-4">
            <Select
              label="Payment Rail / Adapter"
              value={providerName}
              onChange={handleProviderSelectChange}
              options={[
                { value: 'MTN_MOMO', label: 'MTN Mobile Money Business' },
                { value: 'BANK_TRANSFER', label: 'Commercial Bank Account (GCB / Ecobank)' },
                { value: 'ORANGE_MONEY', label: 'Vodafone Cash / Orange Money' },
              ]}
            />

            <Input
              label="Account Label"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              placeholder="e.g. MTN MoMo Treasury"
              required
            />

            <Input
              label="Account Identifier / Number"
              value={accountIdentifier}
              onChange={(e) => setAccountIdentifier(e.target.value)}
              placeholder="+233 24 123 4821"
              required
            />

            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={isPrimary}
                onChange={(e) => setIsPrimary(e.target.checked)}
                className="rounded border-slate-700 bg-navy-950 text-emerald-500 focus:ring-emerald-500"
              />
              <span>Set as primary disbursement rail</span>
            </label>

            <div className="pt-3 flex items-center justify-end gap-2 border-t border-navy-800">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsConnectOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={connecting}
                className="bg-emerald-500 hover:bg-emerald-400 text-navy-950 font-bold"
              >
                Connect Account
              </Button>
            </div>
          </form>
        </Modal>

        {/* Disconnect Confirmation Dialog */}
        <ConfirmDialog
          isOpen={!!selectedForDisconnect}
          onClose={() => setSelectedForDisconnect(null)}
          onConfirm={handleDisconnectConfirm}
          title="Disconnect Payment Account"
          description={`Are you sure you want to disconnect ${selectedForDisconnect?.account_name}? You will not be able to disburse or collect on this rail until reconnected.`}
          confirmLabel="Disconnect Rail"
          variant="danger"
          isLoading={disconnecting}
        />
      </PageShell>
    </DashboardLayoutWrapper>
  );
}
