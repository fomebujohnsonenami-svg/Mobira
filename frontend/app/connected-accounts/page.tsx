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
import { api } from '@/services/api';
import { ConnectedAccount } from '@/types';
import { formatCurrency } from '@/lib/formatters';

export default function ConnectedAccountsPage() {
  const { toast } = useToast();
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

      toast({
        type: 'success',
        title: 'Authorized Account Connected',
        message: `${created.account_name} (${created.masked_number}) connected in demo mode.`,
      });

      setIsConnectOpen(false);
      loadAccounts();
    } catch (err: any) {
      toast({
        type: 'error',
        title: 'Connection Failed',
        message: err.message,
      });
    } finally {
      setConnecting(false);
    }
  };

  const handleSetPrimary = async (id: string, name: string) => {
    try {
      await api.setPrimaryAccount(id);
      toast({
        type: 'success',
        title: 'Primary Rail Updated',
        message: `${name} is now the default disbursement account.`,
      });
      loadAccounts();
    } catch (err: any) {
      toast({ type: 'error', title: 'Failed to update primary account', message: err.message });
    }
  };

  const handleConfirmDisconnect = async () => {
    if (!selectedForDisconnect) return;
    setDisconnecting(true);
    try {
      await api.disconnectAccount(selectedForDisconnect.id);
      toast({
        type: 'info',
        title: 'Account Disconnected',
        message: `${selectedForDisconnect.account_name} connection revoked.`,
      });
      setSelectedForDisconnect(null);
      loadAccounts();
    } catch (err: any) {
      toast({ type: 'error', title: 'Failed to disconnect account', message: err.message });
    } finally {
      setDisconnecting(false);
    }
  };

  return (
    <DashboardLayoutWrapper>
      <PageShell
        title="Connected Accounts"
        subtitle="Businesses can connect their existing authorized payment accounts and providers without exposing financial credentials."
        badge={<BusinessVerificationBadge size="sm" />}
        action={
          <Button
            variant="primary"
            onClick={() => setIsConnectOpen(true)}
            className="gap-2 font-bold text-xs shadow-elevated"
          >
            <Plus className="w-4 h-4" /> Connect Payment Account
          </Button>
        }
      >
        {loading ? (
          <div className="space-y-6">
            <CardSkeleton count={2} />
          </div>
        ) : error ? (
          <ErrorState title="Something went wrong." message={error} onRetry={loadAccounts} />
        ) : (
          <div className="space-y-6">
            {/* 1. Architecture Flow Breakdown */}
            <Card className="p-6 bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 border-2 border-yellow-500/20 text-white relative overflow-hidden shadow-modal">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-2 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-yellow-400 text-navy-950 text-[10px] font-black uppercase tracking-wider">
                      Decoupled Provider Architecture
                    </span>
                    <span className="text-xs text-slate-400 font-mono">PaymentProvider Interface</span>
                  </div>
                  <h3 className="text-lg font-black tracking-tight text-white">
                    Built on Existing Payment Infrastructure
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Mobira is <strong className="text-yellow-400">NOT a bank</strong>, <strong className="text-yellow-400">NOT a wallet</strong>, and <strong className="text-yellow-400">NOT a replacement for MoMo or banks</strong>. Mobira acts as an orchestration layer that interfaces with your existing authorized financial accounts via secure provider adapters.
                  </p>
                </div>

                {/* Step Pipeline Visualization */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 shrink-0">
                  <div className="p-3 rounded-xl bg-navy-900/90 border border-yellow-500/40 text-center min-w-[110px]">
                    <span className="text-[10px] font-bold text-yellow-400 block uppercase">Layer 1</span>
                    <strong className="text-xs text-white block mt-0.5">Mobira Core</strong>
                    <span className="text-[9px] text-slate-400">Identity & Rules</span>
                  </div>

                  <ArrowRight className="w-4 h-4 text-yellow-400 shrink-0" />

                  <div className="p-3 rounded-xl bg-navy-900/90 border border-slate-700 text-center min-w-[125px]">
                    <span className="text-[10px] font-bold text-blue-400 block uppercase">Layer 2</span>
                    <strong className="text-xs text-white block mt-0.5">Orchestration</strong>
                    <span className="text-[9px] text-slate-400">Maker-Checker dual sign</span>
                  </div>

                  <ArrowRight className="w-4 h-4 text-yellow-400 shrink-0" />

                  <div className="p-3 rounded-xl bg-navy-900/90 border border-blue-500/60 text-center min-w-[130px]">
                    <span className="text-[10px] font-bold text-emerald-400 block uppercase">Layer 3</span>
                    <strong className="text-xs text-white block mt-0.5">Provider Adapter</strong>
                    <span className="text-[9px] text-slate-400">PaymentProvider</span>
                  </div>

                  <ArrowRight className="w-4 h-4 text-yellow-400 shrink-0" />

                  <div className="p-3 rounded-xl bg-yellow-400 text-navy-950 font-bold text-center min-w-[125px] shadow-subtle">
                    <span className="text-[10px] uppercase block tracking-tight font-black">Rails</span>
                    <strong className="text-xs block mt-0.5">MTN / Bank / PSP</strong>
                    <span className="text-[9px] opacity-80">Mock Adapter (MVP)</span>
                  </div>
                </div>
              </div>

              {/* Zero Credentials Callout */}
              <div className="mt-5 pt-4 border-t border-navy-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    <strong className="text-white">Zero Real Financial Credentials Collected:</strong> No PINs, banking passwords, card numbers, or OTPs are ever accepted or stored.
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-950 border border-blue-800 text-blue-300 text-[11px] font-bold">
                  Frontend Secret Separation Active
                </span>
              </div>
            </Card>

            {/* 2. Connected Accounts Grid or Empty State */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-black text-navy-950 dark:text-slate-100">
                    Active Authorized Accounts
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Existing payment channels connected to your Mobira corporate entity
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
                      <Card
                        key={acc.id}
                        className={`p-6 relative overflow-hidden transition-all duration-200 border-2 ${
                          acc.is_primary
                            ? 'border-yellow-500/50 dark:border-yellow-500/40 shadow-modal bg-white dark:bg-navy-900'
                            : 'border-slate-200 dark:border-navy-800 bg-white dark:bg-navy-900 hover:border-slate-300'
                        }`}
                      >
                        {/* Top Status & Header */}
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${
                                isMoMo
                                  ? 'bg-yellow-400 text-navy-950 border-yellow-500/50 shadow-sm'
                                  : 'bg-navy-950 text-white border-slate-700 shadow-sm'
                              }`}
                            >
                              {isMoMo ? (
                                <Smartphone className="w-6 h-6 stroke-[2.2]" />
                              ) : (
                                <Building2 className="w-6 h-6 stroke-[2.2] text-yellow-400" />
                              )}
                            </div>

                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-extrabold text-base text-navy-950 dark:text-slate-100">
                                  {acc.account_name}
                                </h3>
                                {acc.is_primary && (
                                  <span className="px-2 py-0.5 rounded-md bg-yellow-100 dark:bg-yellow-950/60 text-yellow-800 dark:text-yellow-400 border border-yellow-300 dark:border-yellow-700/60 text-[10px] font-black uppercase tracking-tight">
                                    Primary Rail
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-slate-500 dark:text-slate-400">
                                {isMoMo ? 'Mobile Money Merchant Wallet' : 'Commercial Clearing Account'}
                              </span>
                            </div>
                          </div>

                          {/* Demo Connected Status Pill */}
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 text-xs font-bold shadow-subtle shrink-0">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            Demo Connected
                          </span>
                        </div>

                        {/* Masked Account Number */}
                        <div className="my-5 p-4 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                              Masked Identifier
                            </span>
                            <p className="text-2xl font-mono font-black text-navy-950 dark:text-white tracking-wider mt-0.5">
                              {acc.masked_number}
                            </p>
                          </div>

                          <div className="text-right">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                              Daily Volume Limit
                            </span>
                            <p className="text-xs font-mono font-bold text-yellow-600 dark:text-yellow-400 mt-0.5">
                              {formatCurrency(acc.daily_limit || 5000000)}
                            </p>
                          </div>
                        </div>

                        {/* Capabilities Tags */}
                        <div className="space-y-2 text-xs">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-navy-850 text-slate-700 dark:text-slate-300 text-[11px] font-medium flex items-center gap-1">
                              <Check className="w-3 h-3 text-emerald-500" /> Instant Disburse
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-navy-850 text-slate-700 dark:text-slate-300 text-[11px] font-medium flex items-center gap-1">
                              <Check className="w-3 h-3 text-emerald-500" /> QR Collections
                            </span>
                            {isMoMo ? (
                              <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-navy-850 text-slate-700 dark:text-slate-300 text-[11px] font-medium flex items-center gap-1">
                                <Check className="w-3 h-3 text-emerald-500" /> Telecom Pre-flight KYC
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-navy-850 text-slate-700 dark:text-slate-300 text-[11px] font-medium flex items-center gap-1">
                                <Check className="w-3 h-3 text-emerald-500" /> Maker-Checker Dual Auth
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Bottom Actions */}
                        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-navy-800/80 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            {!acc.is_primary && (
                              <button
                                type="button"
                                onClick={() => handleSetPrimary(acc.id, acc.account_name)}
                                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                              >
                                Set as Primary Rail
                              </button>
                            )}
                            {acc.is_primary && (
                              <span className="text-xs text-slate-400 flex items-center gap-1 font-semibold">
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Default Payout Rail
                              </span>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => setSelectedForDisconnect(acc)}
                            className="text-xs font-medium text-rose-500 hover:text-rose-600 flex items-center gap-1 transition-colors"
                            title="Disconnect Account"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Disconnect
                          </button>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 3. Available Providers / Expandable Adapters */}
            <Card className="p-6 bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-extrabold text-sm text-navy-950 dark:text-slate-100">
                    Supported Payment Rails & Provider Adapters
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Ready to link through the unified <code className="font-mono text-yellow-600 dark:text-yellow-400">PaymentProvider</code> interface
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-orange-500 text-white font-black flex items-center justify-center text-xs">
                      VF
                    </div>
                    <div>
                      <strong className="text-xs block text-navy-950 dark:text-white">Vodafone Cash</strong>
                      <span className="text-[10px] text-slate-400">Vodafone Cash Business API</span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setProviderName('ORANGE_MONEY');
                      setAccountName('Vodafone Cash Business');
                      setAccountIdentifier('+233 20 999 5566');
                      setIsConnectOpen(true);
                    }}
                    className="text-xs font-bold"
                  >
                    Connect
                  </Button>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-600 text-white font-black flex items-center justify-center text-xs">
                      GCB
                    </div>
                    <div>
                      <strong className="text-xs block text-navy-950 dark:text-white">GCB Bank Corporate</strong>
                      <span className="text-[10px] text-slate-400">Direct Host-to-Host Host</span>
                    </div>
                  </div>
                  <Badge variant="blue" size="sm" className="text-[10px]">
                    Adapter Ready
                  </Badge>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white font-black flex items-center justify-center text-xs">
                      GHP
                    </div>
                    <div>
                      <strong className="text-xs block text-navy-950 dark:text-white">GhIPSS Ghana</strong>
                      <span className="text-[10px] text-slate-400">Ghana Interbank Clearing</span>
                    </div>
                  </div>
                  <Badge variant="blue" size="sm" className="text-[10px]">
                    Adapter Ready
                  </Badge>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Connect Account Modal */}
        <Modal
          isOpen={isConnectOpen}
          onClose={() => setIsConnectOpen(false)}
          title="Connect Authorized Account"
          description="Link an existing payment rail to your Mobira corporate profile."
          maxWidth="md"
        >
          <div className="p-3.5 rounded-xl bg-yellow-50 dark:bg-yellow-950/40 border border-yellow-300 dark:border-yellow-700/60 mb-4 flex items-start gap-3">
            <Lock className="w-4 h-4 text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5" />
            <div className="text-xs text-yellow-950 dark:text-yellow-200">
              <strong className="block font-bold">Zero Real Financial Credential Policy</strong>
              For this competition MVP, all connections are simulated via <code>MockPaymentProvider</code>. Do not enter real PINs, banking passwords, card numbers, or OTPs.
            </div>
          </div>

          <form onSubmit={handleConnectSubmit} className="space-y-4">
            <Select
              label="Select Payment Rail / Provider"
              value={providerName}
              onChange={handleProviderSelectChange}
              options={[
                { value: 'MTN_MOMO', label: 'MTN MoMo Business (Mobile Money)' },
                { value: 'BANK_TRANSFER', label: 'Business Bank Account (GCB / EFT / Wire)' },
                { value: 'ORANGE_MONEY', label: 'Vodafone Cash Business (Mobile Money)' },
              ]}
            />

            <Input
              label="Account Display Label"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              placeholder="e.g. MTN MoMo Business"
              required
            />

            <Input
              label={
                providerName === 'BANK_TRANSFER'
                  ? 'Bank Account Identifier (IBAN / Account #)'
                  : 'Business Wallet Identifier (MSISDN)'
              }
              value={accountIdentifier}
              onChange={(e) => setAccountIdentifier(e.target.value)}
              placeholder={providerName === 'BANK_TRANSFER' ? 'GCB-0104-9184-001' : '+233 24 123 4821'}
              helperText="Identifier is immediately masked (e.g. •••• 4821) upon connection."
              required
            />

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="primary-rail-check"
                checked={isPrimary}
                onChange={(e) => setIsPrimary(e.target.checked)}
                className="w-4 h-4 rounded text-yellow-500 focus:ring-yellow-500"
              />
              <label
                htmlFor="primary-rail-check"
                className="text-xs text-slate-700 dark:text-slate-300 font-semibold cursor-pointer"
              >
                Set as primary disbursement rail for ABC Technologies Ltd
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <Button type="button" variant="outline" onClick={() => setIsConnectOpen(false)} className="text-xs">
                Cancel
              </Button>
              <Button type="submit" variant="primary" isLoading={connecting} className="text-xs font-bold">
                Connect Account (Simulated)
              </Button>
            </div>
          </form>
        </Modal>

        {/* Disconnect Account Confirmation Dialog */}
        <ConfirmDialog
          isOpen={Boolean(selectedForDisconnect)}
          onClose={() => setSelectedForDisconnect(null)}
          onConfirm={handleConfirmDisconnect}
          title="Disconnect Payment Account"
          description={`Are you sure you want to disconnect ${selectedForDisconnect?.account_name} (${selectedForDisconnect?.masked_number})? Automated disbursements using this rail will be paused.`}
          confirmLabel="Disconnect Account"
          variant="danger"
          isLoading={disconnecting}
        />
      </PageShell>
    </DashboardLayoutWrapper>
  );
}
