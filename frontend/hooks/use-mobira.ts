'use client';

import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { AnalyticsOverview, Business, Transaction, Recipient } from '@/types';

export function useMobira() {
  const [business, setBusiness] = useState<Business | null>(null);
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    try {
      const [biz, ov, txs, recs] = await Promise.all([
        api.getBusinessProfile(),
        api.getAnalytics(),
        api.getTransactions(),
        api.getRecipients(),
      ]);
      setBusiness(biz);
      setOverview(ov);
      setTransactions(txs);
      setRecipients(recs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return {
    business,
    overview,
    transactions,
    recipients,
    loading,
    refresh,
  };
}
