'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { DashboardLayoutWrapper } from '@/components/layout/DashboardLayoutWrapper';
import { PageShell } from '@/components/layout/PageShell';
import { BusinessDirectoryTable } from '@/components/businesses/BusinessDirectoryTable';
import { PayVerifiedBusinessFlow } from '@/components/customer/PayVerifiedBusinessFlow';
import { BusinessVerificationBadge } from '@/components/verification/BusinessVerificationBadge';
import { Button } from '@/components/ui/Button';
import { ErrorState } from '@/components/ui/ErrorState';
import { CardSkeleton } from '@/components/ui/LoadingState';
import { api } from '@/services/api';
import { Business } from '@/types';
import { ShieldCheck, Search, ListFilter, Sparkles, Building2, CheckCircle2 } from 'lucide-react';

export default function BusinessesPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'DIRECTORY' | 'PAYMENT_WIZARD'>('DIRECTORY');

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getBusinesses();
      setBusinesses(data);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to load business directory. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const verifiedCount = businesses.filter(
    (b) => b.verification_tier !== 'UNVERIFIED' && b.is_active !== false
  ).length;

  return (
    <DashboardLayoutWrapper>
      <PageShell
        title={viewMode === 'DIRECTORY' ? 'Verified Business Directory' : 'Pay a Verified Business'}
        subtitle={
          viewMode === 'DIRECTORY'
            ? 'Search verified African enterprises, filter by category, location, and verified status, and inspect compliance trust badges.'
            : 'Customer-facing discovery and direct payment flow to verified African merchants.'
        }
        badge={<BusinessVerificationBadge size="sm" />}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant={viewMode === 'DIRECTORY' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setViewMode('DIRECTORY')}
              className="text-xs font-bold gap-1.5"
            >
              <Building2 className="w-3.5 h-3.5" /> Verified Directory
            </Button>
            <Button
              variant={viewMode === 'PAYMENT_WIZARD' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setViewMode('PAYMENT_WIZARD')}
              className="text-xs font-bold gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" /> Customer Checkout Flow
            </Button>
          </div>
        }
      >
        {loading ? (
          <CardSkeleton count={3} />
        ) : error ? (
          <ErrorState title="Something went wrong." message={error} onRetry={loadData} />
        ) : (
          <div className="space-y-6">
            {/* Top Trust & Directory Stat Banner */}
            <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-navy-900 dark:to-navy-850 border border-blue-200 dark:border-navy-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shrink-0 shadow-subtle">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-navy-950 dark:text-white flex items-center gap-1.5">
                    <span>National Commercial Registry & Tax Compliance Standards</span>
                    <span className="text-blue-600 dark:text-blue-400 font-black">✓</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-[11px]">
                    Only businesses with successful legal verification receive the prominent verified badge and checkmark.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-blue-200 dark:border-navy-800">
                <div className="text-right">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Accredited</div>
                  <div className="font-black text-blue-700 dark:text-blue-400 text-sm">
                    {verifiedCount} / {businesses.length} Verified
                  </div>
                </div>
                <div className="h-7 w-px bg-slate-200 dark:bg-navy-800" />
                <div className="text-right">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Coverage</div>
                  <div className="font-black text-navy-950 dark:text-white text-sm">
                    Ghana & Cameroon
                  </div>
                </div>
              </div>
            </div>

            {/* Body: Directory vs Payment Wizard */}
            {viewMode === 'DIRECTORY' ? (
              <BusinessDirectoryTable businesses={businesses} />
            ) : (
              <PayVerifiedBusinessFlow businesses={businesses} />
            )}
          </div>
        )}
      </PageShell>
    </DashboardLayoutWrapper>
  );
}
