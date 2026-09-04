'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { DashboardLayoutWrapper } from '@/components/layout/DashboardLayoutWrapper';
import { PageShell } from '@/components/layout/PageShell';
import { PayVerifiedBusinessFlow } from '@/components/customer/PayVerifiedBusinessFlow';
import { BusinessVerificationBadge } from '@/components/verification/BusinessVerificationBadge';
import { PageLoadingSkeleton } from '@/components/ui/LoadingState';
import { ErrorState } from '@/components/ui/ErrorState';
import { api } from '@/services/api';
import { Business } from '@/types';

export default function PayVerifiedBusinessPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBusinesses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getBusinesses();
      setBusinesses(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch verified businesses.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBusinesses();
  }, [fetchBusinesses]);

  return (
    <DashboardLayoutWrapper>
      <PageShell
        title="Pay a Verified Business"
        subtitle="Customer-facing discovery and payment experience. Transact only with accredited legal entities."
        badge={<BusinessVerificationBadge size="sm" />}
      >
        {loading ? (
          <PageLoadingSkeleton />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchBusinesses} />
        ) : (
          <PayVerifiedBusinessFlow businesses={businesses} />
        )}
      </PageShell>
    </DashboardLayoutWrapper>
  );
}
