export function formatCurrency(amount: number, currency: string = 'XAF'): string {
  const formatted = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(amount);
  if (currency === 'GH₵' || currency === 'GHS') {
    return `GH₵${formatted}`;
  }
  return `${formatted} ${currency}`;
}

export function formatDate(dateString: string): string {
  if (!dateString) return '—';
  const d = new Date(dateString);
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

export function formatChannelName(channel: string): string {
  switch (channel?.toUpperCase()) {
    case 'MTN_MOMO':
      return 'MTN MoMo';
    case 'ORANGE_MONEY':
      return 'Orange Money';
    case 'BANK_TRANSFER':
      return 'Interbank EFT';
    default:
      return channel || 'Direct';
  }
}

export function getTierColor(tier: string): { bg: string; text: string; border: string; label: string } {
  switch (tier) {
    case 'GOLD_VERIFIED':
      return {
        bg: 'bg-amber-500/10 text-amber-500 border-amber-500/30',
        text: 'text-amber-500',
        border: 'border-amber-500/30',
        label: 'Gold Verified',
      };
    case 'VERIFIED_TIER_1':
      return {
        bg: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30',
        text: 'text-emerald-600',
        border: 'border-emerald-500/30',
        label: 'Tier 1 Verified',
      };
    case 'BASIC_VERIFIED':
      return {
        bg: 'bg-blue-500/10 text-blue-500 border-blue-500/30',
        text: 'text-blue-500',
        border: 'border-blue-500/30',
        label: 'Basic Verified',
      };
    default:
      return {
        bg: 'bg-slate-500/10 text-slate-500 border-slate-500/30',
        text: 'text-slate-500',
        border: 'border-slate-500/30',
        label: 'Unverified',
      };
  }
}
