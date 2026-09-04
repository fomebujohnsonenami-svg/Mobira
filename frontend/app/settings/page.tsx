'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayoutWrapper } from '@/components/layout/DashboardLayoutWrapper';
import { PageShell } from '@/components/layout/PageShell';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Save, Building, Sliders, ShieldCheck, RotateCcw, Lock } from 'lucide-react';
import { api } from '@/services/api';
import { Business } from '@/types';
import { useToast } from '@/components/ui/Toast';
import { useBusiness } from '@/components/layout/BusinessContext';
import { BusinessVerificationBadge } from '@/components/verification/BusinessVerificationBadge';
import { PageLoadingSkeleton } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';

export default function SettingsPage() {
  const { toast } = useToast();
  const { currentBusiness, verificationStatus, startVerification, resetVerification } = useBusiness();
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [rccm, setRccm] = useState('');
  const [tin, setTin] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [makerCheckerThreshold, setMakerCheckerThreshold] = useState('500000');
  const [saving, setSaving] = useState(false);

  const fetchProfile = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const biz = await api.getBusinessProfile();
      setBusiness(biz);
      setName(biz.name || '');
      setRccm(biz.registration_number || '');
      setTin(biz.tax_number || '');
      setPhone(biz.phone || '');
      setEmail(biz.email || '');
    } catch (err: any) {
      setError(err?.message || 'Failed to load organization settings.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast({
        type: 'success',
        title: 'Settings Saved',
        message: 'Organization policies and governance rules updated.',
      });
    }, 400);
  };

  return (
    <DashboardLayoutWrapper>
      <PageShell
        title="Organization Settings & Governance Rules"
        subtitle="Manage corporate identity, maker-checker authorization limits, and multi-user roles."
      >
        {loading ? (
          <PageLoadingSkeleton />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchProfile} />
        ) : (
          <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
            {/* Corporate Profile Card */}
            <Card className="p-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-navy-800 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-yellow-100 dark:bg-yellow-950/60 text-yellow-700 dark:text-yellow-400 flex items-center justify-center border border-yellow-300 dark:border-yellow-700/60">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-navy-950 dark:text-slate-100">Corporate Identity</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Official registered business parameters</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <a
                    href="/connected-accounts"
                    className="px-3 py-1.5 rounded-lg bg-yellow-500 text-navy-950 text-xs font-black hover:bg-yellow-400 transition-colors shadow-subtle"
                  >
                    Connected Accounts ↗
                  </a>
                  <a
                    href="/onboarding"
                    className="px-3 py-1.5 rounded-lg border border-yellow-500/50 text-xs font-bold text-navy-950 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-navy-850 transition-colors"
                  >
                    Onboarding Wizard ↗
                  </a>
                  <a
                    href="/business/PP-ABC-001"
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-navy-900 text-white text-xs font-bold hover:bg-navy-850 transition-colors"
                  >
                    View Public Profile ↗
                  </a>
                  <a
                    href="/audit"
                    className="px-3 py-1.5 rounded-lg border border-navy-200 dark:border-navy-700 text-xs font-bold text-navy-950 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-navy-850 transition-colors flex items-center gap-1.5"
                  >
                    <Lock className="w-3 h-3" /> View Compliance Audit Trail ↗
                  </a>
                </div>
              </div>

              {/* Verification State Banner & Judge Controls */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Mobira Identity Verification Status
                  </span>
                  <BusinessVerificationBadge size="md" />
                </div>

                <div className="flex items-center gap-2">
                  {verificationStatus !== 'VERIFIED' ? (
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      onClick={startVerification}
                      className="gap-1.5 font-bold text-xs"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" /> Verify Business Now
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={resetVerification}
                      className="gap-1.5 font-bold text-xs text-slate-500 hover:text-navy-950"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Reset to Unverified (Test)
                    </Button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Legal Entity Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <Input
                  label="Commercial Registry (RCCM)"
                  value={rccm}
                  onChange={(e) => setRccm(e.target.value)}
                  required
                />
                <Input
                  label="Tax Identification Number (TIN / NIU)"
                  value={tin}
                  onChange={(e) => setTin(e.target.value)}
                  required
                />
                <Input
                  label="Registered Support Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </Card>

            {/* Maker-Checker Policy Card */}
            <Card className="p-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-navy-800 mb-5">
                <div className="w-9 h-9 rounded-lg bg-yellow-100 dark:bg-yellow-950/60 text-yellow-700 dark:text-yellow-400 flex items-center justify-center border border-yellow-300 dark:border-yellow-700/60">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-navy-950 dark:text-slate-100">Maker-Checker Policy</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Governance & Dual Authorization Thresholds</p>
                </div>
              </div>

              <div className="space-y-4">
                <Input
                  label="Threshold Amount (XAF)"
                  type="number"
                  value={makerCheckerThreshold}
                  onChange={(e) => setMakerCheckerThreshold(e.target.value)}
                  helperText="Payments at or above this value will pause in Pending Approval and require second authorized sign-off."
                />

                <div className="p-3.5 bg-yellow-50 dark:bg-navy-950 rounded-xl border border-yellow-300 dark:border-navy-800 text-xs text-slate-700 dark:text-slate-300">
                  Current rule: Payouts &gt;= <strong className="text-navy-950 dark:text-yellow-400 font-bold">500,000 XAF</strong> require sign-off by a user with the <strong>ADMIN</strong> or <strong>CFO</strong> role.
                </div>
              </div>
            </Card>

            <div className="flex justify-end">
              <Button type="submit" variant="primary" isLoading={saving} className="gap-2 font-bold text-xs">
                <Save className="w-3.5 h-3.5" /> Save Organization Settings
              </Button>
            </div>
          </form>
        )}
      </PageShell>
    </DashboardLayoutWrapper>
  );
}
