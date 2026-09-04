import React from 'react';
import { Users, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Recipient } from '@/types';
import { formatCurrency, formatChannelName } from '@/lib/formatters';

export interface RecipientTableProps {
  recipients: Recipient[];
  onDisburseToRecipient?: (recipient: Recipient) => void;
}

export const RecipientTable: React.FC<RecipientTableProps> = ({
  recipients,
  onDisburseToRecipient,
}) => {
  if (recipients.length === 0) {
    return (
      <Card className="p-8">
        <EmptyState
          icon={Users}
          title="No verified beneficiaries yet"
          description="Add a supplier, contractor, or employee to speed up recurring payouts."
          className="border-none bg-transparent p-0"
        />
      </Card>
    );
  }

  return (
    <Card className="p-0 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
          <thead className="bg-slate-50 dark:bg-navy-950 text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-navy-800">
            <tr>
              <th className="py-3 px-4">Beneficiary Name</th>
              <th className="py-3 px-4">Rail & Account</th>
              <th className="py-3 px-4">Identity Verification</th>
              <th className="py-3 px-4 text-right">Lifetime Disbursed</th>
              <th className="py-3 px-4 text-center">Quick Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-navy-850">
            {recipients.map((rec) => (
              <tr key={rec.id} className="hover:bg-slate-50 dark:hover:bg-navy-850/60 transition-colors">
                <td className="py-3 px-4 font-bold text-navy-950 dark:text-slate-100">
                  {rec.name}
                </td>
                <td className="py-3 px-4">
                  <span className="font-semibold text-navy-950 dark:text-slate-200">
                    {formatChannelName(rec.channel)}
                  </span>
                  <span className="block font-mono text-[11px] text-slate-500 dark:text-slate-400">
                    {rec.account_identifier}
                  </span>
                </td>
                <td className="py-3 px-4">
                  {rec.is_verified ? (
                    <Badge variant="gold" size="sm" className="gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-yellow-600 dark:text-yellow-400" />
                      <span>{rec.verified_name || 'KYC Verified'}</span>
                    </Badge>
                  ) : (
                    <Badge variant="slate" size="sm">
                      Unverified
                    </Badge>
                  )}
                </td>
                <td className="py-3 px-4 text-right font-black text-navy-950 dark:text-slate-100 tabular-nums">
                  {formatCurrency(rec.total_disbursed_xaf)}
                </td>
                <td className="py-3 px-4 text-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDisburseToRecipient?.(rec)}
                    className="gap-1 py-1 text-xs"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" /> Pay
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
